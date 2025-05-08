const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const mailer = require('nodemailer');

dotenv.config();

// Paths
const testReportPath = path.resolve(__dirname, './coverage/test-report.html');
const metricsCoveragePath = path.resolve(__dirname, './coverage/lcov-report/index.html');
const processedMetricsOutput = path.resolve(__dirname, './coverage/metrics-summary.html');

// Main entry point
const main = async () => {
  try {
    await processTestReportHTML(testReportPath);
    await processMetricsHTML(metricsCoveragePath, processedMetricsOutput);
    await sendMail();
  } catch (error) {
    console.error('Main error:', error.message);
  }
};

async function processTestReportHTML(filePath) {
  try {
    console.log("Processing test-report.html");

    let html = fs.readFileSync(filePath, 'utf-8');

    // Remove console log divs
    html = html.replace(/<div[^>]*class=["'][^"']*\bsuite-consolelog\b[^"']*["'][^>]*>[\s\S]*?<\/div>/g, '');

    // Shorten file paths to just file names
    html = html.replace(/(<[^>]*class=["'][^"']*\bsuite-path\b[^"']*["'][^>]*>)([^<]*)/g, (match, prefix, content) => {
      const fileName = content.trim().split(/[/\\]/).pop();
      return `${prefix}${fileName}`;
    });

    fs.writeFileSync(filePath, html, 'utf-8');
    console.log('Test report HTML processed.');
  } catch (err) {
    console.error('Error processing test report HTML:', err);
  }
}

async function processMetricsHTML(inputPath, outputPath) {
  try {
    console.log("Processing metrics coverage");

    const html = fs.readFileSync(inputPath, 'utf-8');
    const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/);

    if (!tbodyMatch) throw new Error('No <tbody> found in index.html');

    const tbodyContent = tbodyMatch[1];
    const rowMatches = [...tbodyContent.matchAll(/<tr>([\s\S]*?)<\/tr>/g)];

    const rows = rowMatches
      .map(row => {
        const cols = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(col =>
          col[1].replace(/<[^>]*>/g, '').trim()
        );

        if (cols.length < 10 || cols.some(c => c === undefined || c === '')) return null;

        return {
          file: cols[0],
          statementsPct: cols[2],
          statements: cols[3],
          branchesPct: cols[4],
          branches: cols[5],
          functionsPct: cols[6],
          functions: cols[7],
          linesPct: cols[8],
          lines: cols[9],
        };
      })
      .filter(Boolean); // Remove nulls

    const tableRows = rows.map(r => `
      <tr>
        <td>${r.file}</td>
        <td>${r.statementsPct}</td>
        <td>${r.statements}</td>
        <td>${r.branchesPct}</td>
        <td>${r.branches}</td>
        <td>${r.functionsPct}</td>
        <td>${r.functions}</td>
        <td>${r.linesPct}</td>
        <td>${r.lines}</td>
      </tr>`).join('\n');

    const newHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Coverage Metrics Table</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
    th { background-color: #f4f4f4; }
  </style>
</head>
<body>
  <h2>Code Coverage Summary</h2>
  <table>
    <thead>
      <tr>
        <th>File</th>
        <th>Statements %</th>
        <th>Statements</th>
        <th>Branches %</th>
        <th>Branches</th>
        <th>Functions %</th>
        <th>Functions</th>
        <th>Lines %</th>
        <th>Lines</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
</body>
</html>`;

    fs.writeFileSync(outputPath, newHTML, 'utf-8');
    console.log('Metrics summary HTML written to metrics-summary.html');
  } catch (err) {
    console.error('Error processing metrics HTML:', err);
  }
}

async function sendMail() {
  try {
    const html = extractJestReportForEmail(testReportPath);

    const transporter = mailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const istDate = new Date(Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `Tests Report/Coverage ${istDate}`,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
  } catch (err) {
    console.error('Error sending mail:', err);
  }
}

function extractJestReportForEmail(htmlReportPath) {
  try {
    const htmlContent = fs.readFileSync(htmlReportPath, 'utf8');
    const $ = cheerio.load(htmlContent);

    const totalTests = $('.total-tests').text().trim();
    const passedTests = $('.passed').text().trim();
    const failedTests = $('.failed').text().trim();
    const pendingTests = $('.pending').text().trim() || '0';
    const duration = $('.duration').text().trim();

    const testResults = [];
    $('.test-result').each((i, elem) => {
      const status = $(elem).find('.status').text().trim();
      const title = $(elem).find('.test-title').text().trim();
      const suite = $(elem).find('.suite-path').text().trim();
      let message = '';
      if (status === 'failed') {
        message = $(elem).find('.error-message').text().trim();
      }
      testResults.push({ status, title, suite, message });
    });

    let emailHtml = `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 800px; margin: 0 auto;">
      <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9;">
        <h2 style="color: #333; margin-top: 0;">Test Summary</h2>
        <p>Total Tests: <strong>${totalTests}</strong></p>
        <p>Passed: <span style="color: #4CAF50; font-weight: bold;">${passedTests}</span></p>
        <p>Failed: <span style="color: #F44336; font-weight: bold;">${failedTests}</span></p>
        <p>Pending: <span style="color: #FF9800; font-weight: bold;">${pendingTests}</span></p>
        <p>Duration: ${duration}</p>
      </div>
      <h2 style="color: #333;">Test Results</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid #ddd; background-color: #f2f2f2;">Status</th>
          <th style="border: 1px solid #ddd; background-color: #f2f2f2;">Test</th>
          <th style="border: 1px solid #ddd; background-color: #f2f2f2;">Suite</th>
        </tr>`;

    testResults.forEach((test, i) => {
      const rowStyle = i % 2 === 0 ? '' : 'background-color: #f9f9f9;';
      const statusColor = {
        passed: 'color: #4CAF50; font-weight: bold;',
        failed: 'color: #F44336; font-weight: bold;',
        pending: 'color: #FF9800; font-weight: bold;'
      }[test.status.toLowerCase()] || '';

      emailHtml += `
        <tr style="${rowStyle}">
          <td style="border: 1px solid #ddd; padding: 8px; ${statusColor}">${test.status}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${test.title}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${test.suite}</td>
        </tr>`;

      if (test.message) {
        emailHtml += `
        <tr>
          <td colspan="3" style="border: 1px solid #ddd; color: #F44336; background-color: #ffebee; padding: 10px; font-family: monospace;">${test.message}</td>
        </tr>`;
      }
    });

    emailHtml += `
      </table>
    </div>`;

    return emailHtml;
  } catch (err) {
    console.error('Error parsing Jest report for email:', err);
    return '<p>Error generating report</p>';
  }
}

main();
