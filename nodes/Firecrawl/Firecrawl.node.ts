import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';

const HELP_NOTICE = 'Need help? Visit https://thenexova.com/n8n-firecrawl-node-web-scraping-crawling-and-ai-extraction-guide/ or contact THE NEXOVA team at contact@thenexova.com';

export class Firecrawl implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Firecrawl',
		name: 'firecrawl',
		icon: 'file:fc-flame.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Scrape, crawl, map, search, and extract with Firecrawl v2. Supports Cloud and self-hosted.',
		defaults: {
			name: 'Firecrawl',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'firecrawlApi',
				required: true,
			},
		],
		properties: [
			// ------ Operation ------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Scrape',
						value: 'scrape',
						description: 'Scrape content from a single URL',
						action: 'Scrape a URL',
					},
					{
						name: 'Crawl',
						value: 'crawl',
						description: 'Start an async crawl job for an entire website',
						action: 'Crawl a website',
					},
					{
						name: 'Get Crawl Status',
						value: 'getCrawlStatus',
						description: 'Check the status of a crawl job',
						action: 'Get crawl status',
					},
					{
						name: 'Cancel Crawl',
						value: 'cancelCrawl',
						description: 'Cancel a running crawl job',
						action: 'Cancel a crawl',
					},
					{
						name: 'Map',
						value: 'map',
						description: 'Discover all URLs on a website without scraping',
						action: 'Map a website',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Web search with optional page scraping',
						action: 'Search the web',
					},
					{
						name: 'Extract',
						value: 'extract',
						description: 'AI-powered structured data extraction from URLs',
						action: 'Extract structured data',
					},
					{
						name: 'Get Extract Status',
						value: 'getExtractStatus',
						description: 'Check the status of an extract job',
						action: 'Get extract status',
					},
					{
						name: 'Batch Scrape',
						value: 'batchScrape',
						description: 'Scrape multiple URLs asynchronously',
						action: 'Batch scrape URLs',
					},
					{
						name: 'Get Batch Scrape Status',
						value: 'getBatchScrapeStatus',
						description: 'Check the status of a batch scrape job',
						action: 'Get batch scrape status',
					},
				],
				default: 'scrape',
			},

			// ====== SCRAPE fields ======
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com',
				description: 'The URL to scrape',
				displayOptions: { show: { operation: ['scrape'] } },
			},
			{
				displayName: 'Options',
				name: 'scrapeOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { operation: ['scrape'] } },
				options: [
					{
						displayName: 'Formats',
						name: 'formats',
						type: 'multiOptions',
						options: [
							{ name: 'Markdown', value: 'markdown' },
							{ name: 'HTML', value: 'html' },
							{ name: 'Raw HTML', value: 'rawHtml' },
							{ name: 'Links', value: 'links' },
							{ name: 'Screenshot', value: 'screenshot' },
							{ name: 'JSON', value: 'json' },
							{ name: 'Summary', value: 'summary' },
							{ name: 'Images', value: 'images' },
							{ name: 'Audio', value: 'audio' },
							{ name: 'Change Tracking', value: 'changeTracking' },
						],
						default: ['markdown'],
						description: 'Output formats for the scraped content',
					},
					{
						displayName: 'Only Main Content',
						name: 'onlyMainContent',
						type: 'boolean',
						default: true,
						description: 'Whether to extract only the main content (strip headers, navs, footers)',
					},
					{
						displayName: 'Include Tags',
						name: 'includeTags',
						type: 'string',
						default: '',
						placeholder: 'article, main, .content',
						description: 'Comma-separated HTML tags/selectors to include',
					},
					{
						displayName: 'Exclude Tags',
						name: 'excludeTags',
						type: 'string',
						default: '',
						placeholder: 'nav, footer, .sidebar',
						description: 'Comma-separated HTML tags/selectors to exclude',
					},
					{
						displayName: 'Wait For (ms)',
						name: 'waitFor',
						type: 'number',
						default: 0,
						description: 'Milliseconds to wait before scraping (for JS-rendered pages)',
					},
					{
						displayName: 'Timeout (ms)',
						name: 'timeout',
						type: 'number',
						default: 30000,
						description: 'Request timeout in milliseconds (1000-300000)',
					},
					{
						displayName: 'Mobile',
						name: 'mobile',
						type: 'boolean',
						default: false,
						description: 'Whether to emulate a mobile device',
					},
					{
						displayName: 'Remove Base64 Images',
						name: 'removeBase64Images',
						type: 'boolean',
						default: true,
						description: 'Whether to remove base64 encoded images from output',
					},
					{
						displayName: 'Block Ads',
						name: 'blockAds',
						type: 'boolean',
						default: true,
						description: 'Whether to block ads and cookie popups',
					},
					{
						displayName: 'Skip TLS Verification',
						name: 'skipTlsVerification',
						type: 'boolean',
						default: true,
						description: 'Whether to skip TLS certificate verification',
					},
					{
						displayName: 'Proxy',
						name: 'proxy',
						type: 'options',
						options: [
							{ name: 'Auto', value: 'auto' },
							{ name: 'Basic', value: 'basic' },
							{ name: 'Enhanced', value: 'enhanced' },
						],
						default: 'auto',
						description: 'Proxy type to use for scraping',
					},
					{
						displayName: 'Location Country',
						name: 'locationCountry',
						type: 'string',
						default: '',
						placeholder: 'US',
						description: 'ISO 3166-1 alpha-2 country code for proxy location',
					},
					{
						displayName: 'Location Languages',
						name: 'locationLanguages',
						type: 'string',
						default: '',
						placeholder: 'en-US, vi-VN',
						description: 'Comma-separated preferred languages/locales',
					},
				],
			},

			// ====== CRAWL fields ======
			{
				displayName: 'URL',
				name: 'crawlUrl',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com',
				description: 'The base URL to start crawling from',
				displayOptions: { show: { operation: ['crawl'] } },
			},
			{
				displayName: 'Wait for Completion',
				name: 'waitForCompletion',
				type: 'boolean',
				default: false,
				description: 'Whether to poll and wait until the crawl job finishes (may take a long time)',
				displayOptions: { show: { operation: ['crawl'] } },
			},
			{
				displayName: 'Max Poll Time (s)',
				name: 'maxPollTime',
				type: 'number',
				default: 300,
				description: 'Maximum seconds to wait when polling for completion',
				displayOptions: { show: { operation: ['crawl'], waitForCompletion: [true] } },
			},
			{
				displayName: 'Options',
				name: 'crawlOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { operation: ['crawl'] } },
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'Maximum number of pages to crawl (API default: 10000)',
					},
					{
						displayName: 'Max Discovery Depth',
						name: 'maxDiscoveryDepth',
						type: 'number',
						default: 2,
						description: 'Maximum crawl depth based on discovery order',
					},
					{
						displayName: 'Include Paths',
						name: 'includePaths',
						type: 'string',
						default: '',
						placeholder: '/blog/*, /docs/*',
						description: 'Comma-separated URL path regex patterns to include',
					},
					{
						displayName: 'Exclude Paths',
						name: 'excludePaths',
						type: 'string',
						default: '',
						placeholder: '/admin/*, /login',
						description: 'Comma-separated URL path regex patterns to exclude',
					},
					{
						displayName: 'Sitemap',
						name: 'sitemap',
						type: 'options',
						options: [
							{ name: 'Include', value: 'include' },
							{ name: 'Skip', value: 'skip' },
							{ name: 'Only', value: 'only' },
						],
						default: 'include',
						description: 'How to handle sitemap.xml',
					},
					{
						displayName: 'Crawl Entire Domain',
						name: 'crawlEntireDomain',
						type: 'boolean',
						default: false,
						description: 'Whether to follow sibling/parent links across the entire domain',
					},
					{
						displayName: 'Allow External Links',
						name: 'allowExternalLinks',
						type: 'boolean',
						default: false,
						description: 'Whether to follow external links',
					},
					{
						displayName: 'Allow Subdomains',
						name: 'allowSubdomains',
						type: 'boolean',
						default: false,
						description: 'Whether to crawl subdomains',
					},
					{
						displayName: 'Ignore Query Parameters',
						name: 'ignoreQueryParameters',
						type: 'boolean',
						default: false,
						description: 'Whether to ignore query parameters when deduplicating URLs',
					},
					{
						displayName: 'Delay (seconds)',
						name: 'delay',
						type: 'number',
						default: 0,
						description: 'Seconds to wait between scrapes (forces concurrency=1)',
					},
					{
						displayName: 'Max Concurrency',
						name: 'maxConcurrency',
						type: 'number',
						default: 0,
						description: 'Maximum concurrent scrapes (0 = no limit)',
					},
					{
						displayName: 'Scrape Formats',
						name: 'formats',
						type: 'multiOptions',
						options: [
							{ name: 'Markdown', value: 'markdown' },
							{ name: 'HTML', value: 'html' },
							{ name: 'Raw HTML', value: 'rawHtml' },
							{ name: 'Links', value: 'links' },
							{ name: 'Screenshot', value: 'screenshot' },
						],
						default: ['markdown'],
						description: 'Output formats for scraped pages',
					},
					{
						displayName: 'Only Main Content',
						name: 'onlyMainContent',
						type: 'boolean',
						default: true,
						description: 'Whether to strip headers, navs, and footers from scraped pages',
					},
				],
			},

			// ====== GET CRAWL STATUS fields ======
			{
				displayName: 'Crawl ID',
				name: 'crawlId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the crawl job to check',
				displayOptions: { show: { operation: ['getCrawlStatus'] } },
			},

			// ====== CANCEL CRAWL fields ======
			{
				displayName: 'Crawl ID',
				name: 'cancelCrawlId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the crawl job to cancel',
				displayOptions: { show: { operation: ['cancelCrawl'] } },
			},

			// ====== MAP fields ======
			{
				displayName: 'URL',
				name: 'mapUrl',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com',
				description: 'The base URL to map',
				displayOptions: { show: { operation: ['map'] } },
			},
			{
				displayName: 'Options',
				name: 'mapOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { operation: ['map'] } },
				options: [
					{
						displayName: 'Search',
						name: 'search',
						type: 'string',
						default: '',
						description: 'Search query to order results by relevance',
					},
					{
						displayName: 'Sitemap',
						name: 'sitemap',
						type: 'options',
						options: [
							{ name: 'Include', value: 'include' },
							{ name: 'Skip', value: 'skip' },
							{ name: 'Only', value: 'only' },
						],
						default: 'include',
						description: 'How to handle sitemap.xml',
					},
					{
						displayName: 'Include Subdomains',
						name: 'includeSubdomains',
						type: 'boolean',
						default: true,
						description: 'Whether to include subdomains in the map',
					},
					{
						displayName: 'Ignore Query Parameters',
						name: 'ignoreQueryParameters',
						type: 'boolean',
						default: true,
						description: 'Whether to exclude URLs with query parameters',
					},
					{
						displayName: 'Ignore Cache',
						name: 'ignoreCache',
						type: 'boolean',
						default: false,
						description: 'Whether to bypass the sitemap cache for fresh URLs',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 5000,
						description: 'Maximum number of links to return (max 100000)',
					},
					{
						displayName: 'Timeout (ms)',
						name: 'timeout',
						type: 'number',
						default: 0,
						description: 'Timeout in milliseconds (0 = no limit)',
					},
				],
			},

			// ====== SEARCH fields ======
			{
				displayName: 'Query',
				name: 'searchQuery',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'latest news about AI',
				description: 'The search query (max 500 characters)',
				displayOptions: { show: { operation: ['search'] } },
			},
			{
				displayName: 'Options',
				name: 'searchOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { operation: ['search'] } },
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 5,
						description: 'Number of results (1-100)',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: 'US',
						placeholder: 'US',
						description: 'ISO country code for geo-targeting',
					},
					{
						displayName: 'Location',
						name: 'location',
						type: 'string',
						default: '',
						placeholder: 'California, United States',
						description: 'Geo-targeted location string',
					},
					{
						displayName: 'Time Filter',
						name: 'tbs',
						type: 'options',
						options: [
							{ name: 'Any Time', value: '' },
							{ name: 'Past Hour', value: 'qdr:h' },
							{ name: 'Past Day', value: 'qdr:d' },
							{ name: 'Past Week', value: 'qdr:w' },
							{ name: 'Past Month', value: 'qdr:m' },
							{ name: 'Past Year', value: 'qdr:y' },
						],
						default: '',
						description: 'Filter results by time range',
					},
					{
						displayName: 'Timeout (ms)',
						name: 'timeout',
						type: 'number',
						default: 60000,
						description: 'Timeout in milliseconds',
					},
					{
						displayName: 'Scrape Formats',
						name: 'formats',
						type: 'multiOptions',
						options: [
							{ name: 'Markdown', value: 'markdown' },
							{ name: 'HTML', value: 'html' },
							{ name: 'Raw HTML', value: 'rawHtml' },
							{ name: 'Links', value: 'links' },
							{ name: 'Screenshot', value: 'screenshot' },
						],
						default: ['markdown'],
						description: 'Output formats for scraped result pages',
					},
					{
						displayName: 'Only Main Content',
						name: 'onlyMainContent',
						type: 'boolean',
						default: true,
						description: 'Whether to strip headers, navs, and footers from scraped pages',
					},
				],
			},

			// ====== EXTRACT fields ======
			{
				displayName: 'URLs',
				name: 'extractUrls',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com/*, https://other.com/page',
				description: 'Comma-separated URLs (supports glob patterns like https://example.com/*)',
				displayOptions: { show: { operation: ['extract'] } },
			},
			{
				displayName: 'Prompt',
				name: 'extractPrompt',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				placeholder: 'Extract all product names, prices, and descriptions',
				description: 'Natural language instruction for what to extract',
				displayOptions: { show: { operation: ['extract'] } },
			},
			{
				displayName: 'Schema (JSON)',
				name: 'extractSchema',
				type: 'json',
				default: '',
				placeholder: '{\n  "type": "object",\n  "properties": {\n    "services": { "type": "array", "items": { "type": "string" } },\n    "pricing": { "type": "array", "items": { "type": "object", "properties": { "plan": { "type": "string" }, "price": { "type": "string" } } } }\n  }\n}',
				description: 'Optional JSON Schema defining output structure. Leave empty to let AI decide. Must use JSON Schema syntax (type, properties), NOT example data.',
				displayOptions: { show: { operation: ['extract'] } },
			},
			{
				displayName: 'Wait for Completion',
				name: 'extractWaitForCompletion',
				type: 'boolean',
				default: true,
				description: 'Whether to poll and wait until extraction finishes',
				displayOptions: { show: { operation: ['extract'] } },
			},
			{
				displayName: 'Max Poll Time (s)',
				name: 'extractMaxPollTime',
				type: 'number',
				default: 300,
				description: 'Maximum seconds to wait when polling for completion',
				displayOptions: { show: { operation: ['extract'], extractWaitForCompletion: [true] } },
			},
			{
				displayName: 'Options',
				name: 'extractOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { operation: ['extract'] } },
				options: [
					{
						displayName: 'Enable Web Search',
						name: 'enableWebSearch',
						type: 'boolean',
						default: false,
						description: 'Whether to use web search for additional data',
					},
					{
						displayName: 'Ignore Sitemap',
						name: 'ignoreSitemap',
						type: 'boolean',
						default: false,
						description: 'Whether to skip sitemap.xml files',
					},
					{
						displayName: 'Include Subdomains',
						name: 'includeSubdomains',
						type: 'boolean',
						default: true,
						description: 'Whether to scan subdomains',
					},
					{
						displayName: 'Show Sources',
						name: 'showSources',
						type: 'boolean',
						default: false,
						description: 'Whether to include source URLs in response',
					},
				],
			},

			// ====== GET EXTRACT STATUS fields ======
			{
				displayName: 'Extract ID',
				name: 'extractId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the extract job to check',
				displayOptions: { show: { operation: ['getExtractStatus'] } },
			},

			// ====== BATCH SCRAPE fields ======
			{
				displayName: 'URLs',
				name: 'batchUrls',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'https://example.com/page1, https://example.com/page2',
				description: 'Comma-separated list of URLs to scrape',
				displayOptions: { show: { operation: ['batchScrape'] } },
			},
			{
				displayName: 'Wait for Completion',
				name: 'batchWaitForCompletion',
				type: 'boolean',
				default: false,
				description: 'Whether to poll and wait until batch scrape finishes',
				displayOptions: { show: { operation: ['batchScrape'] } },
			},
			{
				displayName: 'Max Poll Time (s)',
				name: 'batchMaxPollTime',
				type: 'number',
				default: 300,
				description: 'Maximum seconds to wait when polling for completion',
				displayOptions: { show: { operation: ['batchScrape'], batchWaitForCompletion: [true] } },
			},
			{
				displayName: 'Options',
				name: 'batchOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: { show: { operation: ['batchScrape'] } },
				options: [
					{
						displayName: 'Formats',
						name: 'formats',
						type: 'multiOptions',
						options: [
							{ name: 'Markdown', value: 'markdown' },
							{ name: 'HTML', value: 'html' },
							{ name: 'Raw HTML', value: 'rawHtml' },
							{ name: 'Links', value: 'links' },
							{ name: 'Screenshot', value: 'screenshot' },
						],
						default: ['markdown'],
						description: 'Output formats for scraped content',
					},
					{
						displayName: 'Only Main Content',
						name: 'onlyMainContent',
						type: 'boolean',
						default: true,
						description: 'Whether to strip headers, navs, and footers',
					},
					{
						displayName: 'Max Concurrency',
						name: 'maxConcurrency',
						type: 'number',
						default: 0,
						description: 'Maximum concurrent scrapes (0 = no limit)',
					},
				],
			},

			// ====== GET BATCH SCRAPE STATUS fields ======
			{
				displayName: 'Batch Scrape ID',
				name: 'batchScrapeId',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the batch scrape job to check',
				displayOptions: { show: { operation: ['getBatchScrapeStatus'] } },
			},

		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('firecrawlApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				switch (operation) {
					case 'scrape':
						responseData = await executeScrape.call(this, i, baseUrl);
						break;
					case 'crawl':
						responseData = await executeCrawl.call(this, i, baseUrl);
						break;
					case 'getCrawlStatus':
						responseData = await executeGetCrawlStatus.call(this, i, baseUrl);
						break;
					case 'cancelCrawl':
						responseData = await executeCancelCrawl.call(this, i, baseUrl);
						break;
					case 'map':
						responseData = await executeMap.call(this, i, baseUrl);
						break;
					case 'search':
						responseData = await executeSearch.call(this, i, baseUrl);
						break;
					case 'extract':
						responseData = await executeExtract.call(this, i, baseUrl);
						break;
					case 'getExtractStatus':
						responseData = await executeGetExtractStatus.call(this, i, baseUrl);
						break;
					case 'batchScrape':
						responseData = await executeBatchScrape.call(this, i, baseUrl);
						break;
					case 'getBatchScrapeStatus':
						responseData = await executeGetBatchScrapeStatus.call(this, i, baseUrl);
						break;
						default:
						throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, { description: HELP_NOTICE });
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData.map((d: any) => ({ json: d })));
				} else {
					returnData.push({ json: responseData });
				}
			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

// ====== Helper: make API request ======
async function apiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	baseUrl: string,
	endpoint: string,
	body?: object,
): Promise<any> {
	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		body,
		json: true,
	};

	return this.helpers.httpRequestWithAuthentication.call(this, 'firecrawlApi', options);
}

// ====== Helper: poll async job ======
async function pollJob(
	this: IExecuteFunctions,
	baseUrl: string,
	endpoint: string,
	maxPollTimeSeconds: number,
): Promise<any> {
	const startTime = Date.now();
	const maxTime = maxPollTimeSeconds * 1000;

	while (Date.now() - startTime < maxTime) {
		const status = await apiRequest.call(this, 'GET', baseUrl, endpoint);

		if (status.status === 'completed') {
			return status;
		}
		if (status.status === 'failed' || status.status === 'cancelled') {
			throw new NodeOperationError(this.getNode(), `Job ${status.status}: ${JSON.stringify(status)}`, { description: HELP_NOTICE });
		}

		// Wait 2 seconds between polls
		await new Promise<void>((resolve) => AbortSignal.timeout(2000).addEventListener('abort', () => resolve()));
	}

	throw new NodeOperationError(this.getNode(), `Job timed out after ${maxPollTimeSeconds}s`, { description: HELP_NOTICE });
}

// ====== Helper: parse comma-separated strings ======
function parseCommaSeparated(value: string): string[] {
	return value
		.split(',')
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
}

// ====== Helper: build scrape options from collection ======
function buildScrapeOptions(opts: any): any {
	const scrapeOpts: any = {};

	if (opts.formats) scrapeOpts.formats = opts.formats;
	if (opts.onlyMainContent !== undefined) scrapeOpts.onlyMainContent = opts.onlyMainContent;
	if (opts.includeTags) scrapeOpts.includeTags = parseCommaSeparated(opts.includeTags);
	if (opts.excludeTags) scrapeOpts.excludeTags = parseCommaSeparated(opts.excludeTags);
	if (opts.waitFor) scrapeOpts.waitFor = opts.waitFor;
	if (opts.timeout) scrapeOpts.timeout = opts.timeout;
	if (opts.mobile !== undefined) scrapeOpts.mobile = opts.mobile;
	if (opts.removeBase64Images !== undefined) scrapeOpts.removeBase64Images = opts.removeBase64Images;
	if (opts.blockAds !== undefined) scrapeOpts.blockAds = opts.blockAds;
	if (opts.skipTlsVerification !== undefined) scrapeOpts.skipTlsVerification = opts.skipTlsVerification;
	if (opts.proxy) scrapeOpts.proxy = opts.proxy;

	if (opts.locationCountry || opts.locationLanguages) {
		scrapeOpts.location = {};
		if (opts.locationCountry) scrapeOpts.location.country = opts.locationCountry;
		if (opts.locationLanguages) scrapeOpts.location.languages = parseCommaSeparated(opts.locationLanguages);
	}

	return scrapeOpts;
}

// ====== Operation: Scrape ======
async function executeScrape(this: IExecuteFunctions, i: number, baseUrl: string): Promise<any> {
	const url = this.getNodeParameter('url', i) as string;
	const options = this.getNodeParameter('scrapeOptions', i, {}) as any;

	const body: any = { url, ...buildScrapeOptions(options) };

	const response = await apiRequest.call(this, 'POST', baseUrl, '/scrape', body);
	return response.data || response;
}

// ====== Operation: Crawl ======
async function executeCrawl(this: IExecuteFunctions, i: number, baseUrl: string): Promise<any> {
	const url = this.getNodeParameter('crawlUrl', i) as string;
	const waitForCompletion = this.getNodeParameter('waitForCompletion', i, false) as boolean;
	const options = this.getNodeParameter('crawlOptions', i, {}) as any;

	const body: any = { url };

	if (options.limit) body.limit = options.limit;
	if (options.maxDiscoveryDepth) body.maxDiscoveryDepth = options.maxDiscoveryDepth;
	if (options.includePaths) body.includePaths = parseCommaSeparated(options.includePaths);
	if (options.excludePaths) body.excludePaths = parseCommaSeparated(options.excludePaths);
	if (options.sitemap) body.sitemap = options.sitemap;
	if (options.crawlEntireDomain !== undefined) body.crawlEntireDomain = options.crawlEntireDomain;
	if (options.allowExternalLinks !== undefined) body.allowExternalLinks = options.allowExternalLinks;
	if (options.allowSubdomains !== undefined) body.allowSubdomains = options.allowSubdomains;
	if (options.ignoreQueryParameters !== undefined) body.ignoreQueryParameters = options.ignoreQueryParameters;
	if (options.delay) body.delay = options.delay;
	if (options.maxConcurrency) body.maxConcurrency = options.maxConcurrency;

	if (options.formats || options.onlyMainContent !== undefined) {
		body.scrapeOptions = {};
		if (options.formats) body.scrapeOptions.formats = options.formats;
		if (options.onlyMainContent !== undefined) body.scrapeOptions.onlyMainContent = options.onlyMainContent;
	}

	const response = await apiRequest.call(this, 'POST', baseUrl, '/crawl', body);

	if (waitForCompletion && response.id) {
		const maxPollTime = this.getNodeParameter('maxPollTime', i, 300) as number;
		return pollJob.call(this, baseUrl, `/crawl/${response.id}`, maxPollTime);
	}

	return response;
}

// ====== Operation: Get Crawl Status ======
async function executeGetCrawlStatus(this: IExecuteFunctions, i: number, baseUrl: string): Promise<any> {
	const crawlId = this.getNodeParameter('crawlId', i) as string;
	return apiRequest.call(this, 'GET', baseUrl, `/crawl/${crawlId}`);
}

// ====== Operation: Cancel Crawl ======
async function executeCancelCrawl(this: IExecuteFunctions, i: number, baseUrl: string): Promise<any> {
	const crawlId = this.getNodeParameter('cancelCrawlId', i) as string;
	return apiRequest.call(this, 'DELETE', baseUrl, `/crawl/${crawlId}`);
}

// ====== Operation: Map ======
async function executeMap(this: IExecuteFunctions, i: number, baseUrl: string): Promise<any> {
	const url = this.getNodeParameter('mapUrl', i) as string;
	const options = this.getNodeParameter('mapOptions', i, {}) as any;

	const body: any = { url };

	if (options.search) body.search = options.search;
	if (options.sitemap) body.sitemap = options.sitemap;
	if (options.includeSubdomains !== undefined) body.includeSubdomains = options.includeSubdomains;
	if (options.ignoreQueryParameters !== undefined) body.ignoreQueryParameters = options.ignoreQueryParameters;
	if (options.ignoreCache !== undefined) body.ignoreCache = options.ignoreCache;
	if (options.limit) body.limit = options.limit;
	if (options.timeout) body.timeout = options.timeout;

	return apiRequest.call(this, 'POST', baseUrl, '/map', body);
}

// ====== Operation: Search ======
async function executeSearch(this: IExecuteFunctions, i: number, baseUrl: string): Promise<any> {
	const query = this.getNodeParameter('searchQuery', i) as string;
	const options = this.getNodeParameter('searchOptions', i, {}) as any;

	const body: any = { query };

	if (options.limit) body.limit = options.limit;
	if (options.country) body.country = options.country;
	if (options.location) body.location = options.location;
	if (options.tbs) body.tbs = options.tbs;
	if (options.timeout) body.timeout = options.timeout;

	if (options.formats || options.onlyMainContent !== undefined) {
		body.scrapeOptions = {};
		if (options.formats) body.scrapeOptions.formats = options.formats;
		if (options.onlyMainContent !== undefined) body.scrapeOptions.onlyMainContent = options.onlyMainContent;
	}

	const response = await apiRequest.call(this, 'POST', baseUrl, '/search', body);
	return response.data || response;
}

// ====== Operation: Extract ======
async function executeExtract(this: IExecuteFunctions, i: number, baseUrl: string): Promise<any> {
	const urls = parseCommaSeparated(this.getNodeParameter('extractUrls', i) as string);
	const prompt = this.getNodeParameter('extractPrompt', i, '') as string;
	const schemaRaw = this.getNodeParameter('extractSchema', i, '') as string | object;
	const waitForCompletion = this.getNodeParameter('extractWaitForCompletion', i, true) as boolean;
	const options = this.getNodeParameter('extractOptions', i, {}) as any;

	const body: any = { urls };

	if (prompt) body.prompt = prompt;
	if (schemaRaw && typeof schemaRaw === 'string' && schemaRaw.trim().length > 0) {
		const parsed = JSON.parse(schemaRaw);
		if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
			body.schema = parsed;
		}
	} else if (schemaRaw && typeof schemaRaw === 'object' && Object.keys(schemaRaw).length > 0) {
		body.schema = schemaRaw;
	}
	if (options.enableWebSearch !== undefined) body.enableWebSearch = options.enableWebSearch;
	if (options.ignoreSitemap !== undefined) body.ignoreSitemap = options.ignoreSitemap;
	if (options.includeSubdomains !== undefined) body.includeSubdomains = options.includeSubdomains;
	if (options.showSources !== undefined) body.showSources = options.showSources;

	const response = await apiRequest.call(this, 'POST', baseUrl, '/extract', body);

	if (waitForCompletion && response.id) {
		const maxPollTime = this.getNodeParameter('extractMaxPollTime', i, 300) as number;
		return pollJob.call(this, baseUrl, `/extract/${response.id}`, maxPollTime);
	}

	return response;
}

// ====== Operation: Get Extract Status ======
async function executeGetExtractStatus(this: IExecuteFunctions, i: number, baseUrl: string): Promise<any> {
	const extractId = this.getNodeParameter('extractId', i) as string;
	return apiRequest.call(this, 'GET', baseUrl, `/extract/${extractId}`);
}

// ====== Operation: Batch Scrape ======
async function executeBatchScrape(this: IExecuteFunctions, i: number, baseUrl: string): Promise<any> {
	const urls = parseCommaSeparated(this.getNodeParameter('batchUrls', i) as string);
	const waitForCompletion = this.getNodeParameter('batchWaitForCompletion', i, false) as boolean;
	const options = this.getNodeParameter('batchOptions', i, {}) as any;

	const body: any = { urls };

	if (options.formats) body.formats = options.formats;
	if (options.onlyMainContent !== undefined) body.onlyMainContent = options.onlyMainContent;
	if (options.maxConcurrency) body.maxConcurrency = options.maxConcurrency;

	const response = await apiRequest.call(this, 'POST', baseUrl, '/batch/scrape', body);

	if (waitForCompletion && response.id) {
		const maxPollTime = this.getNodeParameter('batchMaxPollTime', i, 300) as number;
		return pollJob.call(this, baseUrl, `/batch/scrape/${response.id}`, maxPollTime);
	}

	return response;
}

// ====== Operation: Get Batch Scrape Status ======
async function executeGetBatchScrapeStatus(this: IExecuteFunctions, i: number, baseUrl: string): Promise<any> {
	const batchScrapeId = this.getNodeParameter('batchScrapeId', i) as string;
	return apiRequest.call(this, 'GET', baseUrl, `/batch/scrape/${batchScrapeId}`);
}

