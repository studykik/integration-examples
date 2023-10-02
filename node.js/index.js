const https = require('https');

const STUDYKIK_SIGNUP_API = ''; // API Endpoint provided by StudyKIK
const STUDYKIK_PROTOCOL_LANDING_PAGE_UUID = ''; // Signup ID provided by StudyKIK

const data = JSON.stringify({
	protocolLandingPageUUID: STUDYKIK_PROTOCOL_LANDING_PAGE_UUID,
	email: 'foobar@example.com',
	firstName: 'Foo',
	lastName: 'Bar',
	phone: '+1XXXXXXXXXX',
	postalCode: '91302',

	// Optional Signup parameters below
	ethnicities: ['Asian'], //  Options Include - "American Indian or Alaska Native", "Black or African American", "Asian", "Hispanic or Latino", "Middle Eastern or North African", "Native Hawaiian or Other Pacific Islander", "White or Caucasian", "Prefer not to say"
	gender: 'Cisgender Male', // Options Include - "Cisgender Male", "Cisgender Female", "Transgender Male", "Transgender Female", "Non Binary", "Prefer not to say"
	measurementSystem: 'metric', // Options Include - "imperial", "metric"
	height: 155.5, // In centimeters if metric, inches if imperial
	weight: 165.5, // In kilograms if metric, pounds if imperial
	country: 'US',
	timezone: 'America/Los_Angeles',

	// Optional UTM Parameters
	utmCampaign: 'campaign',
	utmSource: 'source',
	utmMedium: 'medium',
	utmTerm: 'term',
	utm: 'utm',
	utmId: 'id',
	utmContent: 'content',
});

const options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
};

const req = https.request(STUDYKIK_SIGNUP_API, options, (res) => {
	let responseData = '';

	res.on('data', (chunk) => {
		responseData += chunk;
	});

	res.on('end', () => {
		if (res.statusCode !== 201) {
			console.error(`Request failed with status code ${res.statusCode}`);
			console.error(responseData);
		} else {
			const parsedData = JSON.parse(responseData);
			console.log('Response data:', parsedData);
			// If required for this trial, you can create a prescreener link with the data returned from the API
			// const prescreenerLink = `https://www.studykik.com/study-survey/${parsedData.uuid}`;
		}
	});
});

req.on('error', (error) => {
	console.error('Error:', error);
});

req.write(data);
req.end();
