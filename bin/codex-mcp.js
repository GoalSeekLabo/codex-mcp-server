#!/usr/bin/env node

// Import and run the main MCP server
import('../dist/index.js')
  .then(() => {
    // Main execution happens in index.js
  })
  .catch((error) => {
    console.error('Failed to start Codex MCP Server:', error);
    process.exit(1);
  });