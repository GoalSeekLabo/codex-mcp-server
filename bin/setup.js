#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Codex MCP Server Setup Script
 * Automatically configures Claude Code to use Codex MCP Server globally
 */
class CodexMCPSetup {
  constructor() {
    this.configPath = join(homedir(), '.config', 'claude-code');
    this.mcpConfigFile = join(this.configPath, 'mcp_settings.json');
    this.templatePath = join(__dirname, '..', 'config', 'claude-code-mcp.json');
  }

  /**
   * Main setup process
   */
  async run() {
    console.log(chalk.blue('🚀 Codex MCP Server Setup'));
    console.log(chalk.gray('Configuring global MCP integration for Claude Code...\n'));

    try {
      // Step 1: Check if Codex CLI is installed
      await this.checkCodexCLI();

      // Step 2: Create config directory if needed
      this.ensureConfigDirectory();

      // Step 3: Setup MCP configuration
      this.setupMCPConfig();

      // Step 4: Verify installation
      this.verifyInstallation();

      console.log(chalk.green('\n✅ Codex MCP Server setup completed successfully!'));
      console.log(chalk.gray('\nNext steps:'));
      console.log(chalk.yellow('1. Restart Claude Code'));
      console.log(chalk.yellow('2. Codex tools should be available via MCP'));
      console.log(chalk.yellow('3. Test with: codex.exec tool'));
    } catch (error) {
      console.error(chalk.red('\n❌ Setup failed:'), error.message);
      process.exit(1);
    }
  }

  /**
   * Check if Codex CLI is available
   */
  async checkCodexCLI() {
    const { spawn } = await import('child_process');
    
    return new Promise((resolve, reject) => {
      console.log(chalk.blue('🔍 Checking Codex CLI installation...'));
      
      const child = spawn('codex', ['--version'], { stdio: 'pipe' });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log(chalk.green('  ✓ Codex CLI is installed'));
          resolve();
        } else {
          reject(new Error('Codex CLI not found. Please install it first:\n  npm install -g @openai/codex\n  or\n  brew install codex'));
        }
      });

      child.on('error', () => {
        reject(new Error('Codex CLI not found. Please install it first:\n  npm install -g @openai/codex\n  or\n  brew install codex'));
      });
    });
  }

  /**
   * Ensure config directory exists
   */
  ensureConfigDirectory() {
    console.log(chalk.blue('📁 Checking configuration directory...'));
    
    if (!existsSync(this.configPath)) {
      console.log(chalk.yellow('  ⚠️  Config directory not found, creating...'));
      mkdirSync(this.configPath, { recursive: true });
      console.log(chalk.green('  ✓ Config directory created'));
    } else {
      console.log(chalk.green('  ✓ Config directory exists'));
    }
  }

  /**
   * Setup MCP configuration
   */
  setupMCPConfig() {
    console.log(chalk.blue('⚙️  Setting up MCP configuration...'));

    let existingConfig = {};
    
    // Load existing config if it exists
    if (existsSync(this.mcpConfigFile)) {
      try {
        const content = readFileSync(this.mcpConfigFile, 'utf-8');
        existingConfig = JSON.parse(content);
        console.log(chalk.yellow('  ⚠️  Existing MCP config found, merging...'));
      } catch (error) {
        console.log(chalk.red('  ⚠️  Existing config is invalid, backing up...'));
        writeFileSync(`${this.mcpConfigFile}.backup`, readFileSync(this.mcpConfigFile));
      }
    }

    // Load template config
    if (!existsSync(this.templatePath)) {
      throw new Error(`Template config not found at ${this.templatePath}`);
    }

    const templateConfig = JSON.parse(readFileSync(this.templatePath, 'utf-8'));

    // Merge configurations
    const mergedConfig = {
      ...existingConfig,
      mcpServers: {
        ...existingConfig.mcpServers,
        ...templateConfig.mcpServers
      }
    };

    // Write merged config
    writeFileSync(this.mcpConfigFile, JSON.stringify(mergedConfig, null, 2));
    console.log(chalk.green('  ✓ MCP configuration updated'));
  }

  /**
   * Verify the installation
   */
  verifyInstallation() {
    console.log(chalk.blue('🔬 Verifying installation...'));

    // Check if config file exists and is valid
    if (!existsSync(this.mcpConfigFile)) {
      throw new Error('MCP configuration file was not created');
    }

    try {
      const config = JSON.parse(readFileSync(this.mcpConfigFile, 'utf-8'));
      if (!config.mcpServers || !config.mcpServers.codex) {
        throw new Error('Codex MCP configuration is missing');
      }
      console.log(chalk.green('  ✓ Configuration file is valid'));
    } catch (error) {
      throw new Error('Configuration file is invalid: ' + error.message);
    }

    console.log(chalk.green('  ✓ Installation verified'));
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${chalk.bold('Codex MCP Server Setup')}

Automatically configures Claude Code to use Codex MCP Server globally.

${chalk.bold('Usage:')}
  codex-mcp-setup                Set up global MCP integration
  codex-mcp-setup --help          Show this help message

${chalk.bold('Requirements:')}
  - OpenAI Codex CLI must be installed
  - Claude Code must be installed
  - OpenAI API key or ChatGPT subscription

${chalk.bold('What this does:')}
  1. Checks if Codex CLI is installed
  2. Creates Claude Code configuration directory if needed
  3. Adds Codex MCP server to Claude Code global settings
  4. Verifies the installation

${chalk.bold('After setup:')}
  - Restart Claude Code
  - Codex tools will be available via MCP protocol
  - Use tools like codex.exec, codex.analyze, codex.fix
    `);
    process.exit(0);
  }

  try {
    const setup = new CodexMCPSetup();
    await setup.run();
  } catch (error) {
    console.error(chalk.red('Setup failed:'), error.message);
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n📡 Setup interrupted by user'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n\n📡 Setup terminated'));
  process.exit(0);
});

// Run setup
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}