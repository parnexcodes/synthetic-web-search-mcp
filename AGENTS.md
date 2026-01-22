# AGENTS.md

This file provides guidance to AI agents working with this repository.

## Build & Development Commands

```bash
# Build the project (TypeScript compilation)
npm run build

# Run in development mode with ts-node
npm run dev

# Watch for changes and auto-rebuild
npm run watch

# Run the compiled server
npm start

# Test with MCP Inspector (manual testing)
npx @modelcontextprotocol/inspector synthetic-web-search-mcp
```

**Note**: No automated test suite exists. Use MCP Inspector for manual testing. No linting or formatting tools are configured.

## Code Style Guidelines

### Imports
- Use ES Module syntax with `.js` extensions in import paths (required for ESM projects)
  - ✅ `import { Server } from '@modelcontextprotocol/sdk/server/index.js';`
  - ❌ `import { Server } from '@modelcontextprotocol/sdk/server/index';`
- Group imports by source (external packages first, then internal modules)
- Use named exports over default exports for better tree-shaking

### TypeScript Configuration
- Strict mode is enabled in tsconfig.json
- Target: ES2022, Module: ES2022
- Always use `type` assertions sparingly; prefer proper type annotations
- Use `await async` for all asynchronous operations
- No `any` types allowed (strict mode enforcement)

### Naming Conventions
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_KEY`)
- Variables/functions: `camelCase` (e.g., `searchWeb`, `response`)
- Classes: `PascalCase` (e.g., `Server`, `Transport`)
- Interface/type definitions: `PascalCase` (e.g., `SearchRequest`, `ToolResponse`)
- File names: `kebab-case` or `camelCase` for TypeScript files

### Formatting & Style
- **No comments** in code unless explicitly requested
- Use 2-space indentation (project default)
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use async/await instead of Promise chains
- Use `const` by default, `let` only when reassignment is needed
- Use template literals for string interpolation

### Error Handling
- Use `console.error()` for error messages to stderr (MCP protocol requirement)
- Exit with code 1 on critical failures: `process.exit(1)`
- Throw descriptive `Error` objects with context:
  ```typescript
  throw new Error('Query parameter is required');
  throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
  ```
- Validate environment variables at entry point and exit early
- Always check `response.ok` for HTTP requests before parsing JSON

### HTTP Requests
- Use global `fetch` API (no additional library needed)
- Always set `Content-Type: application/json` for POST requests
- Use Bearer token authentication in Authorization header
- Parse response as JSON only after checking `response.ok`

## Architecture Patterns

### MCP Server Structure
- Single entry point: `src/index.ts`
- Use `@modelcontextprotocol/sdk` for server implementation
- Server type: `StdioServerTransport` (CLI integration)
- Tools registered via `ListToolsRequestSchema` and called via `CallToolRequestSchema`

### Tool Implementation Pattern
```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'tool_name') {
    // Validate arguments
    const param = request.params.arguments?.param as string;
    if (!param) throw new Error('Parameter is required');
    
    // Perform operation
    const response = await fetch('...');
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();
    
    // Return MCP response format
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
    };
  }
  throw new Error('Unknown tool: ' + request.params.name);
});
```

### Environment Configuration
- Require `SYNTHETIC_API_KEY` environment variable
- Exit with code 1 and print error message if missing
- Use `.env.example` as template for environment variables
- Never commit `.env` files

## Project Constraints

- **ES Module project**: Must use `.js` extension in imports
- **Node.js runtime**: No browser-specific APIs
- **No test framework**: Manual testing only via MCP Inspector
- **No linting/formatting tools**: Code quality through TypeScript strict mode
- **Single-file architecture**: Keep server logic in one file if possible
- **Stdio transport**: Server communicates via stdin/stdout, not HTTP

## Adding New Tools

1. Add tool schema to `ListToolsRequestSchema` handler
2. Add tool logic to `CallToolRequestSchema` handler
3. Follow naming convention: `snake_case` for tool names
4. Include `inputSchema` with JSON Schema validation
5. Return results in MCP format: `{ content: [{ type: 'text', text: '...' }] }`
6. Build and test with MCP Inspector before committing