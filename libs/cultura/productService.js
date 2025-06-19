import { getParsedProduct } from "./productUtils.js";

export const fetchProductDataCultura = async (urlKey) => {
  //const endpoint = "https://www.cultura.com/magento/graphql";
  const endpoint = "http://localhost:4000/proxy/graphql";

  const query = `
    query GET_PRODUCT_DATA_CULTURA($urlKey: String!) {
      products(resolverLight: 1, filter: {url_key: {eq: $urlKey}}) {
        items {
          id
          sku
          name
          url_key
          front_subtitle
          image {
            url
          }
          price_range {
            minimum_price {
              regular_price {
                value
                currency
              }
              final_price {
                value
                currency
              }
            }
          }
        }
      }
    }
  `;

  const variables = { urlKey };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const p = result.data.products.items?.[0];

    return getParsedProduct(p);
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return null;
  }
};
