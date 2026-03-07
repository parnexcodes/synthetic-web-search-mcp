# Synthetic Web Search MCP Server

A Model Context Protocol (MCP) server that exposes the Synthetic web search API as a tool for use with Claude and other MCP-compatible applications.

[![npm version](https://badge.fury.io/js/synthetic-web-search-mcp.svg)](https://www.npmjs.com/package/synthetic-web-search-mcp)

## Overview

This server provides a `search_web` tool that allows MCP clients to perform web searches using the [Synthetic API](https://api.synthetic.new/). Search results are returned as formatted JSON containing URL, title, text, and published date fields.

## Quick Start with Claude Code

Add the MCP server to Claude Code with a single command:

```bash
claude mcp add synthetic-web-search -e SYNTHETIC_API_KEY=your_api_key_here -- npx -y synthetic-web-search-mcp@latest
```

Replace `your_api_key_here` with your actual [Synthetic API key](https://api.synthetic.new/).

## Usage with Claude Desktop

To use this MCP server with Claude Desktop, add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "synthetic-web-search": {
      "command": "npx",
      "args": ["-y", "synthetic-web-search-mcp@latest"],
      "env": {
        "SYNTHETIC_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

After adding the configuration, restart Claude Desktop. You can then use the web search tool in your conversations.

## Usage with opencode

To use this MCP server with opencode, add the following to your opencode configuration:

```json
{
  "mcp": {
    "synthetic-web-search": {
      "type": "local",
      "command": ["npx", "-y", "synthetic-web-search-mcp@latest"],
      "environment": {
        "SYNTHETIC_API_KEY": "your_actual_api_key_here"
      },
      "enabled": true
    }
  }
}
```

Replace `your_actual_api_key_here` with your actual [Synthetic API key](https://api.synthetic.new/). Restart opencode after adding the configuration.

## Local Development & Testing

### 1. Prerequisites

- Node.js 18+
- A [Synthetic API key](https://api.synthetic.new/)

### 2. Install & build

```bash
npm install
npm run build
```

### 3. Test with MCP Inspector

The fastest way to verify the server interactively without any client configuration:

```bash
SYNTHETIC_API_KEY=your_key_here \
  npx @modelcontextprotocol/inspector node dist/index.js
```

This opens a browser UI where you can invoke `search_web` directly. Try:
- `query` only → `text` is capped at the default 1000 characters.
- `query` + `max_text_length: 200` → tighter truncation to quickly scan results.
- `query` + `max_text_length: 5000` → more content when you need full detail.

### 4. Test with Claude Code (local build)

```bash
claude mcp add synthetic-web-search \
  -e SYNTHETIC_API_KEY=your_key_here \
  -- node /absolute/path/to/synthetic-web-search-mcp/dist/index.js
```

### 5. Test with Claude Desktop (local build)

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "synthetic-web-search": {
      "command": "node",
      "args": ["/absolute/path/to/synthetic-web-search-mcp/dist/index.js"],
      "env": {
        "SYNTHETIC_API_KEY": "your_key_here"
      }
    }
  }
}
```

Restart Claude Desktop after saving the file.

## Available Tools

### search_web

Search the web using the Synthetic API.

**Arguments:**
- `query` (string, required): The search query string
- `max_text_length` (number, optional, default: `1000`): Maximum number of characters to include in the `text` field of each result. Useful for preventing large snippets from flooding the context window. Results exceeding this length are truncated with `...`. Pass a larger value when you need the full content of a result.

**Example:**
```
Search for " TypeScript documentation"
```

**Returns:**
A JSON array of search results, each containing:
- `url`: The link to the search result
- `title`: The title of the page
- `text`: A snippet or content from the page
- `published`: Publication date (if available)

## API Details

- **Endpoint**: `https://api.synthetic.new/v2/search`
- **Method**: POST
- **Authentication**: Bearer token via `Authorization` header
- **Request Body**: JSON with `query` field

## Project Structure

```
synthetic-web-search-mcp/
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
├── src/
│   └── index.ts
└── dist/          (generated after build)
    ├── index.js
    └── index.d.ts
```

## License

[MIT](https://github.com/parnexcodes/synthetic-web-search-mcp/blob/main/LICENSE)
