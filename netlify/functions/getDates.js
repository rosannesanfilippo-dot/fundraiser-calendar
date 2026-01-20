const fetch = require("node-fetch");

exports.handler = async () => {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const url = `https://api.airtable.com/v0/${baseId}/Dates`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` }
    });

    const text = await response.text(); // Read raw response

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Invalid JSON from Airtable", raw: text })
      };
    }

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
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
