exports.handler = async function (event) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const MODEL = "gemini-3.5-flash-lite";
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent?key=" + GEMINI_API_KEY;

  const query = event.queryStringParameters.query;

  const prompt = "건축·인테리어 자재 \"" + query + "\"에 대해 건축 지식이 없는 일반인이 이해하기 쉽게 자연스러운 한국어로 설명하세요. 반드시 모든 내용을 한국어로 작성하세요. 다음 내용을 포함하세요: 1. 간단한 설명 2. 장점 3. 단점 4. 한국에서의 일반적인 가격 범위(자재비와 시공비 포함, 제곱미터당 원화 기준). 전문 용어는 최소화하고 전체 답변은 간결하게 작성하세요.";
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