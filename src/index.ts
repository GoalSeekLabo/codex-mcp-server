#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import chalk from "chalk";
import {
  CodexExecSchema,
  CodexAnalyzeSchema,
  CodexFixSchema,
  CodexGeneralSchema,
  CodexSearchSchema,
  CodexSearchDetailedSchema,
  CodexExecZodSchema,
  CodexAnalyzeZodSchema,
  CodexFixZodSchema,
  CodexGeneralZodSchema,
  CodexSearchZodSchema,
  CodexSearchDetailedZodSchema,
} from "./schemas.js";
import { codexExecutor } from "./codex.js";

/**
 * Codex MCP Server
 * Provides integration between OpenAI Codex CLI and Model Context Protocol
 */
class CodexMCPServer {
  private server: McpServer;

  constructor() {
    this.server = new McpServer({
      name: "codex-mcp-server",
      version: "0.1.0",
    });

    this.setupTools();
  }

  /**
   * Setup MCP tools that wrap Codex CLI functionality
   */
  private setupTools(): void {
    // Tool: codex.exec - Execute arbitrary Codex commands
    this.server.registerTool(
      "codex.exec",
      {
        title: "Codex Execute",
        description: "Execute a Codex CLI command with arbitrary prompt and arguments",
        inputSchema: CodexExecSchema,
      },
      async (params) => {
        try {
          const validatedParams = CodexExecZodSchema.parse(params);
          const result = await codexExecutor.exec(validatedParams);
          
          if (!result.success) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: `Codex execution failed: ${result.stderr || result.error || "Unknown error"}`,
                },
              ],
            };
          }

          return {
            content: [
              {
                type: "text",
                text: `✓ Codex command executed successfully (${result.duration}ms)\n\n${result.stdout || "No output"}`,
              },
            ],
          };
        } catch (error) {
          console.error(chalk.red("Error in codex.exec:"), error);
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool: codex.analyze - Analyze code files
    this.server.registerTool(
      "codex.analyze",
      {
        title: "Codex Analyze",
        description: "Analyze code files or directories using Codex CLI",
        inputSchema: CodexAnalyzeSchema,
      },
      async (params) => {
        try {
          const validatedParams = CodexAnalyzeZodSchema.parse(params);
          const result = await codexExecutor.analyze(validatedParams);
          
          if (!result.success) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: `Codex analysis failed: ${result.stderr || result.error || "Unknown error"}`,
                },
              ],
            };
          }

          return {
            content: [
              {
                type: "text",
                text: `📊 Analysis completed (${result.duration}ms)\n\n${result.stdout || "No analysis output"}`,
              },
            ],
          };
        } catch (error) {
          console.error(chalk.red("Error in codex.analyze:"), error);
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool: codex.fix - Fix issues in code
    this.server.registerTool(
      "codex.fix",
      {
        title: "Codex Fix",
        description: "Fix issues in code files using Codex CLI",
        inputSchema: CodexFixSchema,
      },
      async (params) => {
        try {
          const validatedParams = CodexFixZodSchema.parse(params);
          const result = await codexExecutor.fix(validatedParams);
          
          if (!result.success) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: `Codex fix failed: ${result.stderr || result.error || "Unknown error"}`,
                },
              ],
            };
          }

          return {
            content: [
              {
                type: "text",
                text: `🔧 Fix operation completed (${result.duration}ms)\n\n${result.stdout || "No fix output"}`,
              },
            ],
          };
        } catch (error) {
          console.error(chalk.red("Error in codex.fix:"), error);
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool: codex.general - Execute general Codex commands
    this.server.registerTool(
      "codex.general",
      {
        title: "Codex General",
        description: "Execute general Codex CLI commands with full flexibility",
        inputSchema: CodexGeneralSchema,
      },
      async (params) => {
        try {
          const validatedParams = CodexGeneralZodSchema.parse(params);
          const result = await codexExecutor.general(validatedParams);
          
          if (!result.success) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: `Codex command failed: ${result.stderr || result.error || "Unknown error"}`,
                },
              ],
            };
          }

          return {
            content: [
              {
                type: "text",
                text: `⚡ Codex command completed (${result.duration}ms)\n\n${result.stdout || "No output"}`,
              },
            ],
          };
        } catch (error) {
          console.error(chalk.red("Error in codex.general:"), error);
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool: codex.search - Simple web search
    this.server.registerTool(
      "codex.search",
      {
        title: "Codex Web Search",
        description: "Perform fast web search with structured results (title, URL, snippet)",
        inputSchema: CodexSearchSchema,
      },
      async (params) => {
        try {
          const validatedParams = CodexSearchZodSchema.parse(params);
          const result = await codexExecutor.simpleSearch(validatedParams);
          
          if (!result.success) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: `Codex search failed: ${result.stderr || result.error || "Unknown error"}`,
                },
              ],
            };
          }

          return {
            content: [
              {
                type: "text",
                text: `🔍 Web search completed (${result.duration}ms)\n\n${result.stdout || "No search results"}`,
              },
            ],
          };
        } catch (error) {
          console.error(chalk.red("Error in codex.search:"), error);
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }
    );

    // Tool: codex.search_detailed - Detailed web search
    this.server.registerTool(
      "codex.search_detailed",
      {
        title: "Codex Detailed Web Search",
        description: "Perform detailed web search with full page content for comprehensive analysis",
        inputSchema: CodexSearchDetailedSchema,
      },
      async (params) => {
        try {
          const validatedParams = CodexSearchDetailedZodSchema.parse(params);
          const result = await codexExecutor.detailedSearch(validatedParams);
          
          if (!result.success) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: `Codex detailed search failed: ${result.stderr || result.error || "Unknown error"}`,
                },
              ],
            };
          }

          return {
            content: [
              {
                type: "text",
                text: `🔍📄 Detailed web search completed (${result.duration}ms)\n\n${result.stdout || "No search results"}`,
              },
            ],
          };
        } catch (error) {
          console.error(chalk.red("Error in codex.search_detailed:"), error);
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
              },
            ],
          };
        }
      }
    );

    console.log(chalk.green("✓ Codex MCP tools registered successfully"));
  }


  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    // Check if Codex CLI is available
    const isCodexAvailable = await codexExecutor.checkCodexAvailable();
    if (!isCodexAvailable) {
      console.error(chalk.red("✗ Codex CLI is not available. Please install it first:"));
      console.error(chalk.yellow("  npm install -g @openai/codex"));
      console.error(chalk.yellow("  or"));  
      console.error(chalk.yellow("  brew install codex"));
      process.exit(1);
    }

    console.log(chalk.green("✓ Codex CLI is available"));
    console.log(chalk.blue("🚀 Starting Codex MCP Server..."));

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.log(chalk.green("✓ Codex MCP Server started successfully"));
    console.log(chalk.gray("Ready to receive MCP requests via stdio"));
  }
}

/**
 * Entry point
 */
async function main(): Promise<void> {
  try {
    const server = new CodexMCPServer();
    await server.start();
  } catch (error) {
    console.error(chalk.red("Fatal error starting Codex MCP Server:"), error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n📡 Shutting down Codex MCP Server..."));
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log(chalk.yellow("\n📡 Shutting down Codex MCP Server..."));
  process.exit(0);
});

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}