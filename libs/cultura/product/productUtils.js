export const IMAGES_SIZES = {
  width: 960,
  height: 1191,
};

export const getParsedProduct = (p) => ({
  __typename: "SimpleProductView",
  ...p,
  price: {
    final: {
      amount: {
        value: p.price_range.minimum_price.final_price.value,
        currency: p.price_range.minimum_price.final_price.currency,
      },
    },
    regular: {
      amount: {
        value: p.price_range.minimum_price.regular_price.value,
        currency: p.price_range.minimum_price.regular_price.currency,
      },
    },
    roles: ["visible"],
  },
  shortDescription: p.front_subtitle,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  images: [
    {
      url: `https://cdn.cultura.com/cdn-cgi/image/width=${IMAGES_SIZES.width},height=${IMAGES_SIZES.height}/${p.image.url}`,
      label: "",
      roles: ["image", "small_image", "thumbnail", "swatch_image"],
    },
    {
      url: `https://cdn.cultura.com/cdn-cgi/image/width=${IMAGES_SIZES.width},height=${IMAGES_SIZES.height}/${p.image.url}`,
      roles: ["image", "small_image", "thumbnail", "swatch_image"],
      label: "",
    },
  ],
  attributes: [
    {
      name: "cost",
      label: "Cost",
      value: "",
      roles: ["visible_in_pdp"],
    },
    {
      name: "weight",
      label: "Weight",
      value: 0.4,
      roles: ["visible_in_pdp"],
    },
  ],
  urlKey: p.url_key,
  metaTitle: p.name,
  metaDescription: p.front_subtitle,
  metaKeyword: "",
  inStock: true,
  addToCartAllowed: true,
  url: `${window.location.origin}/products/${p.url_key}`,
  variantSku: p.erp_product_code,
});
