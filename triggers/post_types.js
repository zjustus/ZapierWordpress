const listTypes = async (z, bundle) => {
	const request = await z.request(`${bundle.authData.api_root}types`,
	{
		params: {
			context: 'edit',
		}
	});
	if(request.status != 200) throw 'an unexpected error occured';
	var response = request.json;
	var types = [];
	for(type in response){
		// z.console.log(response[type].viewable);
		if (response[type].viewable){
			var tempType = { id: response[type].rest_base, name: response[type].name };
			// var tempType = { id: response[type].slug, name: response[type].rest_base };
			types.push(tempType);
		}
	}
	return types;
	// return request.then(response => response.json);
}

module.exports = {
	key: 'post_types',
	noun: 'Post Types',
	display: {
		hidden: true,
	},
	operation: {
		perform: listTypes,
		sample: {
			id: 'post_type',
			name: 'Post Type'
		}
	},
}