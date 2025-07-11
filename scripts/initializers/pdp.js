/* eslint-disable import/no-cycle */
/* eslint-disable import/prefer-default-export */

import {
  initialize,
  setEndpoint,
  setFetchGraphQlHeaders,
} from "@dropins/storefront-pdp/api.js";
import { initializers } from "@dropins/tools/initializer.js";
import { getProductDataCultura } from "../../libs/cultura/product/productService.js";
import {
  commerceEndpointWithQueryParams,
  fetchPlaceholders,
  getOptionsUIDsFromUrl,
  getSkuFromUrl,
  loadErrorPage,
} from "../commerce.js";
import { getHeaders } from "../configs.js";
import { initializeDropin } from "./index.js";

export const IMAGES_SIZES = {
  width: 960,
  height: 1191,
};

await initializeDropin(async () => {
  // Set Fetch Endpoint (Service)
  const endpoint = await commerceEndpointWithQueryParams();
  setEndpoint(endpoint);

  // Set Fetch Headers (Service)
  setFetchGraphQlHeaders((prev) => ({ ...prev, ...getHeaders("cs") }));

  const sku = getSkuFromUrl();
  const optionsUIDs = getOptionsUIDsFromUrl();

  const [labels] = await Promise.all([fetchPlaceholders()]);

  const product = await getProductDataCultura(sku);

  if (!product?.sku) {
    return loadErrorPage();
  }

  const langDefinitions = {
    default: {
      ...labels,
    },
  };

  const models = {
    ProductDetails: {
      initialData: { ...product },
    },
  };

  // Initialize Dropins
  return initializers.mountImmediately(initialize, {
    sku,
    optionsUIDs,
    langDefinitions,
    models,
    acdl: true,
    persistURLParams: true,
  });
})();
