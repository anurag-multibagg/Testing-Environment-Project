import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');

connection.on('error', (err) => {
  console.error('Redis connection error (Scheduler):', err);
});

const queue = new Queue('daily-job', { connection });

(async () => {
  await queue.add(
    'run-daily-tasks',
    {},
    {
      repeat: { pattern: '50 2 * * *' },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );

  console.log('Scheduled daily job at 1:27 PM UTC (6:57 PM IST)');


  
  await queue.add('run-daily-tasks', {}, { removeOnComplete: true });
  console.log('Manually triggered job for immediate testing');
})();
