exports.handler = async (event, context) => {
    const now = new Date().toISOString();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "The current time is:",
        time: now
      })
    };
  };
  