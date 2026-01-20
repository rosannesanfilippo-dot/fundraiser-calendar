const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method not allowed. Use POST."
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: "Missing request body."
      };
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch (err) {
      return {
        statusCode: 400,
        body: "Invalid JSON."
      };
    }

    const { date, name } = body;

    if (!date || !name) {
      return {
        statusCode: 400,
        body: "Missing date or name."
      };
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const token = process.env.AIRTABLE_TOKEN;
    const tableName = encodeURIComponent("Dates");

    // Check if date exists
    const checkUrl = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(
      `{Date}="${date}"`
    )}`;

    const checkRes = await fetch(checkUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const checkData = await checkRes.json();

    if (checkData.records && checkData.records.length > 0) {
      return {
        statusCode: 409,
        body: "Date already taken."
      };
    }

    // Create new record
    const createRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            Date: date.toString(),
            Name: name
          }
        })
      }
    );

    if (!createRes.ok) {
      const err = await createRes.text();
      return {
        statusCode: 500,
        body: `Airtable error: ${err}`
      };
    }

    return {
      statusCode: 200,
      body: "Booked successfully!"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};
