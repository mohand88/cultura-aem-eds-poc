export const fetchRecommandations = async (ean) => {
  const endpoint =
    "https://uc-info.eu.abtasty.com/v1/reco/889/recos/66c8839d-4157-4c36-8e9d-e6dfdeeba581";

  try {
    const fields = JSON.stringify([
      "name",
      "id",
      "ean",
      "sku",
      "link",
      "img_link",
      "price",
      "rating",
      "front_subtitle",
    ]);
    const variables = JSON.stringify({ viewing_item: ean });
    const params = new URLSearchParams({ fields, variables });

    const response = await fetch(`${endpoint}?${params.toString()}`, {
      method: "GET",
      headers: {
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaXRlX2lkIjo4ODksImlhdCI6MTc0MTYwNTUzMCwianRpIjoiU2ZkRXg3bDBaUWJfQ3llX0JLTWRVdUg2SENuUnRkd3hjcjRSRlhuRHFvbyJ9.FDCkLoyw3U4kGLyK49avPFDP10iqTExRfVTC4MiI5YY",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return null;
  }
};
