# n8n-nodes-firecrawl-v2

[![npm version](https://img.shields.io/npm/v/n8n-nodes-firecrawl-v2)](https://www.npmjs.com/package/n8n-nodes-firecrawl-v2) [![npm downloads](https://img.shields.io/npm/dm/n8n-nodes-firecrawl-v2)](https://www.npmjs.com/package/n8n-nodes-firecrawl-v2) [![license](https://img.shields.io/npm/l/n8n-nodes-firecrawl-v2)](LICENSE)

Community node for [Firecrawl](https://firecrawl.dev) **v2 API** on n8n. Scrape, crawl, map, search, and extract web content with full JavaScript rendering and AI-powered extraction.

Works against both **Firecrawl Cloud** and a **self-hosted Firecrawl** instance: point the credential Base URL wherever your API lives.

> **Requires self-hosted n8n.** This node is not n8n-verified, and [unverified community nodes are not available on n8n Cloud](https://docs.n8n.io/integrations/community-nodes/installation-and-management/). If you are on n8n Cloud, our [n8n-nodes-zalo-platform](https://github.com/hecigo/n8n-nodes-zalo-platform) is verified and installs straight from the nodes panel.

Built by [hecigo](https://hecigo.com) — Middleware & Integration Lab.

**Guides:** [Firecrawl on n8n: picking the right operation](https://hecigo.com/blog/n8n-firecrawl-node-choosing-the-right-operation/) (English) · [Detailed Guide](https://hecigo.com/blog/toi-uu-hoa-quy-trinh-thu-thap-du-lieu-web-cho-doanh-nghiep-viet-voi-n8n-va-firec) (Vietnamese)

## Installation

### Self-hosted n8n

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-firecrawl-v2`
4. Agree to the risks and click **Install**

### Manual (Self-Hosted)

```bash
cd ~/.n8n
npm install n8n-nodes-firecrawl-v2
```

Restart n8n after installation.

## Credentials

| Field | Default | Description |
|-------|---------|-------------|
| Base URL | `https://api.firecrawl.dev/v2` | Change for self-hosted. **Must include `/v2`**. |
| API Key | | Your Firecrawl API key |

Authentication: `Authorization: Bearer {apiKey}`. Tested via `POST /scrape` on `https://example.com`.

## Operations

### 1. Scrape

Scrape content from a single URL with JS rendering.

**Endpoint:** `POST /scrape`

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | String | | Target URL (required) |

**Scrape Options:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `formats` | `markdown` | `markdown`, `html`, `rawHtml`, `links`, `screenshot`, `json`, `summary`, `images`, `audio`, `changeTracking` |
| `onlyMainContent` | `true` | Strip headers, nav, footers |
| `includeTags` | | CSS selectors to keep (e.g., `article, .content`) |
| `excludeTags` | | CSS selectors to remove (e.g., `nav, .sidebar`) |
| `waitFor` | `0` | Wait for JS render (ms). Increase for SPA pages. |
| `timeout` | `30000` | Request timeout (ms), max 300,000 |
| `mobile` | `false` | Emulate mobile viewport |
| `blockAds` | `true` | Block ads and cookie popups |
| `proxy` | `auto` | Proxy: `auto`, `basic`, `enhanced` |
| `locationCountry` | | ISO country code (e.g., `VN`, `US`) |
| `locationLanguages` | | Locale codes (e.g., `vi-VN, en-US`) |

**Sample output:**

```json
{
  "markdown": "# Page Title\n\nExtracted content...",
  "metadata": {
    "title": "Page Title",
    "sourceURL": "https://example.com",
    "statusCode": 200
  }
}
```

### 2. Crawl

Crawl an entire website. Async job with optional polling.

**Endpoint:** `POST /crawl`

| Parameter | Default | Description |
|-----------|---------|-------------|
| `crawlUrl` | | Starting URL (required) |
| `waitForCompletion` | `false` | Poll until job finishes |
| `maxPollTime` | `300` | Max wait in seconds |

**Crawl Options:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `limit` | `50` | Max pages. Firecrawl's own default is 10000 if you omit the option. |
| `maxDiscoveryDepth` | `2` | Max link depth |
| `includePaths` | | Regex patterns to include (e.g., `/blog/*`) |
| `excludePaths` | | Regex patterns to exclude (e.g., `/admin/*`) |
| `sitemap` | `include` | `include`, `skip`, or `only` |
| `crawlEntireDomain` | `false` | Follow sibling/parent links |
| `allowExternalLinks` | `false` | Follow external links |
| `allowSubdomains` | `false` | Crawl subdomains |
| `delay` | `0` | Seconds between requests (forces concurrency=1) |
| `formats` | `markdown` | Output format per page |
| `onlyMainContent` | `true` | Strip boilerplate |

> When `waitForCompletion` is off, output only contains the job `id`. Use **Get Crawl Status** to fetch results. Polling interval: 2 seconds.

### 3. Get Crawl Status

**Endpoint:** `GET /crawl/{crawlId}` | **Parameter:** `crawlId` (job ID)

### 4. Cancel Crawl

**Endpoint:** `DELETE /crawl/{crawlId}` | **Parameter:** `cancelCrawlId` (job ID)

### 5. Map

Discover all URLs on a website without scraping content. Faster than Crawl.

**Endpoint:** `POST /map`

| Parameter | Default | Description |
|-----------|---------|-------------|
| `mapUrl` | | Starting URL (required) |
| `search` | | Search query to rank by relevance |
| `includeSubdomains` | `true` | Include subdomain URLs |
| `limit` | `50` | Max URLs, capped at 100,000 |
| `ignoreQueryParameters` | `true` | Deduplicate by stripping query strings |
| `ignoreCache` | `false` | Bypass sitemap cache |

### 6. Search

Web search with optional page scraping.

**Endpoint:** `POST /search`

| Parameter | Default | Description |
|-----------|---------|-------------|
| `searchQuery` | | Keywords, max 500 chars (required) |
| `limit` | `50` | Results count, capped at 100 |
| `country` | `US` | ISO country code |
| `tbs` | Any Time | Time filter: past hour/day/week/month/year |
| `formats` | `markdown` | Content format for results |
| `onlyMainContent` | `true` | Strip boilerplate |

### 7. Extract

AI-powered structured data extraction using natural language prompts.

**Endpoint:** `POST /extract`

| Parameter | Default | Description |
|-----------|---------|-------------|
| `extractUrls` | | Comma-separated URLs (glob patterns supported: `https://example.com/*`) |
| `extractPrompt` | | Natural language instruction |
| `extractSchema` | | Optional JSON Schema for output structure |
| `extractWaitForCompletion` | `true` | Wait for results (**defaults ON**, unlike Crawl/Batch) |
| `extractMaxPollTime` | `300` | Max wait in seconds |

**Extract Options:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enableWebSearch` | `false` | Use web search for additional data |
| `showSources` | `false` | Include source URLs |

**Example:**

```
Prompt: "Extract company name, phone, address from this page"
Schema: {
  "type": "object",
  "properties": {
    "company_name": { "type": "string" },
    "phone": { "type": "string" },
    "address": { "type": "string" }
  }
}
```

### 8. Get Extract Status

**Endpoint:** `GET /extract/{extractId}` | **Parameter:** `extractId` (job ID)

### 9. Batch Scrape

Scrape multiple URLs asynchronously.

**Endpoint:** `POST /batch/scrape`

| Parameter | Default | Description |
|-----------|---------|-------------|
| `batchUrls` | | Comma-separated URLs |
| `batchWaitForCompletion` | `false` | Wait for all to finish |
| `batchMaxPollTime` | `300` | Max wait in seconds |

Options: `formats`, `onlyMainContent`, `maxConcurrency`.

### 10. Get Batch Scrape Status

**Endpoint:** `GET /batch/scrape/{batchScrapeId}` | **Parameter:** `batchScrapeId` (job ID)

## Technical Notes

- **Async operations** (Crawl, Extract, Batch Scrape) return a job ID by default. Enable `waitForCompletion` to get results inline. Polling interval: 2 seconds.
- **Extract defaults to `waitForCompletion: true`**, while Crawl and Batch Scrape default to `false`.
- **Scrape supports 10 formats** (including `json`, `summary`, `audio`). Crawl, Search, and Batch Scrape support 5 basic formats.
- **Comma-separated inputs:** `includeTags`, `excludeTags`, `includePaths`, `excludePaths`, `extractUrls`, `batchUrls` all accept comma-separated lists.
- **Self-hosted Base URL** must include `/v2` (e.g., `http://firecrawl:3002/v2`).
- **Error handling:** Supports `continueOnFail`. On error, output is `{ "error": "message" }`.

## Workflow Examples

**Competitive intelligence:**

```
Schedule Trigger (weekly)
  -> Firecrawl: Map (competitor URL)
  -> Firecrawl: Batch Scrape (URLs from Map)
  -> Code Node (diff with last week)
  -> Google Sheets + Slack notification
```

**AI data extraction:**

```
Manual Trigger
  -> Firecrawl: Extract (directory URL, prompt, schema)
  -> Google Sheets: Append rows
```

**Content monitoring:**

```
Schedule Trigger (daily)
  -> Firecrawl: Scrape (formats: changeTracking)
  -> IF (changes detected) -> Email alert
```

## Compatibility

- n8n: **>= 1.83**. The node imports `NodeConnectionTypes` from `n8n-workflow`, which first
  shipped in `n8n-workflow@1.83.0`. On older n8n the package fails to load. Stay on `1.0.17`
  if you cannot upgrade n8n.
- Firecrawl API: v2
- Tested with self-hosted Firecrawl and Firecrawl Cloud

## About

[hecigo](https://hecigo.com) is a middleware and integration lab. We build and run the layer that makes disconnected business systems talk to each other — with the right data, and nothing lost. Need custom n8n nodes, self-hosted Firecrawl deployment, or scraping workflow design? [Get in touch](https://hecigo.com/#contact).

**Other n8n nodes by hecigo:** [n8n-nodes-zalo-platform](https://github.com/hecigo/n8n-nodes-zalo-platform) — Zalo Bot Platform on n8n: webhook trigger, replies, photos, stickers and chat actions. n8n-verified, runs on n8n Cloud.

Consulting partner: [THE NEXOVA](https://thenexova.com) — Bridge Strategy to Execution.

## License

[MIT](LICENSE)
