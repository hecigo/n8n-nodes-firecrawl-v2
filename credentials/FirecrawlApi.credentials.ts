import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FirecrawlApi implements ICredentialType {
	name = 'firecrawlApi';
	displayName = 'Firecrawl API';
	documentationUrl = 'https://docs.firecrawl.dev';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.firecrawl.dev/v2',
			placeholder: 'https://api.firecrawl.dev/v2',
			description: 'Base URL including API version. For self-hosted instances, use your server URL (e.g. http://localhost:3002/v2)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Firecrawl API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/scrape',
			method: 'POST',
			body: {
				url: 'https://example.com',
				formats: ['markdown'],
			},
		},
	};
}
