const axios = require("axios");

const AUTH_BASE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:4000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

async function addReputation(userId, delta) {
  if (!INTERNAL_API_KEY) {
    throw new Error("INTERNAL_API_KEY missing in lore-service .env");
  }

  const url = `${AUTH_BASE_URL}/internal/users/${userId}/reputation`;

  const { data } = await axios.patch(
    url,
    { delta },
    {
      headers: { "x-internal-api-key": INTERNAL_API_KEY },
      timeout: 5000,
    }
  );

  return data;
}

module.exports = { addReputation };

