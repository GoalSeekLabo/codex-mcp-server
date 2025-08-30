import { describe, test, expect, beforeAll } from '@jest/globals';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Codex MCP Server Basic Tests', () => {
  const projectRoot = join(__dirname, '..');
  
  describe('Project Structure', () => {
    test('should have required package.json', () => {
      const packageJsonPath = join(projectRoot, 'package.json');
      expect(existsSync(packageJsonPath)).toBe(true);
      
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      expect(packageJson.name).toBe('codex-mcp-server');
      expect(packageJson.bin).toBeDefined();
      expect(packageJson.bin['codex-mcp']).toBeDefined();
      expect(packageJson.bin['codex-mcp-setup']).toBeDefined();
    });
    
    test('should have required bin files', () => {
      expect(existsSync(join(projectRoot, 'bin', 'codex-mcp.js'))).toBe(true);
      expect(existsSync(join(projectRoot, 'bin', 'setup.js'))).toBe(true);
    });
    
    test('should have built distribution files', () => {
      expect(existsSync(join(projectRoot, 'dist', 'index.js'))).toBe(true);
      expect(existsSync(join(projectRoot, 'dist', 'codex.js'))).toBe(true);
      expect(existsSync(join(projectRoot, 'dist', 'schemas.js'))).toBe(true);
    });
    
    test('should have config files', () => {
      expect(existsSync(join(projectRoot, 'config', 'claude-code-mcp.json'))).toBe(true);
    });
    
    test('should have setup scripts', () => {
      expect(existsSync(join(projectRoot, 'setup', 'install.sh'))).toBe(true);
    });
  });
  
  describe('Configuration Files', () => {
    test('should have valid Claude Code MCP configuration', () => {
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
  });
  
  describe('Module Loading', () => {
    test('should be able to import schemas', async () => {
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
    
    test('should be able to import codex executor', async () => {
      const codexModule = await import('../dist/codex.js');
      
      expect(codexModule.CodexExecutor).toBeDefined();
      expect(codexModule.codexExecutor).toBeDefined();
    });
  });
  
  describe('Schema Validation', () => {
    test('should validate CodexExecParams correctly', async () => {
      const { CodexExecZodSchema } = await import('../dist/schemas.js');
      
      // Valid params
      const validParams = {
        prompt: "test prompt",
        args: ["--help"],
        workingDirectory: "/tmp",
        timeout: 5000
      };
      
      expect(() => CodexExecZodSchema.parse(validParams)).not.toThrow();
      
      // Invalid params (missing required field)
      const invalidParams = {
        args: ["--help"]
      };
      
      expect(() => CodexExecZodSchema.parse(invalidParams)).toThrow();
    });
    
    test('should validate CodexAnalyzeParams correctly', async () => {
      const { CodexAnalyzeZodSchema } = await import('../dist/schemas.js');
      
      // Valid params
      const validParams = {
        filePath: "/path/to/file.js",
        analysisType: "security",
        workingDirectory: "/tmp"
      };
      
      expect(() => CodexAnalyzeZodSchema.parse(validParams)).not.toThrow();
      
      // Invalid params (missing required field)
      const invalidParams = {
        analysisType: "security"
      };
      
      expect(() => CodexAnalyzeZodSchema.parse(invalidParams)).toThrow();
    });
  });
});

describe('Environment Requirements', () => {
  test('should run on Node.js 18+', () => {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''));
    expect(majorVersion).toBeGreaterThanOrEqual(18);
  });
});