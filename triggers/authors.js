const listAuthors = async (z, bundle) => {
	const request = await z.request(`${bundle.authData.api_root}users`,
		{
			params: {
				context: 'edit',
				per_page: 99,
			}
		});
	if (request.status != 200) throw 'an unexpected error occured';
	var response = request.json;
	var authors = [];
	for (author in response) {
		var tempAuthor = { id: response[author].id, name: response[author].name };
		authors.push(tempAuthor);
	}

	return authors;
}

module.exports = {
	key: 'authors',
	noun: 'Authors',
	display: {
		hidden: true,
	},
	operation: {
		perform: listAuthors,
		sample: {
			id: 101,
			name: 'Hugh Ross'
		}
	},
}