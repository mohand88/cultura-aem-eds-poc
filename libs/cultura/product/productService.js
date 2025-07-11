import {
  fetchProductDataCultura,
  fetchProductStocks,
} from "./productActions.js";
import { getParsedProduct } from "./productUtils.js";

export const getProductDataCultura = async (urlKey) => {
  try {
    const products = await fetchProductDataCultura(urlKey);

    const parsedData = getParsedProduct(products.items?.[0]);
    return parsedData;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return null;
  }
};

export const getProductStock = async (sku) => {
  const stocks = await fetchProductStocks(sku);

  if (!stocks) {
    return null;
  }

  return stocks.find((stock) => stock.sku === sku);
};
