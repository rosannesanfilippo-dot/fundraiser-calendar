const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { date, name } = JSON.parse(event.body);

  const baseId = process.env.AIRTABLE_BASE_ID;

  const url = `https://api.airtable.com/v0/${appSQJLAwJmHXVDEQ}/Dates`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: { Date: date, Name: name }
    })
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
