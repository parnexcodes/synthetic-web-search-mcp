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

## Testing with MCP Inspector

To test the server without Claude Desktop, use the MCP inspector:

```bash
npx @modelcontextprotocol/inspector synthetic-web-search-mcp@latest
```

This will open a web interface where you can:
- List available tools
- Test the `search_web` tool with different queries
- View returned results in real-time

## Available Tools

### search_web

Search the web using the Synthetic API.

**Arguments:**
- `query` (string, required): The search query string

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
