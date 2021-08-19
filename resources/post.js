// get a list of postss
const listPosts = async (z, bundle) => {
  const response = await z.request(`${bundle.authData.api_root}${bundle.inputData.post_type}`,
    {
      params: {
        context: 'edit',
      }
    });

  var process = [];
  response.json.forEach((post) => {
    var tempPost = {};
    tempPost.id = post.id;
    tempPost.date = Date.parse(post.date);
    tempPost.date_gmt = Date.parse(post.date_gmt);
    tempPost.guid = post.guid.rendered;
    tempPost.modified = Date.parse(post.modified);
    tempPost.modified_gmt = Date.parse(post.modified_gmt);
    tempPost.slug = post.slug;
    tempPost.status = post.status;
    tempPost.type = post.type;
    tempPost.link = post.link;
    tempPost.title = post.title.rendered;
    tempPost.content = post.content.rendered;
    tempPost.excerpt = post.excerpt.rendered;
    tempPost.author = post.author;
    tempPost.featured_media = post.featured_media;
    tempPost.categories = post.categories;
    tempPost.tags = post.tags;



    process.push(tempPost);
  });

  return process;
}


// find a particular posts by name (or other search criteria)
const performSearch = async (z, bundle) => {
  const response = await z.request({
    url: 'https://jsonplaceholder.typicode.com/posts',
    params: {
      name: bundle.inputData.name
    }
  });
  return response.data
};

// creates a new posts
const performCreate = async (z, bundle) => {
  var request = {};
  request.method = 'POST';
  request.url = `${bundle.authData.api_root}${bundle.inputData.post_type}`;

  var requestBody = {};
  for (field in bundle.inputData){
    if (field != 'post_type') requestBody[field] = bundle.inputData[field];
  }
  request.body = requestBody;

  const response = await z.request(request);
  return response.data
};

//this gets the paramaters of a post request to a given post type
const getPostTypeParamaters = async (z, bundle) => {
  const request = await z.request(`${bundle.authData.api_root}`,
  {
    params: {
      context: 'edit',
    }
  });
  if (request.status != 200) throw "Could not get list";

  var data = [];
  if (request.json.routes[`/${bundle.authData.version_sring}${bundle.inputData.post_type}`].endpoints) { //if the methods exist
    for (const method of request.json.routes[`/${bundle.authData.version_sring}${bundle.inputData.post_type}`].endpoints){
      if (method.methods.includes('POST')) { //if posts is available
        
        // z.console.log(method.args);
        for (const arg in method.args) {
          if(
            arg != 'slug' &&
            arg != 'menu_order' && 
            arg != 'template' &&
            arg != 'sticky' &&
            arg != 'ping_status' &&
            arg != 'format' &&
            arg != 'meta'
          ){
            tempArg = {};

            // this area is the regular arguments
            tempArg.key = arg;
            tempArg.label = arg;
            tempArg.required = method.args[arg].required;
            tempArg.helpText = method.args[arg].description;

            // this area handles special dropdowns
            if (arg == 'author') tempArg.dynamic = 'authors.id.name';
            else if (method.args[arg].enum) tempArg.choices = method.args[arg].enum;


            // this area handles object type
            if (method.args[arg].format) {
              if (method.args[arg].format == 'date-time') tempArg.type = 'datetime';
              else tempArg.type = 'string';
            }
            else if (method.args[arg].type == 'array') {
              tempArg.type = 'number';
              tempArg.list = true;

              var options = await z.request(`${bundle.authData.api_root}${arg}`,
              {
                params: {
                  context: 'edit',
                  per_page: 99,
                }
              });
              if (options.status != 200) throw 'An unexpected error occured';
              options = options.json;
              var taxonomys = {};
              for (taxonomy in options) taxonomys[options[taxonomy].id] = options[taxonomy].name;

              tempArg.choices = taxonomys;

              
            }
            else if (method.args[arg].type == 'object') tempArg.type = 'string';
            // else if (method.args[arg].type == 'number');
            else tempArg.type = method.args[arg].type

            data.push(tempArg);
          }
        }
      }
    }
  }

  return data; //must return an array of objects of a given post type!
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#resourceschema
  key: 'post',
  noun: 'Post',

  // If `get` is defined, it will be called after a `search` or `create`
  // useful if your `searches` and `creates` return sparse objects
  // get: {
  //   display: {
  //     label: 'Get Posts',
  //     description: 'Gets a posts.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'id', required: true}
  //     ],
  //     perform: defineMe
  //   }
  // },

  list: {
    display: {
      label: 'New Posts',
      description: 'Triggers when a new post is added.',
    },
    operation: {
      perform: listPosts,
      inputFields: [
        {
          key: 'post_type',
          required: true,
          label: 'Post Type',
          dynamic: 'post_types.id.name',
        },
      ],
    },
    // operation: {
    //   perform: getPostTypeParamaters,
    //   inputFields: [
    //     {
    //       key: 'post_type',
    //       required: true,
    //       label: 'Post Type',
    //       // dynamic: 'post_types.id.name',
    //     },
    //   ],
    // },
  },

  // search: {
  //   display: {
  //     label: 'Find Posts',
  //     description: 'Finds a posts give.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'name', required: true}
  //     ],
  //     perform: performSearch
  //   },
  // },


  create: {
    display: {
      label: 'Create Posts',
      description: 'Creates a new posts.'
    },
    operation: {
      inputFields: [
        {
          key: 'post_type',
          required: true,
          label: 'Post Type',
          dynamic: 'post_types.id.name',
          altersDynamicFields: true,
        },
        getPostTypeParamaters,
      ],
      perform: performCreate
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obvious placeholder values that we can show to any user.
  // In this resource, the sample is reused across all methods
  sample: {
    id: 305554,
    date: '2021-08-12T05:00-0000',
    date_gmt: '2021-08-12T12:00-0000',
    guid: 'https://wordpress.org/?p=305554',
    modified: '2021-08-12T05:00-0000',
    modified_gmt: '2021-08-12T12:00-0000',
    slug: 'do-ufo-s-exist',
    status: 'publish',
    type: 'post',
    link: 'https://wordpress.org/blogs/do-ufo-s-exist',
    title: 'Do Ufo\'s Exist?',
    content: 'Yes they do',
    excerpt: 'Yes',
    author: 588,
    featured_media: 305726,
  },
  // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
  // For a more complete example of using dynamic fields see
  // https://github.com/zapier/zapier-platform/tree/master/packages/cli#customdynamic-fields
  // Alternatively, a static field definition can be provided, to specify labels for the fields
  // In this resource, these output fields are reused across all resources
  // outputFields: [
  //   {key: 'id', label: 'ID'},
  //   {key: 'name', label: 'Name'}
  // ]
};
