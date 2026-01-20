const fetch = require("node-fetch");

exports.handler = async () => {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Missing env variables",
        tokenExists: !!token,
        baseIdExists: !!baseId
      })
    };
  }

  const url = `https://api.airtable.com/v0/${baseId}/Dates`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: data.error })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data.records)
  };
};
