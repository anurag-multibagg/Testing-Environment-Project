import { Worker, Job } from 'bullmq';
import { exec } from 'child_process';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

connection.on('error', (err) => {
  console.error('Redis connection error (Worker):', err);
});

const worker = new Worker(
  'daily-job',
  async (job: Job) => {
    console.log('Running daily job...');

    const run = (cmd: string) =>
      new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
          if (err) {
            console.error(`Command exectution failed: ${cmd}`);
            console.error(stderr);
            return reject(err);
          }
          console.log(`Command successfully executed: ${cmd}`);
          console.log(stdout);
          resolve(true);
        });
      });

    try {
      await run('rm -rf coverage && npm run coverage || true');
      await run('node processHtml.js');
      return true;
    } catch (err) {
      console.error('Job execution failed:', err);
      throw err;
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`Job failed: ${job?.id ?? 'any'}`, err);
});

console.log('Worker started and waiting for jobs...');
