const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const {sendMail} = require('./sendEmail')
dotenv.config();

const testReportPath = path.resolve(__dirname, './coverage/test-report.html');
const metricsCoveragePath = path.resolve(__dirname, './coverage/lcov-report/index.html');

const main = async () => {
  try {
    const metricsReport = await generateCoverageEmailContent(metricsCoveragePath)
    const testReport = await generateTestReportEmail(testReportPath)
    await sendMail(`${metricsReport}\n\n${testReport}`);
  } catch (error) {
    console.error('Main error:', error.message);
  }
};

function generateCoverageEmailContent(filepath) {
  try {
    const htmlContent = fs.readFileSync(filepath, 'utf-8');
    const $ = cheerio.load(htmlContent);
    const overallStats = {
      statements: {
        percentage: $('.wrapper .pad1 .clearfix .pad1y:nth-child(1) .strong').text().trim(),
        fraction: $('.wrapper .pad1 .clearfix .pad1y:nth-child(1) .fraction').text().trim()
      },
      branches: {
        percentage: $('.wrapper .pad1 .clearfix .pad1y:nth-child(2) .strong').text().trim(),
        fraction: $('.wrapper .pad1 .clearfix .pad1y:nth-child(2) .fraction').text().trim()
      },
      functions: {
        percentage: $('.wrapper .pad1 .clearfix .pad1y:nth-child(3) .strong').text().trim(),
        fraction: $('.wrapper .pad1 .clearfix .pad1y:nth-child(3) .fraction').text().trim()
      },
      lines: {
        percentage: $('.wrapper .pad1 .clearfix .pad1y:nth-child(4) .strong').text().trim(),
        fraction: $('.wrapper .pad1 .clearfix .pad1y:nth-child(4) .fraction').text().trim()
      }
    };
    const fileData = [];
    $('table.coverage-summary tbody tr').each((index, element) => {
      const fileName = $(element).find('td.file').text().trim();
      const fileLink = $(element).find('td.file a').attr('href');
      const statementsPercent = $(element).find('td.pct').eq(0).text().trim();
      const statementsFraction = $(element).find('td.abs').eq(0).text().trim();
      const branchesPercent = $(element).find('td.pct').eq(1).text().trim();
      const branchesFraction = $(element).find('td.abs').eq(1).text().trim();
      const functionsPercent = $(element).find('td.pct').eq(2).text().trim();
      const functionsFraction = $(element).find('td.abs').eq(2).text().trim();
      const linesPercent = $(element).find('td.pct').eq(3).text().trim();
      const linesFraction = $(element).find('td.abs').eq(3).text().trim();
      const coverageClass = $(element).find('td.file').attr('class').replace('file ', '');
      fileData.push({
        fileName,
        fileLink,
        statementsPercent,
        statementsFraction,
        branchesPercent,
        branchesFraction,
        functionsPercent,
        functionsFraction,
        linesPercent,
        linesFraction,
        coverageClass
      });
    });
    const reportDate = $('.footer.quiet').text().trim().split('at ')[1] || new Date().toISOString();
    const htmlEmail = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Test Coverage Summary</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }
          h1, h2 {
            color: #2c3e50;
          }
          .summary-container {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 30px;
          }
          .summary-box {
            flex: 1;
            min-width: 200px;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .high {
            background-color: #dff0d8;
            border-left: 5px solid #5cb85c;
          }
          .medium {
            background-color: #fcf8e3;
            border-left: 5px solid #f0ad4e;
          }
          .low {
            background-color: #f2dede;
            border-left: 5px solid #d9534f;
          }
          .summary-box h3 {
            margin-top: 0;
            margin-bottom: 10px;
          }
          .percentage {
            font-size: 24px;
            font-weight: bold;
          }
          .fraction {
            font-size: 14px;
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          thead {
            background-color: #f8f9fa;
          }
          tr:hover {
            background-color: #f5f5f5;
          }
          .file-name {
            font-weight: 500;
          }
          .footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #777;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>Test Coverage Report</h1>
        
        <h2>Overall Coverage Summary</h2>
        <div class="summary-container">
          <div class="summary-box ${getCoverageClass(parseFloat(overallStats.statements.percentage))}">
            <h3>Statements</h3>
            <div class="percentage">${overallStats.statements.percentage}</div>
            <div class="fraction">${overallStats.statements.fraction}</div>
          </div>
          
          <div class="summary-box ${getCoverageClass(parseFloat(overallStats.branches.percentage))}">
            <h3>Branches</h3>
            <div class="percentage">${overallStats.branches.percentage}</div>
            <div class="fraction">${overallStats.branches.fraction}</div>
          </div>
          
          <div class="summary-box ${getCoverageClass(parseFloat(overallStats.functions.percentage))}">
            <h3>Functions</h3>
            <div class="percentage">${overallStats.functions.percentage}</div>
            <div class="fraction">${overallStats.functions.fraction}</div>
          </div>
          
          <div class="summary-box ${getCoverageClass(parseFloat(overallStats.lines.percentage))}">
            <h3>Lines</h3>
            <div class="percentage">${overallStats.lines.percentage}</div>
            <div class="fraction">${overallStats.lines.fraction}</div>
          </div>
        </div>
        
        <h2>File Coverage Details</h2>
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Statements</th>
              <th>Branches</th>
              <th>Functions</th>
              <th>Lines</th>
            </tr>
          </thead>
          <tbody>
            ${fileData.map(file => `
              <tr class="${file.coverageClass}">
                <td class="file-name">${file.fileName}</td>
                <td>${file.statementsPercent} (${file.statementsFraction})</td>
                <td>${file.branchesPercent} (${file.branchesFraction})</td>
                <td>${file.functionsPercent} (${file.functionsFraction})</td>
                <td>${file.linesPercent} (${file.linesFraction})</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Coverage report generated on ${reportDate}</p>
        </div>
      </body>
      </html>
    `;
    return htmlEmail;
  } catch (error) {
    console.error('Error generating coverage email content:', error);
    return `<p>Error processing coverage report: ${error.message}</p>`;
  }
}

function getCoverageClass(percentage) {
  if (percentage >= 90) return 'high';
  if (percentage >= 75) return 'medium';
  return 'low';
}

function generateTestReportEmail(filePath) {
  try {
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(htmlContent);
    const timestamp = $('#timestamp').text();
    const totalSuites = $('.summary-total').eq(0).text().match(/\d+/)[0];
    const totalTests = $('.summary-total').eq(1).text().match(/\d+/)[0];
    const passedTests = $('.summary-passed').eq(1).text().trim().split(' ')[0];
    const failedTests = $('.summary-failed').eq(1).text().trim().split(' ')[0] || '0';
    const pendingTests = $('.summary-pending').eq(1).text().trim().split(' ')[0] || '0';
    const testSuiteData = [];
    const failedTestDetails = [];
    $('.suite-container').each((i, suite) => {
      const suitePath = $(suite).find('.suite-path').text();
      const suiteTime = $(suite).find('.suite-time').text();
      const fileName = suitePath.split('\\').pop();  
      const passedCount = $(suite).find('.test-result.passed').length;
      const failedCount = $(suite).find('.test-result.failed').length;
      const pendingCount = $(suite).find('.test-result.pending').length;
      $(suite).find('.test-result.failed').each((j, failedTest) => {
        const testTitle = $(failedTest).find('.test-title').text();
        const suiteName = $(failedTest).find('.test-suitename').text();
        const errorMessage = $(failedTest).find('.failureMsg').text();
        failedTestDetails.push({
          fileName,
          suiteName,
          testTitle,
          errorMessage
        });
      });
      const slowTests = [];
      $(suite).find('.test-info').each((j, testInfo) => {
        const testTitle = $(testInfo).find('.test-title').text();
        const testDuration = $(testInfo).find('.test-duration').text();
        const durationValue = parseFloat(testDuration.replace('s', ''));
        if (durationValue > 1.0) {
          slowTests.push({
            title: testTitle,
            duration: testDuration
          });
        }
      });
      testSuiteData.push({
        fileName,
        fullPath: suitePath,
        time: suiteTime,
        isWarn: $(suite).find('.suite-time').hasClass('warn'),
        passed: passedCount,
        failed: failedCount,
        pending: pendingCount,
        total: passedCount + failedCount + pendingCount,
        slowTests
      });
    });
  
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Test Report Summary</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .summary {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .summary-box {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 15px;
            width: 30%;
            text-align: center;
          }
          .success { color: #006633; }
          .danger { color: #cc071e; }
          .warning { color: #995c00; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .slow-test {
            margin-left: 20px;
            color: #995c00;
          }
          .warn-row {
            background-color: #fff3cd !important;
          }
          .failed-test-row {
            background-color: #fbdfe0 !important;
          }
          .error-message {
            font-family: monospace;
            white-space: pre-wrap;
            background-color: #f8f8f8;
            padding: 8px;
            border-left: 3px solid #cc071e;
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Test Report Summary</h1>
          <p>${timestamp}</p>
        </div>
        
        <div class="summary">
          <div class="summary-box">
            <h3>Total Suites</h3>
            <p>${totalSuites}</p>
          </div>
          <div class="summary-box">
            <h3>Total Tests</h3>
            <p>${totalTests}</p>
          </div>
          <div class="summary-box">
            <h3>Test Results</h3>
            <p><span class="success">${passedTests} passed</span> | 
               <span class="danger">${failedTests} failed</span> | 
               <span class="warning">${pendingTests} pending</span></p>
          </div>
        </div>
        
        <h2>Test Suites</h2>
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Tests</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Pending</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            ${testSuiteData.map(suite => `
              <tr class="${suite.isWarn ? 'warn-row' : ''}${suite.failed > 0 ? ' failed-test-row' : ''}">
                <td title="${suite.fullPath}">${suite.fileName}</td>
                <td>${suite.total}</td>
                <td class="success">${suite.passed}</td>
                <td class="danger">${suite.failed}</td>
                <td class="warning">${suite.pending}</td>
                <td>${suite.time}</td>
              </tr>
              ${suite.slowTests.length > 0 ? `
                <tr>
                  <td colspan="6">
                    <div class="slow-tests">
                      <strong>Slow Tests:</strong>
                      ${suite.slowTests.map(slowTest => `
                        <div class="slow-test">• ${slowTest.title} (${slowTest.duration})</div>
                      `).join('')}
                    </div>
                  </td>
                </tr>
              ` : ''}
            `).join('')}
          </tbody>
        </table>
        
        ${failedTestDetails.length > 0 ? `
        <h2>Failed Tests Description</h2>
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Test Suite</th>
              <th>Test Case</th>
              <th>Error Description</th>
            </tr>
          </thead>
          <tbody>
            ${failedTestDetails.map(test => `
              <tr class="failed-test-row">
                <td>${test.fileName}</td>
                <td>${test.suiteName}</td>
                <td>${test.testTitle}</td>
                <td>
                  <div class="error-message">${test.errorMessage.trim()}</div>
                  <p><strong>Issue:</strong> Expected toast to be called with "Logged in successfully" but it was not called at all.</p>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}
        
        <div>
          <h3>Performance Summary</h3>
          <p>Suites with execution time over 10s: ${testSuiteData.filter(s => s.isWarn).length}</p>
          <p>Slow tests (over 1s): ${testSuiteData.reduce((count, suite) => count + suite.slowTests.length, 0)}</p>
        </div>
      </body>
      </html>
    `;
  } catch (error) {
    console.error('Error generating test report email:', error);
    return `<p>Error generating test report: ${error.message}</p>`;
  }
}

main();