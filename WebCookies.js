class WebCookies {
	cookies = [];

	add(cookie_name, cookie_content){
		this.cookies.push({ name: cookie_name, value: cookie_content});
		// this.cookies[cookie_name] = cookie_content;
	}

	// this adds or updates cookies
	add(cookies){
		if (cookies){
			cookies = cookies.split(/(?<!expires=(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)),[ \n]/); //seporate the cookies, ignoring the ',' in the date!
			cookies.forEach(element => {
				var cookieRaw = element.split(/;[ \n]/); // part 1: split the hedder into its components
				var tempCookie = {};

				cookieRaw.forEach((part, index) => {
					part = part.split('=');
					
					if (index == 0) { // handle the name and value of the cookie
						tempCookie.name = part[0];
						tempCookie.value = part[1];
					}
					else if (part[0] && !part[1]) tempCookie[part[0]] = true; // handle the true false statements
					else if (part[0] == 'expires') tempCookie.expires = Date.parse(part[1]);
					else tempCookie[part[0]] = part[1]; //handle the other parts of the cookie
				});

				// Update or add new cookie
				if (this.cookies.some(cookie => cookie.name === tempCookie.name)){
					this.cookies.forEach(cookie => {
						if (cookie.name === tempCookie.name) cookie = tempCookie;
					});
				}
				else this.cookies.push(tempCookie);

				// OLD method
				// cookie = cookie[0].split('='); // part 2: get the cookie name and value
				// if(cookie[1])this.cookies[cookie[0]] = cookie[1];
			});
		}

	}

	// return the object of a specific cookie
	getCookie(cookie_name){
		return this.cookies.find(cookie => cookie.name === cookie_name);
		// return this.cookies[cookie_name];
	}

	// return the cookie array for testing
	getCookies(){
		return this.cookies;
	}

	// is any cookie expired
	// BAD! do not use, a WP cookie seems to expire before the current time!
	isExpired(){
		var now = new Date
		var expiredCookies = this.cookies.filter(cookie => cookie.expires <= now.getTime());
		
		if (expiredCookies) return true;
		else return false;
	}

	// gets the latest expireing cookie date
	getExpiration(){
		var expireingCookies = this.cookies.filter(cookie => cookie.expires);
		var expiration = 0;
		expireingCookies.forEach(cookie =>{
			if (expiration == 0 || expiration < cookie.expires) expiration = cookie.expires;
		});

		return expiration;
	}

	// a half coded concept to check if a specifiic cookie is expired
	// isExpired(cookieName) {
	// 	var now = new Date
	// 	var expiredCookie = this.cookies.find(cookie => cookie.name === cookieName);
	// 	if (expiredCookie[0].)
	// }

	// OLD
	// getCookieString(){
	// 	var cookieString = '';
	// 	for(var key in this.cookies) cookieString += key + '=' + this.cookies[key] + '; ';
	// 	return cookieString;
	// }
	getCookieString() {
		var cookieString = '';
		this.cookies.forEach(cookie => {
			cookieString += cookie.name + '=' + cookie.value + '; ';
		});


		return cookieString;
	}

};

module.exports = WebCookies;