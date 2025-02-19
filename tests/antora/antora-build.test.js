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
      output = execSync(`npx antora --stacktrace ${playbookPath}`, { 
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
    let output;
    try {
      output = execSync(`npx antora --stacktrace ${playbookPath}`, { 
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

    // Verify expected info messages
    const expectedMessages = [
      'Registering asciidoctor-treeview with config',
      'Start Antora extension',
      'Handle UICatalog files',
      'Generating treeview.css',
      'Copying css/treeview.css to _/css'
    ];

    expectedMessages.forEach(msg => {
      const found = logLines.some(line => 
        line.level === 'info' && line.msg.includes(msg)
      );
      expect(found).toBe(true, `Expected to find info message: ${msg}`);
    });
  });

  afterAll(() => {
    // Clean up the output directory after tests
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });
});
