const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { date, name } = JSON.parse(event.body);

    if (!date || !name) {
      return {
        statusCode: 400,
        body: "Missing date or name"
      };
    }

    const baseId = process.env.AIRTABLE_BASE_ID;
    const token = process.env.AIRTABLE_TOKEN;
    const tableName = encodeURIComponent("Dates");

    // 🔎 Check if date already exists
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
        body: "Date already taken"
      };
    }

    // ✅ Create new record
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
        body: err
      };
    }

    return {
      statusCode: 200,
      body: "Booked"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};
