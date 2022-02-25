const FormData = require('form-data');
const postMedia = async (z, bundle) => {

	//step 1, get the image
	bundle.inputData.isExternal = true; //this bypasses adding headers, important to not leak your cookies
	var Imgrequest = {};
	Imgrequest.method = 'GET';
	Imgrequest.url = bundle.inputData.imageURL;
	Imgrequest.raw = true;
	const imageFile = await z.request(Imgrequest);
	

	//step 2, compile the needed resources to make a post
	const imgObj = {};
	const ZformData = new FormData();
	let imageName = bundle.inputData.imageURL;

	// this section is the tricky part, file name. If the file extension is included in the URL use that, otherwise pull it from the "content-type"
	if (imageName.match(/[^\/]+\.[^.]+$/g)) imageName = imageName.match(/[^\/]+\.[^.]+$/g)[0];
	else{
		imageName = imageName.match(/[^\/]+$/g)[0];
		imageName += '.' + imageFile.getHeader('content-type').match(/[^\/]+$/g)[0];
	}
	console.log("Image Name: " + imageName);
	
	imgObj.file = await imageFile.body;
	imgObj.filename = imageName;
	ZformData.append('file', imgObj.file, imgObj.filename);

	bundle.inputData.isExternal = false; //make sure to reinable the security after external resource has been aquired

	//step 3, upload to wordpress
	let result = await z.request({
		url: `${bundle.authData.api_root}media`,
		method: 'POST',
		body: ZformData,
	});

	result = result.json;
	const wpImage = {
		id: result.id,
		date: result.date,
		date_gmt: result.date_gmt,
		modified: result.modified,
		modified_gmt: result.modified_gmt,
		slug: result.slug,
		title: result.title.rendered,
	};

	return wpImage;
	
}

module.exports = {
	key: 'media',
	noun: 'Post Media',
	display: {
		label: 'Create Media',
		description: 'Creates a media object',
	},
	operation: {
		perform: postMedia,
		inputFields: [
			{ key: 'imageURL', required: true, label:"Image URL" },
		],
		sample: {
			id: 307337,
			date: '2021-10-04T08:20:03',
			date_gmt: '2021-10-04T15:20:03',
			modified: '2021-10-04T08:20:03',
			modified_gmt: '2021-10-04T15:20:03',
			slug: 'sddefault',
			title: 'sddefault',
		}
	},
}