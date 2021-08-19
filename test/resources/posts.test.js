/* globals describe, expect, test, it */

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
// read the `.env` file into the environment, if available
zapier.tools.env.inject();

describe('resources.posts', () => {
  it('should run', async () => {
    const bundle = { 
      authData: {
        baseURL: process.env.baseURL,
        loginURL: process.env.loginURL,
        username: process.env.username,
        password: process.env.password,
      },
      inputData: {
        post_type: 'posts',
      },
     };

    await appTester(App.authentication.sessionConfig.perform, bundle);
    const results = await appTester(App.resources.post.list.operation.perform, bundle);
    expect(results).toBeDefined();
    // TODO: add more assertions
  });
});
