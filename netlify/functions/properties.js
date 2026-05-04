exports.handler = async (event) => {
  const API_KEY = 'hu5p841vw9zw5q50d0ye9dv97jlcwx';
  const page = event.queryStringParameters?.page || 1;
  try {
    const response = await fetch(
      `https://api.easybroker.com/v1/properties?page=${page}&per_page=50`,
      { headers: { 'X-Authorization': API_KEY, 'Accept': 'application/json' } }
    );
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
