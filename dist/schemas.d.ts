import { z } from "zod";
/**
 * MCP Raw Shape schemas (for registerTool inputSchema)
 */
export declare const CodexExecSchema: {
    readonly prompt: z.ZodString;
    readonly args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    readonly workingDirectory: z.ZodOptional<z.ZodString>;
    readonly timeout: z.ZodOptional<z.ZodNumber>;
};
export declare const CodexAnalyzeSchema: {
    readonly filePath: z.ZodString;
    readonly analysisType: z.ZodOptional<z.ZodEnum<["security", "performance", "quality", "all"]>>;
    readonly workingDirectory: z.ZodOptional<z.ZodString>;
};
export declare const CodexFixSchema: {
    readonly filePath: z.ZodString;
    readonly issueDescription: z.ZodString;
    readonly workingDirectory: z.ZodOptional<z.ZodString>;
    readonly dryRun: z.ZodOptional<z.ZodBoolean>;
};
export declare const CodexGeneralSchema: {
    readonly command: z.ZodString;
    readonly args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    readonly workingDirectory: z.ZodOptional<z.ZodString>;
    readonly timeout: z.ZodOptional<z.ZodNumber>;
};
/**
 * Zod object schemas for validation
 */
export declare const CodexExecZodSchema: z.ZodObject<{
    readonly prompt: z.ZodString;
    readonly args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    readonly workingDirectory: z.ZodOptional<z.ZodString>;
    readonly timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    prompt: string;
    args?: string[] | undefined;
    workingDirectory?: string | undefined;
    timeout?: number | undefined;
}, {
    prompt: string;
    args?: string[] | undefined;
    workingDirectory?: string | undefined;
    timeout?: number | undefined;
}>;
export declare const CodexAnalyzeZodSchema: z.ZodObject<{
    readonly filePath: z.ZodString;
    readonly analysisType: z.ZodOptional<z.ZodEnum<["security", "performance", "quality", "all"]>>;
    readonly workingDirectory: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    workingDirectory?: string | undefined;
    analysisType?: "security" | "performance" | "quality" | "all" | undefined;
}, {
    filePath: string;
    workingDirectory?: string | undefined;
    analysisType?: "security" | "performance" | "quality" | "all" | undefined;
}>;
export declare const CodexFixZodSchema: z.ZodObject<{
    readonly filePath: z.ZodString;
    readonly issueDescription: z.ZodString;
    readonly workingDirectory: z.ZodOptional<z.ZodString>;
    readonly dryRun: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    filePath: string;
    issueDescription: string;
    workingDirectory?: string | undefined;
    dryRun?: boolean | undefined;
}, {
    filePath: string;
    issueDescription: string;
    workingDirectory?: string | undefined;
    dryRun?: boolean | undefined;
}>;
export declare const CodexGeneralZodSchema: z.ZodObject<{
    readonly command: z.ZodString;
    readonly args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    readonly workingDirectory: z.ZodOptional<z.ZodString>;
    readonly timeout: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    command: string;
    args?: string[] | undefined;
    workingDirectory?: string | undefined;
    timeout?: number | undefined;
}, {
    command: string;
    args?: string[] | undefined;
    workingDirectory?: string | undefined;
    timeout?: number | undefined;
}>;
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
export declare const ToolResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    stdout: z.ZodOptional<z.ZodString>;
    stderr: z.ZodOptional<z.ZodString>;
    exitCode: z.ZodOptional<z.ZodNumber>;
    duration: z.ZodOptional<z.ZodNumber>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    success: boolean;
    stdout?: string | undefined;
    stderr?: string | undefined;
    exitCode?: number | undefined;
    duration?: number | undefined;
    error?: string | undefined;
}, {
    success: boolean;
    stdout?: string | undefined;
    stderr?: string | undefined;
    exitCode?: number | undefined;
    duration?: number | undefined;
    error?: string | undefined;
}>;
export type ToolResult = z.infer<typeof ToolResultSchema>;
//# sourceMappingURL=schemas.d.ts.map