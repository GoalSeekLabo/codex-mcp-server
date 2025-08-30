#!/usr/bin/env node

/**
 * Quick startup test for Codex MCP Server
 * This script tests if the server can start (without Codex CLI)
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

console.log(chalk.blue('🚀 Codex MCP Server Startup Test'));
console.log(chalk.gray('Testing if the server can start (expect failure due to missing Codex CLI)...\n'));

const serverPath = join(projectRoot, 'dist', 'index.js');

const child = spawn('node', [serverPath], {
  stdio: 'pipe'
});

let stdout = '';
let stderr = '';

child.stdout.on('data', (data) => {
  stdout += data.toString();
});

child.stderr.on('data', (data) => {
  stderr += data.toString();
});

// Timeout after 3 seconds
const timeout = setTimeout(() => {
  child.kill('SIGTERM');
}, 3000);

child.on('exit', (code, signal) => {
  clearTimeout(timeout);
  
  console.log(chalk.yellow('📊 Test Results:'));
  
  if (signal === 'SIGTERM') {
    console.log(chalk.yellow('⏰ Server terminated after timeout (expected)'));
  } else {
    console.log(chalk.gray(`Exit code: ${code}`));
  }
  
  if (stdout) {
    console.log(chalk.blue('\n📤 Stdout:'));
    console.log(chalk.gray(stdout));
  }
  
  if (stderr) {
    console.log(chalk.red('\n📥 Stderr:'));
    console.log(chalk.gray(stderr));
  }
  
  // Analyze results
  if (stderr.includes('Codex CLI is not available')) {
    console.log(chalk.green('\n✅ Expected behavior: Server correctly detects missing Codex CLI'));
    console.log(chalk.gray('This is normal - install Codex CLI to run the server properly'));
  } else if (stderr.includes('Error')) {
    console.log(chalk.red('\n❌ Unexpected error occurred'));
  } else if (signal === 'SIGTERM') {
    console.log(chalk.green('\n✅ Server started successfully (terminated after timeout)'));
  } else {
    console.log(chalk.yellow('\n⚠️  Unexpected result'));
  }
});

child.on('error', (error) => {
  clearTimeout(timeout);
  console.log(chalk.red('\n❌ Failed to start server:'));
  console.log(chalk.gray(error.message));
});