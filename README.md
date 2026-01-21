# Synthetic Web Search MCP Server

A Model Context Protocol (MCP) server that exposes the Synthetic web search API as a tool for use with Claude and other MCP-compatible applications.

## Overview

This server provides a `search_web` tool that allows MCP clients to perform web searches using the [Synthetic API](https://api.synthetic.new/). Search results are returned as formatted JSON containing URL, title, text, and published date fields.

## Installation

```bash
npm install
```

## Configuration

The server requires a Synthetic API key. Set it using the `SYNTHETIC_API_KEY` environment variable:

```bash
export SYNTHETIC_API_KEY=your_actual_api_key_here
```

Or create a `.env` file in the project root (copy `.env.example`):

```env
SYNTHETIC_API_KEY=your_actual_api_key_here
```

## Building

Compile the TypeScript code:

```bash
npm run build
```

This creates a `dist/` directory with the compiled JavaScript files.

## Development

Run the dev server with ts-node:

```bash
npm run dev
```

Watch for file changes and rebuild automatically:

```bash
npm run watch
```

## Usage with Claude Desktop

To use this MCP server with Claude Desktop, add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "synthetic-web-search": {
      "command": "node",
      "args": ["/absolute/path/to/synthetic-web-search-mcp/dist/index.js"],
      "env": {
        "SYNTHETIC_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

Replace `/absolute/path/to/synthetic-web-search-mcp/dist/index.js` with the actual path to your project.

After adding the configuration, restart Claude Desktop. You can then use the web search tool in your conversations.

## Testing with MCP Inspector

To test the server without Claude Desktop, use the MCP inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
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

MIT
