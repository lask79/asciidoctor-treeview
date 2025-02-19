const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Antora Build Process', () => {
  const playbookPath = path.join(__dirname, 'local-antora-playbook.yml');
  const outputDir = path.join(__dirname, 'public');
  let buildOutput;
  
  beforeAll(() => {
    // Clean up any existing output directory
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });

  test('should not register extension as Antora extension', () => {
    // First verify that extension is registered in antora section of playbook
    const playbook = yaml.load(fs.readFileSync(playbookPath, 'utf8'));
    expect(playbook.antora?.extensions).toContain('asciidoctor-treeview');

    let output;
    try {
      // Run Antora build with stacktrace for better error messages
      output = execSync(`npx antora --stacktrace ${playbookPath}`, { 
        encoding: 'utf-8',
        stdio: 'pipe'
      });
    } catch (error) {
      // Even if the command fails, we want to check the output for the warning
      output = error.stdout || error.stderr;
      // console.log('Command failed with error:', error.message);
      if (error.stderr) console.log('stderr:', error.stderr);
      if (error.stdout) console.log('stdout:', error.stdout);
    }

    // Parse JSON log lines
    const logLines = output.split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(log => log !== null);

    // Find the warning message
    const warningLog = logLines.find(log => 
      log.level === 'warn' && 
      log.name === 'antora' && 
      log.msg === 'Detected Asciidoctor extension registered as an Antora extension: asciidoctor-treeview'
    );

    console.log('Raw output:', output);
    console.log('Warning log:', warningLog);

    // The warning should not be present
    expect(warningLog).toBeUndefined();
    if (warningLog) {
      throw new Error('Extension was incorrectly registered as an Antora extension. It should be registered as an Asciidoctor extension.');
    }
  });

  afterAll(() => {
    // Clean up the output directory after tests
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });
});
