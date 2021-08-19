//this is potentially abandoned, more on this later I think...
const listEndpointPostParamaters = async (z, bundle) => {
	const request = await z.request(`${bundle.authData.api_root}`,
		{
			params: {
				context: 'edit',
			}
		});


	var data = [];
	if (request.json.routes[`/${bundle.authData.version_sring}${bundle.inputData.type}`].endpoints) { //if the methods exist
		request.json.routes[`/${bundle.authData.version_sring}${bundle.inputData.type}`].endpoints.forEach((method) => {
			if (method.methods.includes('POST')) { //if posts is available

				// z.console.log(method.args);
				for (const arg in method.args){
					tempArg = {};
					tempArg.key = arg;
					tempArg.label = arg;
					tempArg.required = method.args[arg].required;
					tempArg.helpText = method.args[arg].description;
					if (method.args[arg].enum) tempArg.choices = method.args[arg].enum;
	
					if (method.args[arg].format) {
						if (method.args[arg].format == 'date-time') tempArg.type = 'DateTime';
						else {
							tempArg.type = 'string';
						}
					}
					else if (method.args[arg].type == 'object' || method.args[arg].type == 'array') {
						tempArg.type = 'string';
					}
					else tempArg.type = method.args[arg].type
	
	
					data.push(tempArg);
				}
			}
		});
	}
	console.log(data);

	return data;
	// return request.then(response => response.json);
}

module.exports = {
	key: 'endpoints',
	noun: 'Get Endpoints',
	display: {
		hidden: true,
	},
	operation: {
		perform: listEndpointPostParamaters,
		inputFields:[
			{key: 'type', required: true},
		],
		// sample: {
		// 	id: 'post_type',
		// 	name: 'Post Type'
		// }
	},
}