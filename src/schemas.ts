import { z } from "zod";

/**
 * MCP Raw Shape schemas (for registerTool inputSchema)
 */
export const CodexExecSchema = {
  prompt: z.string().describe("The prompt or command to execute with Codex CLI"),
  args: z.array(z.string()).optional().describe("Additional command line arguments"),
  workingDirectory: z.string().optional().describe("Working directory for the command"),
  timeout: z.number().min(1000).max(300000).optional().describe("Timeout in milliseconds (1s-5min)")
} as const;

export const CodexAnalyzeSchema = {
  filePath: z.string().describe("Path to the file or directory to analyze"),
  analysisType: z.enum(["security", "performance", "quality", "all"]).optional().describe("Type of analysis to perform"),
  workingDirectory: z.string().optional().describe("Working directory for the command")
} as const;

export const CodexFixSchema = {
  filePath: z.string().describe("Path to the file to fix"),
  issueDescription: z.string().describe("Description of the issue to fix"),
  workingDirectory: z.string().optional().describe("Working directory for the command"),
  dryRun: z.boolean().optional().describe("Whether to perform a dry run without making changes")
} as const;

export const CodexGeneralSchema = {
  command: z.string().describe("Codex CLI command to execute"),
  args: z.array(z.string()).optional().describe("Command line arguments"),
  workingDirectory: z.string().optional().describe("Working directory for the command"),
  timeout: z.number().min(1000).max(300000).optional().describe("Timeout in milliseconds")
} as const;

/**
 * Zod object schemas for validation
 */
export const CodexExecZodSchema = z.object(CodexExecSchema);
export const CodexAnalyzeZodSchema = z.object(CodexAnalyzeSchema);
export const CodexFixZodSchema = z.object(CodexFixSchema);
export const CodexGeneralZodSchema = z.object(CodexGeneralSchema);

/**
 * Type definitions exported from schemas
 */
export type CodexExecParams = z.infer<typeof CodexExecZodSchema>;
export type CodexAnalyzeParams = z.infer<typeof CodexAnalyzeZodSchema>;
export type CodexFixParams = z.infer<typeof CodexFixZodSchema>;
export type CodexGeneralParams = z.infer<typeof CodexGeneralZodSchema>;

/**
 * Tool execution result schema
 */
export const ToolResultSchema = z.object({
  success: z.boolean(),
  stdout: z.string().optional(),
  stderr: z.string().optional(),
  exitCode: z.number().optional(),
  duration: z.number().optional(),
  error: z.string().optional()
});

export type ToolResult = z.infer<typeof ToolResultSchema>;