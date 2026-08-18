exports.handler = async function (event) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const MODEL = "gemini-3.5-flash-lite";
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent?key=" + GEMINI_API_KEY;

  const query = event.queryStringParameters.query;

  const prompt = query + "라는 건축/인테리어 자재에 대해 한국어로 설명해줘. 1. 특징 2. 장점 3. 단점 4. 일반적인 가격대(평당 또는 ㎡당). 전문 용어는 최소화하고 일반인이 이해하기 쉽게, 간결하게 정리해줘.";

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
