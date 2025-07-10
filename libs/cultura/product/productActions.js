import { getConfigValue } from "../../../scripts/configs.js";

export const fetchProductStocks = async (sku) => {
  const apiEndpoint = getConfigValue("commerce-core-endpoint");

  const query = `
    query getStocks($skus: [String], $urlKey: String) {
      getStocks(skus: $skus, url_key: $urlKey) {
          stock_infos {
              sku
              front_availability
              availability_date
              order_delay
              min_quantity_in_cart
              max_quantity_in_cart
              qty_increments
              offer {
                  seller_code
                  front_availability
              }
          }
      }
    }
  `;

  try {
    const variables = JSON.stringify({ skus: [sku] });
    const params = new URLSearchParams({ query, variables });

    const response = await fetch(`${apiEndpoint}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.getStocks.stock_infos;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return null;
  }
};
