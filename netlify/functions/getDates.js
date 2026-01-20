exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      tokenExists: !!process.env.AIRTABLE_TOKEN,
      baseIdExists: !!process.env.AIRTABLE_BASE_ID
    })
  };
};
