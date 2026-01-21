import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_KEY = process.env.SYNTHETIC_API_KEY;

if (!API_KEY) {
  console.error('ERROR: SYNTHETIC_API_KEY environment variable is required');
  process.exit(1);
}

// Create server instance
const server = new Server(
  {
    name: 'synthetic-web-search-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_web',
        description: 'Search the web using Synthetic API',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query string',
            },
          },
          required: ['query'],
        },
      },
    ],
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'search_web') {
    const query = request.params.arguments?.query as string;

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
  }
  throw new Error('Unknown tool: ' + request.params.name);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Synthetic Web Search MCP Server running on stdio');
}

main().catch(console.error);
