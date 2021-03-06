const authentication = require('./authentication');

// triggers
const post_types = require('./triggers/post_types');
const authors = require('./triggers/authors');
const taxonomys = require('./triggers/taxonomys');
// const endpoint_types = require('./triggers/endpoint')

//creates
const medias = require('./creates/media');

// Resources
const post = require("./resources/post");

//this function adds the required headers to all API calls
const includeAuthHeaders = (request, z, bundle) => {
  
  if (!bundle.inputData.isExternal){
    if (bundle.authData.sessionKey) {
      request.headers = request.headers || {};
      request.headers['X-WP-Nonce'] = bundle.authData.sessionKey;
      request.headers['Cookie'] = bundle.authData.cookies;
      // request.url = bundle.authData.api_root + ((request.url) ? request.url : '');
    }
  }

  return request;
}

const supressError =  (request, z, bundle) => {
  request.skipThrowForStatus = true;

  if (request.status === 401 || request.status === 403){
    throw new z.errors.RefreshAuthError();
  }

  return request
}

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  beforeRequest: [includeAuthHeaders],
  afterResponse: [supressError],

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [post_types.key]: post_types,
    [authors.key]: authors,
    [taxonomys.key]: taxonomys,
    // [endpoint_types.key]: endpoint_types,
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [medias.key]: medias,
  },

  resources: {
    [post.key]: post
  },

  
};
