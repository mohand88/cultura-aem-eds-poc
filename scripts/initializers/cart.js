/* eslint-disable import/no-cycle */
import { events } from "@dropins/tools/event-bus.js";

import {
  // initialize,
  setFetchGraphQlHeaders,
} from "@dropins/storefront-cart/api.js";
// import { initializers } from "@dropins/tools/initializer.js";
// import { fetchPlaceholders } from "../commerce.js";
import { getHeaders } from "../configs.js";
import { initializeDropin } from "./index.js";

import { getCartDetails } from "../../libs/cultura/cart/cartServices.js";

await initializeDropin(async () => {
  setFetchGraphQlHeaders((prev) => ({ ...prev, ...getHeaders("cart") }));

  // const labels = await fetchPlaceholders();
  // const langDefinitions = {
  //   default: {
  //     ...labels,
  //   },
  // };
  // return initializers.mountImmediately(initialize, { langDefinitions });

  events.emit("cart/data", await getCartDetails());

  // Pour l'instant, on retourne une promesse résolue pour éviter l'erreur
  return Promise.resolve();
})();
