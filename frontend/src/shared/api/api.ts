class Api {
	_headers: HeadersInit | undefined;
	_url: string;
	constructor(options: { baseUrl: string; headers: HeadersInit | undefined }) {
		this._headers = options.headers;
		this._url = options.baseUrl;
	}

	postLink(
		originalUrl: string,
		customAlias?: string,
		durationMinutes?: number,
	) {
		return this._request(`${this._url}/shorten`, {
			method: 'POST',
			headers: this._headers,
			body: JSON.stringify({
				originalUrl,
				customAlias,
				durationMinutes,
			}),
		});
	}

	_checkResponse(res: Response) {
		console.log(res);
		if (res.ok) {
			return res.json();
		}
		return Promise.reject(`Ошибка: ${res.status}`);
	}

	_request(url: RequestInfo | URL, options: RequestInit | undefined) {
		return fetch(url, options).then((res) => this._checkResponse(res));
	}
}

const api = new Api({
	baseUrl: 'http://localhost:3000/short-url',
	headers: {
		'Content-Type': 'application/json',
	},
});

export default api;
