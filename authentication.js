const WebCookies = require('./WebCookies');

const getNonce = async (z, bundle) => {
	const now = new Date();
	//clear out the old variables! - If this is not done the request processor gets in the way
	if (bundle.authData.sessionKey) delete bundle.authData.sessionKey;
	if (bundle.authData.cookies) delete bundle.authData.cookies;
	if (bundle.authData.api_root) delete bundle.authData.api_root;
	if (bundle.authData.version_sring) delete bundle.authData.version_sring;
	if (bundle.authData.expiration) delete bundle.authData.expiration;

	cookies = new WebCookies(); // this will save my cookies and get them when I need them

	const request0 = await z.request(`${bundle.authData.baseURL}/${bundle.authData.loginURL}`);
	if (request0.headers.get('set-cookie')) cookies.add(request0.headers.get('set-cookie'));


	// Step 1: sign in and get the cookies
	const request1 = await z.request({
		method: 'POST',
		url: bundle.authData.baseURL + '/' + bundle.authData.loginURL,
		form: {
			log: bundle.authData.username,
			pwd: bundle.authData.password,
			'wp-submit': 'Log In',
			'redirect_to': bundle.authData.baseURL + '/wp-admin',
			'testcookie': 1,
		},
	});

	if (request1.status != 200) throw 'Your Credentials did not match. Please try again.';
	if (request1.headers.get('set-cookie')) cookies.add(request1.headers.get('set-cookie'));

	// Step 2: Get the nonce for the API
	const request2 = await z.request({
		method: 'GET',
		headers: {
			'Cookie': cookies.getCookieString(),
		},
		url: bundle.authData.baseURL + '/wp-admin/',
	});

	if (request2.status != 200 && request2.status != 301) throw request2.status;
	if (request2.headers.get('set-cookie')) cookies.add(request2.headers.get('set-cookie'));

	const regex = /var wpApiSettings = ?([^;]+)/;
	var nonce = request2.content.match(regex);
	nonce = z.JSON.parse(nonce[1]);

	//this part only exists for testing, I do not feel like writing a function in test to handle this
	bundle.authData.sessionKey = nonce.nonce;
	bundle.authData.cookies = cookies.getCookieString();
	bundle.authData.api_root = nonce.root + nonce.versionString;
	bundle.authData.version_sring = nonce.versionString;
	bundle.authData.expiration = cookies.getExpiration();

	return {
		sessionKey: nonce.nonce,
		cookies: cookies.getCookieString(),
		api_root: nonce.root + nonce.versionString,
		version_sring: nonce.versionString,
		expiration: cookies.getExpiration(),
	};

};

// this is the test method to verify valid credentials
const test = async (z, bundle) => {
	// await getNonce(z, bundle);
	if (!bundle.authData.sessionKey) throw 'Session Key missing';
	if (!bundle.authData.api_root) throw 'Missing API Root';
	if (!bundle.authData.version_sring) throw 'Missing API Version';
	if (!bundle.authData.cookies) throw 'error You need more cookies!';
	const promise = await z.request(`${bundle.authData.api_root}types`,
		{
			params: {
				context: 'edit',
			},
			headers: {
				'X-WP-Nonce': bundle.authData.sessionKey,
			},
		});

	if (promise.status != 200) {
		throw `A depressing error occured 
		Cookies: ${promise.request.headers['Cookie']}
		X-WP-Nonce: ${promise.request.headers['X-WP-Nonce']}`;
	}

	return promise;
}


module.exports = {
	type: 'session',
	connectionLabel: '{{bundle.authData.username}} at {{bundle.authData.baseURL}}',
	test,

	fields: [
		{ key: 'baseURL', label: 'Base URL', helpText: 'use just the URL EX: [https://wordpress.org](https://wordpress.org)', required: true, type: 'string' },
		{ key: 'loginURL', label: 'login URL', helpText: 'EX: [wp-login.php](https://wordpress.org)', required: true, type: 'string' },
		{ key: 'username', label: 'Username', required: true, type: 'string' },
		{ key: 'password', label: 'Password', required: true, type: 'password' },

		{ key: 'cookies', label: 'Cookies', required: false, type: 'string', computed: true },
		{ key: 'api_root', label: 'Api Root', required: false, type: 'string', computed: true },
		{ key: 'version_sring', label: 'Version String', required: false, type: 'string', computed: true },
		{ key: 'expiration', label: 'when the session expires', required: false, type: 'datetime', computed: true },
	],
	sessionConfig: {
		perform: getNonce,
	},
};