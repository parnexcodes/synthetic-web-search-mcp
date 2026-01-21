# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server that exposes Synthetic's web search API as an MCP tool. It provides a single `search_web` tool for performing web searches.

## Development Commands

```bash
# Build the project
npm run build

# Development mode (run with ts-node)
npm run dev

# Watch for changes and auto-rebuild
npm run watch

# Run the compiled server
npm start

# Test with MCP Inspector
npx @modelcontextprotocol/inspector synthetic-web-search-mcp
```

## Architecture

The server is implemented as a single-file MCP server (`src/index.ts`) with:

- **Transport**: StdioServerTransport for CLI/Claude Desktop integration
- **Single Tool**: `search_web` with one required argument (`query`)
- **API Endpoint**: `https://api.synthetic.new/v2/search`

The code flow:
1. Server initializes and validates `SYNTHETIC_API_KEY` environment variable
2. Server advertises the `search_web` tool via `ListToolsRequestSchema`
3. Clients call the tool via `CallToolRequestSchema`
4. Server makes POST request to Synthetic API with Bearer token auth
5. Results returned as formatted JSON

## Testing

No automated tests exist. Test manually using MCP Inspector:

```bash
npx @modelcontextprotocol/inspector synthetic-web-search-mcp
```

The MCP Inspector runs the server via stdio and provides a UI to invoke tools.

## Notes

- This is an ES Module project (package.json has `"type": "module"`)
- TypeScript strict mode is enabled (in tsconfig.json)
- No linting or formatting tools are configured
- The server exits with code 1 if `SYNTHETIC_API_KEY` is not set
