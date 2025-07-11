import { h } from "https://esm.sh/preact";
import { useEffect, useState } from "https://esm.sh/preact/hooks";
import { fetchCrossFormats } from "../../../libs/cultura/product/productActions.js";

export const CrossFormats = ({ product }) => {
  const [crossFormats, setCrossFormats] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchCrossFormats(product.variantSku).then((res) => {
      if (!cancelled) {
        setCrossFormats(res);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [product.variantSku]);

  return h("div", null, [
    h("span", { class: "stock-label" }, "cross formats : "),
    h(
      "span",
      { class: "stock-value" },
      crossFormats?.total_count ?? "Chargement..."
    ),
  ]);
};
