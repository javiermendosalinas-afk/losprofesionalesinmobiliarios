const https = require('https');

exports.handler = async (event) => {
  const API_KEY = 'hu5p841vw9zw5q50d0ye9dv97jlcwx';
  const page = event.queryStringParameters?.page || 1;
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.easybroker.com',
      path: `/v1/properties?page=${page}&per_page=50`,
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
            'Content-Type': 'application/json'
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
