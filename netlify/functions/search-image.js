exports.handler = async function (event) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const PEXELS_KEY = process.env.PEXELS_KEY;
  const MODEL = "gemini-3.5-flash-lite";
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent?key=" + GEMINI_API_KEY;

  const query = event.queryStringParameters.query;

  try {
    const translatePrompt = query + "라는 한국 건축 인테리어 자재를 스톡 사진 사이트에서 검색할 영어 키워드를 만들어줘. 재질과 질감이 클로즈업으로 잘 보이는 사진을 찾기 위한 키워드로, 특정 나라 스타일에 치우치지 않게 만들어줘. 설명 없이 영어 키워드만 2~5단어로 출력해줘.";

    const translateRes = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: translatePrompt }] }] })
    });
    const translateData = await translateRes.json();
    const englishQuery = translateData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || query;

    const imgRes = await fetch("https://api.pexels.com/v1/search?query=" + encodeURIComponent(englishQuery) + "&per_page=1", {
      headers: { Authorization: PEXELS_KEY }
    });
    const imgData = await imgRes.json();
    const photo = imgData?.photos?.[0];

    return {
      statusCode: 200,
      body: JSON.stringify(photo ? { url: photo.src.large, photographer: photo.photographer } : { url: null })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
