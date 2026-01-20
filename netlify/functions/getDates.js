const fetch = require("node-fetch");

exports.handler = async () => {
  try {
    const baseId = process.env.AIRTABLE_BASE_ID;
    const token = process.env.AIRTABLE_TOKEN;
    const tableName = encodeURIComponent("Dates");

    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return {
        statusCode: 500,
        body: `Airtable error: ${err}`
      };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data.records)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};
