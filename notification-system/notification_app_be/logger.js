require("dotenv").config();

let token = null;

async function getToken() {
  if (token) return token;

  const response = await fetch("http://4.224.186.213/evaluation-service/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLL_NO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    })
  });

  if (!response.ok) {
    throw new Error("Auth failed");
  }

  const data = await response.json();
  token = data.access_token;
  return token;
}

async function Log(stack, level, packageName, message) {
  try {
    const accessToken = await getToken();
    const safeStack = String(stack || "").toLowerCase();
    const safeLevel = String(level || "").toLowerCase();
    const safePackage = String(packageName || "").toLowerCase();

    const response = await fetch("http://4.224.186.213/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        stack: safeStack,
        level: safeLevel,
        package: safePackage,
        message
      })
    });

    if (!response.ok) {
      throw new Error("Log API failed");
    }
  } catch (err) {
    console.log("Log failed");
  }
}

module.exports = { Log, getToken };