#!/usr/bin/env node

/**
 * Simple validation script for Codex MCP Server
 * This script performs basic checks without complex test runners
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log(chalk.blue('🧪 Codex MCP Server Validation'));
console.log(chalk.gray('Running basic validation checks...\n'));

let passed = 0;
let failed = 0;

function test(description, testFn) {
  try {
    testFn();
    console.log(chalk.green(`✅ ${description}`));
    passed++;
  } catch (error) {
    console.log(chalk.red(`❌ ${description}`));
    console.log(chalk.gray(`   Error: ${error.message}`));
    failed++;
  }
}

function expect(value) {
  return {
    toBe: (expected) => {
      if (value !== expected) {
        throw new Error(`Expected "${expected}" but got "${value}"`);
      }
    },
    toBeDefined: () => {
      if (value === undefined) {
        throw new Error('Expected value to be defined');
      }
    },
    toExist: () => {
      if (!existsSync(value)) {
        throw new Error(`Expected file/directory "${value}" to exist`);
      }
    },
    toHaveLength: (length) => {
      if (!value || value.length !== length) {
        throw new Error(`Expected length ${length} but got ${value ? value.length : 'undefined'}`);
      }
    },
    toContain: (item) => {
      if (!value || !value.includes(item)) {
        throw new Error(`Expected array to contain "${item}"`);
      }
    },
    not: {
      toThrow: (fn) => {
        try {
          if (typeof fn === 'function') {
            fn();
          } else {
            // If it's not a function, assume value itself shouldn't throw
          }
        } catch (error) {
          throw new Error(`Expected not to throw, but threw: ${error.message}`);
        }
      }
    }
  };
}

// Project Structure Tests
console.log(chalk.yellow('📁 Project Structure Tests'));

test('package.json should exist and be valid', () => {
  const packageJsonPath = join(projectRoot, 'package.json');
  expect(packageJsonPath).toExist();
  
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  expect(packageJson.name).toBe('codex-mcp-server');
  expect(packageJson.bin).toBeDefined();
  expect(packageJson.bin['codex-mcp']).toBeDefined();
  expect(packageJson.bin['codex-mcp-setup']).toBeDefined();
});

test('bin files should exist', () => {
  expect(join(projectRoot, 'bin', 'codex-mcp.js')).toExist();
  expect(join(projectRoot, 'bin', 'setup.js')).toExist();
});

test('built distribution files should exist', () => {
  expect(join(projectRoot, 'dist', 'index.js')).toExist();
  expect(join(projectRoot, 'dist', 'codex.js')).toExist();
  expect(join(projectRoot, 'dist', 'schemas.js')).toExist();
});

test('config files should exist', () => {
  expect(join(projectRoot, 'config', 'claude-code-mcp.json')).toExist();
});

test('setup scripts should exist', () => {
  expect(join(projectRoot, 'setup', 'install.sh')).toExist();
});

// Configuration Tests
console.log(chalk.yellow('\n⚙️  Configuration Tests'));

test('Claude Code MCP configuration should be valid', () => {
  const configPath = join(projectRoot, 'config', 'claude-code-mcp.json');
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  
  expect(config.mcpServers).toBeDefined();
  expect(config.mcpServers.codex).toBeDefined();
  expect(config.mcpServers.codex.command).toBe('codex-mcp');
  expect(config.mcpServers.codex.features.tools).toBeDefined();
  expect(config.mcpServers.codex.features.tools).toHaveLength(4);
  
  const toolNames = config.mcpServers.codex.features.tools.map(tool => tool.name);
  expect(toolNames).toContain('codex.exec');
  expect(toolNames).toContain('codex.analyze');
  expect(toolNames).toContain('codex.fix');
  expect(toolNames).toContain('codex.general');
});

// Module Loading Tests
console.log(chalk.yellow('\n📦 Module Loading Tests'));

test('schemas module should load correctly', async () => {
  const schemasModule = await import('../dist/schemas.js');
  
  expect(schemasModule.CodexExecSchema).toBeDefined();
  expect(schemasModule.CodexAnalyzeSchema).toBeDefined();
  expect(schemasModule.CodexFixSchema).toBeDefined();
  expect(schemasModule.CodexGeneralSchema).toBeDefined();
  
  expect(schemasModule.CodexExecZodSchema).toBeDefined();
  expect(schemasModule.CodexAnalyzeZodSchema).toBeDefined();
  expect(schemasModule.CodexFixZodSchema).toBeDefined();
  expect(schemasModule.CodexGeneralZodSchema).toBeDefined();
});

test('codex executor module should load correctly', async () => {
  const codexModule = await import('../dist/codex.js');
  
  expect(codexModule.CodexExecutor).toBeDefined();
  expect(codexModule.codexExecutor).toBeDefined();
});

// Schema Validation Tests
console.log(chalk.yellow('\n🔍 Schema Validation Tests'));

test('CodexExecParams should validate correctly', async () => {
  const { CodexExecZodSchema } = await import('../dist/schemas.js');
  
  // Valid params
  const validParams = {
    prompt: "test prompt",
    args: ["--help"],
    workingDirectory: "/tmp",
    timeout: 5000
  };
  
  // This should not throw
  const result = CodexExecZodSchema.parse(validParams);
  expect(result.prompt).toBe("test prompt");
});

test('CodexAnalyzeParams should validate correctly', async () => {
  const { CodexAnalyzeZodSchema } = await import('../dist/schemas.js');
  
  // Valid params
  const validParams = {
    filePath: "/path/to/file.js",
    analysisType: "security",
    workingDirectory: "/tmp"
  };
  
  // This should not throw
  const result = CodexAnalyzeZodSchema.parse(validParams);
  expect(result.filePath).toBe("/path/to/file.js");
});

// Environment Tests
console.log(chalk.yellow('\n🌍 Environment Tests'));

test('should run on Node.js 18+', () => {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));
  
  if (majorVersion < 18) {
    throw new Error(`Node.js version ${nodeVersion} is too old (required: 18+)`);
  }
});

// Summary
console.log(chalk.blue('\n📊 Validation Summary'));
console.log(chalk.green(`✅ Passed: ${passed}`));
console.log(chalk.red(`❌ Failed: ${failed}`));

if (failed === 0) {
  console.log(chalk.green('\n🎉 All validation checks passed!'));
  console.log(chalk.gray('The Codex MCP Server appears to be correctly built and configured.'));
} else {
  console.log(chalk.red('\n💥 Some validation checks failed!'));
  console.log(chalk.gray('Please review the errors above and fix the issues.'));
  process.exit(1);
}