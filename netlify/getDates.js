const fetch = require("node-fetch");

exports.handler = async () => {
  const baseId = process.env.AIRTABLE_BASE_ID;

  const url = `https://api.airtable.com/v0/${baseId}/Dates`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` }
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data.records)
  };
};
