exports.handler = async function (event) {
  const PEXELS_KEY = process.env.PEXELS_KEY;

  const query = event.queryStringParameters.query;

  try {
    const searchTerm = query + " close up texture material";
    const imgRes = await fetch("https://api.pexels.com/v1/search?query=" + encodeURIComponent(searchTerm) + "&per_page=1", {
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