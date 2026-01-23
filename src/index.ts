import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const API_KEY = process.env.SYNTHETIC_API_KEY;

if (!API_KEY) {
  console.error('ERROR: SYNTHETIC_API_KEY environment variable is required');
  process.exit(1);
}

const server = new McpServer({
  name: 'synthetic-web-search-server',
  version: '0.1.4',
});

server.registerTool('search_web', {
  description: 'Search the web using Synthetic API',
  inputSchema: {
    query: z.string().describe('Search query string'),
  },
}, async ({ query }) => {
  if (!query) {
    throw new Error('Query parameter is required');
  }

  const response = await fetch('https://api.synthetic.new/v2/search', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Synthetic API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data.results, null, 2),
      },
    ],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Synthetic Web Search MCP Server running on stdio');
}

main().catch(console.error);
