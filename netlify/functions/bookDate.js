const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    // Only accept POST requests
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
    const tableName = encodeURIComponent("Dates"); // Make sure your table is named exactly "Dates"

    // Check if date already exists
    const checkUrl = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(
      `{date}="${date}"`
    )}`;

    const checkRes = await fetch(checkUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const checkData = await checkRes.json();

    if (checkData.records && checkData.records.length > 0) {
      return {
        statusCode: 409,
        body: "Date already booked."
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
            date: date, // make sure Airtable column "date" is Number type for this
            name: name
          }
        })
      }
    );

    const createData = await createRes.json();

    // Check if Airtable accepted the record
    if (!createRes.ok) {
      console.error("Airtable create error:", createData);
      return {
        statusCode: 500,
        body: JSON.stringify(createData)
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(createData)
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: "Server error."
    };
  }
};
