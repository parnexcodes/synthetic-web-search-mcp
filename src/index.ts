import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { tavily } from "@tavily/core";
import { z } from "zod";

const SEARCH_PROVIDER = (process.env.SEARCH_PROVIDER || "synthetic").toLowerCase();
const API_KEY = process.env.SYNTHETIC_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

if (SEARCH_PROVIDER === "tavily" && !TAVILY_API_KEY) {
  console.error("ERROR: TAVILY_API_KEY environment variable is required when SEARCH_PROVIDER=tavily");
  process.exit(1);
}

if (SEARCH_PROVIDER !== "tavily" && !API_KEY) {
  console.error("ERROR: SYNTHETIC_API_KEY environment variable is required");
  process.exit(1);
}

const server = new McpServer({
  name: "synthetic-web-search-server",
  version: "0.1.6",
});

interface SearchResult {
  url?: string;
  title?: string;
  text?: string;
  published?: string;
  [key: string]: unknown;
}

server.registerTool(
  "search_web",
  {
    description: "Search the web using Synthetic API",
    inputSchema: {
      query: z.string().describe("Search query string"),
      max_text_length: z
        .number()
        .int()
        .positive()
        .default(1000)
        .describe(
          'Maximum number of characters to include in the "text" field of each result. ' +
            "Defaults to 1000. Set higher if more detail is needed, or fetch the source URL directly for the full content.",
        ),
    },
  },
  async ({ query, max_text_length }) => {
    if (!query) {
      throw new Error("Query parameter is required");
    }

    let results: SearchResult[];

    if (SEARCH_PROVIDER === "tavily") {
      const tavilyClient = tavily({ apiKey: TAVILY_API_KEY! });
      const tavilyResponse = await tavilyClient.search(query, {
        maxResults: 10,
      });
      results = tavilyResponse.results.map((r) => ({
        url: r.url,
        title: r.title,
        text: r.content,
      }));
    } else {
      const response = await fetch("https://api.synthetic.new/v2/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Synthetic API error: ${response.status} ${response.statusText} - ${errorText}`,
        );
      }

      const data = (await response.json()) as { results: SearchResult[] };
      results = data.results;
    }

    if (Array.isArray(results)) {
      results = results.map((result) => {
        if (
          typeof result.text === "string" &&
          result.text.length > max_text_length
        ) {
          return {
            ...result,
            text: result.text.slice(0, max_text_length) + "...",
          };
        }
        return result;
      });
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Synthetic Web Search MCP Server running on stdio");
}

main().catch(console.error);
