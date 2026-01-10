const axios = require("axios");

const AUTH_URL = process.env.AUTH_SERVICE_URL || "http://localhost:4000";
const API_KEY = process.env.INTERNAL_API_KEY;

async function addReputation(userId, delta) {
  if (!API_KEY) throw new Error("INTERNAL_API_KEY missing in lore .env");

  return axios.post(
    `${AUTH_URL}/internal/reputation`,
    { userId, delta },
    { headers: { "x-api-key": API_KEY } }
  );
}

module.exports = { addReputation };
