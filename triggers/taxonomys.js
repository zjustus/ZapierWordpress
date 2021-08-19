const listTaxonomy = async (z, bundle) => {
	const request = await z.request(`${bundle.authData.api_root}${bundle.inputData.taxonomy}`,
		{
			params: {
				context: 'edit',
				per_page: 99,
			}
		});
	if (request.status != 200) throw 'An unexpected error occured';
	var response = request.json;
	var taxonomys = [];
	for (taxonomy in response) {
		var tempTax = { id: response[taxonomy].id, name: response[taxonomy].name };
		taxonomys.push(tempTax);
	}

	return taxonomys;
}

module.exports = {
	key: 'taxonomy',
	noun: 'Taxonomy',
	display: {
		hidden: true,
	},
	operation: {
		perform: listTaxonomy,
		inputFields: [
			{ key: 'taxonomy', required: true },
		],
		sample: {
			id: 101,
			name: 'UFO\'s',
		}
	},
}