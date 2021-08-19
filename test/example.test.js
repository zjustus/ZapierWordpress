// Globals
const zapier = require('zapier-platform-core');
zapier.tools.env.inject();

const App = require('../index');
const appTester = zapier.createAppTester(App);

const bundle = {
  authData: {
    baseURL: process.env.baseURL,
    loginURL: process.env.loginURL,
    username: process.env.username,
    password: process.env.password,
  },
};

describe('RTB Wordpress APP', () => {

  it('It should sign in and test credentials', async() => {

    const authData = await appTester(App.authentication.sessionConfig.perform, bundle);

    await appTester(App.authentication.sessionConfig.perform, bundle);

    const response = await appTester(App.authentication.test, bundle);
    expect(response.status).toBe(200);

    return response;
  });


  // it('should access the "authors" endpoint', async () => {

  //   const response = await appTester(App.triggers.authors.operation.perform, bundle);
  //   // console.log(response);
  //   return response;
  // });

  // it('should access the post types endpoint', async () => {
  //   const tbundle = bundle;
  //   tbundle.inputData = {
  //     taxonomy: 'blog_channel',
  //   };

  //   const response = await appTester(App.resources.post.list.operation.perform, tbundle);
  //   console.log(response);
  //   return response;
  // });

});