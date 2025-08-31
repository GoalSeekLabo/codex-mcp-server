import { spawn, SpawnOptions } from "node:child_process";
import { join } from "node:path";
import chalk from "chalk";
import { CodexExecParams, CodexAnalyzeParams, CodexFixParams, CodexGeneralParams, CodexSearchParams, CodexSearchDetailedParams, ToolResult } from "./schemas.js";

/**
 * Codex CLI wrapper for safe command execution
 */
export class CodexExecutor {
  private readonly defaultTimeout = 30000; // 30 seconds
  private readonly maxTimeout = 300000; // 5 minutes

  /**
   * Check if Codex CLI is installed and accessible
   */
  async checkCodexAvailable(): Promise<boolean> {
    try {
      const result = await this.executeCommand(["--version"], { timeout: 5000 });
      return result.success;
    } catch {
      return false;
    }
  }

  /**
   * Execute a Codex exec command
   */
  async exec(params: CodexExecParams): Promise<ToolResult> {
    const { prompt, args = [], workingDirectory, timeout } = params;
    
    const cmdArgs = ["exec", prompt, ...args];
    const options: ExecutionOptions = {
      workingDirectory,
      timeout: timeout || this.defaultTimeout
    };

    return this.executeCommand(cmdArgs, options);
  }

  /**
   * Execute a Codex analyze command
   */
  async analyze(params: CodexAnalyzeParams): Promise<ToolResult> {
    const { filePath, analysisType = "all", workingDirectory } = params;
    
    const cmdArgs = ["analyze", filePath];
    if (analysisType !== "all") {
      cmdArgs.push("--type", analysisType);
    }

    const options: ExecutionOptions = {
      workingDirectory,
      timeout: this.defaultTimeout
    };

    return this.executeCommand(cmdArgs, options);
  }

  /**
   * Execute a Codex fix command
   */
  async fix(params: CodexFixParams): Promise<ToolResult> {
    const { filePath, issueDescription, workingDirectory, dryRun = false } = params;
    
    const cmdArgs = ["fix", filePath, "--description", issueDescription];
    if (dryRun) {
      cmdArgs.push("--dry-run");
    }

    const options: ExecutionOptions = {
      workingDirectory,
      timeout: this.defaultTimeout * 2 // Fix operations may take longer
    };

    return this.executeCommand(cmdArgs, options);
  }

  /**
   * Execute a general Codex command
   */
  async general(params: CodexGeneralParams): Promise<ToolResult> {
    const { command, args = [], workingDirectory, timeout } = params;
    
    const cmdArgs = [command, ...args];
    const options: ExecutionOptions = {
      workingDirectory,
      timeout: timeout || this.defaultTimeout
    };

    return this.executeCommand(cmdArgs, options);
  }

  /**
   * Execute a simple web search with Codex CLI
   */
  async simpleSearch(params: CodexSearchParams): Promise<ToolResult> {
    const { query, provider = "bing", workingDirectory, timeout } = params;
    
    const cmdArgs = ["--enable-web", "--web-mode", "on", "exec", query];
    
    // Add provider configuration if not default
    if (provider !== "bing") {
      cmdArgs.unshift("-c", `tools.web_search.provider="${provider}"`);
    }

    const options: ExecutionOptions = {
      workingDirectory,
      timeout: timeout || 30000 // 30 seconds for simple search
    };

    return this.executeCommand(cmdArgs, options);
  }

  /**
   * Execute a detailed web search with Codex CLI
   */
  async detailedSearch(params: CodexSearchDetailedParams): Promise<ToolResult> {
    const { query, provider = "bing", maxPages = 3, workingDirectory, timeout } = params;
    
    // Use a more detailed prompt to trigger detailed search mode
    const detailedQuery = `Search for "${query}" and provide detailed information including code examples, tutorials, or documentation. Get full content from top ${maxPages} result(s).`;
    
    const cmdArgs = ["--enable-web", "--web-mode", "on", "exec", detailedQuery];
    
    // Add provider configuration if not default
    if (provider !== "bing") {
      cmdArgs.unshift("-c", `tools.web_search.provider="${provider}"`);
    }

    const options: ExecutionOptions = {
      workingDirectory,
      timeout: timeout || 60000 // 60 seconds for detailed search
    };

    return this.executeCommand(cmdArgs, options);
  }

  /**
   * Core command execution logic with security and error handling
   */
  private async executeCommand(args: string[], options: ExecutionOptions = {}): Promise<ToolResult> {
    const startTime = Date.now();
    const {
      workingDirectory,
      timeout = this.defaultTimeout,
      env = process.env
    } = options;

    // Validate timeout
    const safeTimeout = Math.min(Math.max(timeout, 1000), this.maxTimeout);

    // Prepare spawn options
    const spawnOptions: SpawnOptions = {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...env },
      cwd: workingDirectory || process.cwd(),
      timeout: safeTimeout
    };

    // Log command execution (for debugging)
    console.log(chalk.blue("Executing Codex command:"), chalk.cyan(`codex ${args.join(" ")}`));
    if (workingDirectory) {
      console.log(chalk.gray("Working directory:"), chalk.cyan(workingDirectory));
    }

    return new Promise((resolve) => {
      let stdout = "";
      let stderr = "";

      const child = spawn("codex", args, spawnOptions);

      // Handle stdout
      child.stdout?.on("data", (data: Buffer) => {
        stdout += data.toString();
      });

      // Handle stderr
      child.stderr?.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      // Handle process completion
      child.on("close", (code) => {
        const duration = Date.now() - startTime;
        const success = code === 0;

        if (success) {
          console.log(chalk.green("✓ Codex command completed successfully"));
        } else {
          console.log(chalk.red(`✗ Codex command failed with exit code ${code}`));
        }

        resolve({
          success,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: code || 0,
          duration
        });
      });

      // Handle errors (including timeout)
      child.on("error", (error) => {
        const duration = Date.now() - startTime;
        console.log(chalk.red("✗ Codex command error:"), error.message);

        resolve({
          success: false,
          stderr: error.message,
          exitCode: -1,
          duration,
          error: error.message
        });
      });
    });
  }
}

/**
 * Execution options interface
 */
interface ExecutionOptions {
  workingDirectory?: string;
  timeout?: number;
  env?: NodeJS.ProcessEnv;
}

/**
 * Singleton instance of CodexExecutor
 */
export const codexExecutor = new CodexExecutor();