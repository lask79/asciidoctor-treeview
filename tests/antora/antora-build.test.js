const { describe, test, expect, beforeAll, afterAll } = require('@jest/globals');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Antora Extension', () => {
  const playbookPath = path.join(__dirname, 'local-antora-playbook.yml');
  const outputDir = path.join(__dirname, 'public');
  let buildOutput;
  
  beforeAll(() => {
    // Clean up any existing output directory
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });

  test('should register extensions in correct sections of playbook', () => {
    const playbook = yaml.load(fs.readFileSync(playbookPath, 'utf8'));
    
    // Check if extensions are registered in their proper sections
    // expect(playbook.asciidoc?.extensions).toContain('asciidoctor-treeview');
    expect(playbook.antora?.extensions).toContain('asciidoctor-treeview/antora');
  });

  test('should not show warnings about incorrect extension registration', () => {
    let output;
    try {
      // Use the shell script that we know works
      output = execSync(`${__dirname}/run-antora.sh ${playbookPath}`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
    } catch (error) {
      output = error.stdout || error.stderr;
    }

    // Parse log lines
    const logLines = output.split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(line => line !== null);

    // Debug output
    console.log('Raw output:\n', output);

    // Check for warnings about incorrect extension registration
    const warningLines = logLines.filter(line =>
      line.level === 'warn' &&
      line.msg?.includes('extension as Antora extension')
    );

    expect(warningLines).toHaveLength(0,
      'Found warnings about incorrect extension registration'
    );
  });

  test('should complete build without fatal errors', () => {
    // Debug: Print current working directory and file existence
    console.log('Current working directory:', process.cwd());
    console.log('Playbook exists:', fs.existsSync(playbookPath));
    console.log('Playbook absolute path:', path.resolve(playbookPath));
    
    // Debug: Print environment variables
    console.log('Environment variables:', {
      ANTORA_LOG_LEVEL: process.env.ANTORA_LOG_LEVEL,
      DEBUG: process.env.DEBUG
    });
    let output;
    try {
      // Use the shell script that we know works
      output = execSync(`${__dirname}/run-antora.sh ${playbookPath}`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
    } catch (error) {
      output = error.stdout || error.stderr;
    }

    // Parse log lines
    const logLines = output.split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(line => line !== null);

    // Check for fatal errors
    const fatalLines = logLines.filter(line => line.level === 'fatal');
    expect(fatalLines).toHaveLength(0,
      `Found fatal errors in build output:\n${JSON.stringify(fatalLines, null, 2)}`
    );

    // Debug log output
    console.log('Raw output:', output);
    console.log('Parsed log lines:', JSON.stringify(logLines, null, 2));

    // Verify expected info messages
    const expectedMessages = [
      'Start Antora extension',
      'Handle UICatalog files',
      'Generating treeview.css',
      'Copying css/treeview.css to _/css'
    ];

    // First check if we have any info messages at all
    const infoMessages = logLines.filter(line => line.level === 'info').map(line => line.msg);
    console.log('Info messages found:', infoMessages);

    // First check if Antora actually ran
    expect(output).toContain('=== Running Antora ===');
    expect(output).toContain('=== Antora Run Complete ===');
    
    // Extract the Antora run output (between the markers)
    const antoraOutput = output.split('=== Running Antora ===')[1]?.split('=== Antora Run Complete ===')[0] || '';
    console.log('Antora specific output:', antoraOutput);
    
    // Try to parse lines as JSON first
    const jsonLines = antoraOutput.split('\n')
      .map(line => {
        try {
          return JSON.parse(line.trim());
        } catch (e) {
          return null;
        }
      })
      .filter(line => line !== null);
    
    console.log('Parsed JSON lines:', jsonLines);
    
    // Check for expected messages in both JSON and plain text
    expectedMessages.forEach(msg => {
      const foundInJson = jsonLines.some(line => 
        line.msg && line.msg.toLowerCase().includes(msg.toLowerCase())
      );
      const foundInPlainText = antoraOutput.toLowerCase().includes(msg.toLowerCase());
      
      expect(foundInJson || foundInPlainText).toBe(true, 
        `Expected to find message: ${msg}\n` +
        `In Antora output:\n${antoraOutput}\n` +
        `Parsed JSON lines:\n${JSON.stringify(jsonLines, null, 2)}\n` +
        `Full output:\n${output}`);
    });
  });

  afterAll(() => {
    // Clean up the output directory after tests
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });
});
