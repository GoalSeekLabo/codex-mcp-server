import { CodexExecParams, CodexAnalyzeParams, CodexFixParams, CodexGeneralParams, ToolResult } from "./schemas.js";
/**
 * Codex CLI wrapper for safe command execution
 */
export declare class CodexExecutor {
    private readonly defaultTimeout;
    private readonly maxTimeout;
    /**
     * Check if Codex CLI is installed and accessible
     */
    checkCodexAvailable(): Promise<boolean>;
    /**
     * Execute a Codex exec command
     */
    exec(params: CodexExecParams): Promise<ToolResult>;
    /**
     * Execute a Codex analyze command
     */
    analyze(params: CodexAnalyzeParams): Promise<ToolResult>;
    /**
     * Execute a Codex fix command
     */
    fix(params: CodexFixParams): Promise<ToolResult>;
    /**
     * Execute a general Codex command
     */
    general(params: CodexGeneralParams): Promise<ToolResult>;
    /**
     * Core command execution logic with security and error handling
     */
    private executeCommand;
}
/**
 * Singleton instance of CodexExecutor
 */
export declare const codexExecutor: CodexExecutor;
//# sourceMappingURL=codex.d.ts.map