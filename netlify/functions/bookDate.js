const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method not allowed. Use POST." };
    }

    if (!event.body) {
      return { statusCode: 400, body: "Missing request body." };
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch (err) {
      return { statusCode: 400, body: "Invalid JSON." };
    }

    const { date, name, donation } = body;
    if (!date || !name || donation === undefined || donation <= 0) {
      return { statusCode: 400, body: "Missing or invalid date, name, or donation." };
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const token = process.env.AIRTABLE_TOKEN;
    const tableName = encodeURIComponent("Dates"); // Ensure table is named "Dates"

    // Check if date already booked
    const checkUrl = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(`{date}="${date}"`)}`;
    const checkRes = await fetch(checkUrl, { headers: { Authorization: `Bearer ${token}` } });
    const checkData = await checkRes.json();

    if (checkData.records && checkData.records.length > 0) {
      return { statusCode: 409, body: "Date already booked." };
    }

    // Create new record
    const createRes = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: { date, name, donation } // donation is a number
      })
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      console.error("Airtable create error:", createData);
      return { statusCode: 500, body: JSON.stringify(createData) };
    }

    return { statusCode: 200, body: JSON.stringify(createData) };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Server error." };
  }
};
