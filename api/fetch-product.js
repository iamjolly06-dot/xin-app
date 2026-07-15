export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; XinBot/1.0)" },
    });
    const html = await response.text();

    const getMeta = (prop) => {
      const match = html.match(
        new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i")
      );
      return match ? match[1] : null;
    };

    const title = getMeta("og:title");
    const image = getMeta("og:image");
    const priceMeta = getMeta("product:price:amount") || getMeta("og:price:amount");
    const priceMatch = !priceMeta && html.match(/\$[\d,]+\.\d{2}/);

    res.status(200).json({
      name: title || null,
      img: image || null,
      price: priceMeta
        ? parseFloat(priceMeta)
        : priceMatch
        ? parseFloat(priceMatch[0].replace(/[$,]/g, ""))
        : null,
      source_url: url,
    });
  } catch (e) {
    res.status(500).json({ error: "Could not fetch that link" });
  }
}
