exports.handler = async function (event) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const MODEL = "gemini-3.5-flash-lite";
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent?key=" + GEMINI_API_KEY;

  const query = event.queryStringParameters.query;

  const prompt = "Explain the home renovation/building material \"" + query + "\" in English, for a homeowner with no construction background. Include: 1. Brief description 2. Pros 3. Cons 4. Typical price range (per square foot, in USD, materials + installation combined). Keep jargon to a minimum and keep the whole answer concise.";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      statusCode: 200,
      body: JSON.stringify({ text })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};