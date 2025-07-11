import { h } from "https://esm.sh/preact";
import { useEffect, useState } from "https://esm.sh/preact/hooks";
import { getProductStock } from "../../../libs/cultura/product/productService.js";

export const ProductStock = ({ product }) => {
  const [stock, setStock] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getProductStock(product.sku).then((res) => {
      if (!cancelled) {
        setStock(res);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [product.sku]);

  return h("div", null, [
    h("span", { class: "stock-label" }, "Disponibilité : "),
    h(
      "span",
      { class: "stock-value" },
      stock?.front_availability ?? "Chargement..."
    ),
  ]);
};
