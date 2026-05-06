const https = require('https');

const API_KEY = 'ml6j3925sg0elbpdgrwsj37cmxs8r6';
const CITIES = ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'San Pedro Tlaquepaque', 'Tonalá', 'Tlajomulco', 'Tlajomulco de Zúñiga'];

exports.handler = async (event) => {
  const page = event.queryStringParameters?.page || 1;
  const limit = event.queryStringParameters?.limit || 50;
  const operation = event.queryStringParameters?.operation || 'all';
  const city = event.queryStringParameters?.city || 'all';
  const type = event.queryStringParameters?.type || 'all';
  const minPrice = event.queryStringParameters?.min_price || '';
  const maxPrice = event.queryStringParameters?.max_price || '';
  const bedrooms = event.queryStringParameters?.bedrooms || '';

  let searchParams = `page=${page}&limit=${limit}`;

  if (operation === 'sale') searchParams += '&search[operation_types][]=sale';
  else if (operation === 'rent') searchParams += '&search[operation_types][]=rent';
  else searchParams += '&search[operation_types][]=sale&search[operation_types][]=rent';

  if (city !== 'all') {
    searchParams += `&search[cities][]=${encodeURIComponent(city)}`;
  } else {
    CITIES.forEach(c => { searchParams += `&search[cities][]=${encodeURIComponent(c)}`; });
  }

  if (type !== 'all') searchParams += `&search[property_types][]=${encodeURIComponent(type)}`;
  if (minPrice) searchParams += `&search[min_price]=${minPrice}`;
  if (maxPrice) searchParams += `&search[max_price]=${maxPrice}`;
  if (bedrooms) searchParams += `&search[bedrooms]=${bedrooms}`;
  searchParams += '&search[statuses][]=published';

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.easybroker.com',
      path: `/v1/properties?${searchParams}`,
      method: 'GET',
      headers: {
        'X-Authorization': API_KEY,
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600'
          },
          body: data
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: error.message })
      });
    });

    req.end();
  });
};
