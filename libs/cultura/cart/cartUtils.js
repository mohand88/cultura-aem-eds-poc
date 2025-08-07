export const IMAGES_SIZES = {
  width: 960,
  height: 1191,
};

export const parseToAEMCart = (culturaCart) => {
  const data = {
    id: culturaCart.id,
    totalQuantity: culturaCart.total_quantity,
    totalUniqueItems: culturaCart.items.length,
    errors: culturaCart.cart_error,
    items: culturaCart.items.map((item) => ({
      itemType: "SimpleCartItem",
      uid: item.id,
      url: {
        urlKey: item.product.sku,
        categories: ["all", "apparel"],
      },
      canonicalUrl: null,
      categories: ["All", "Apparel"],
      quantity: item.quantity,
      sku: item.product.sku,
      topLevelSku: item.product.sku,
      name: item.product.name,
      image: {
        src: `https://cdn.cultura.com/cdn-cgi/image/width=${IMAGES_SIZES.width},height=${IMAGES_SIZES.height}/${item.product.thumbnail.url}`,
        alt: item.product.name,
      },
      price: {
        value: item.prices.price.value,
        currency: "EUR",
      },
      taxedPrice: {
        value: item.prices.price_incl_tax.value,
        currency: "EUR",
      },
      rowTotal: {
        value: item.prices.row_total_final_price.value,
        currency: "EUR",
      },
      rowTotalIncludingTax: {
        value: item.prices.row_total_including_tax.value,
        currency: "EUR",
      },
      total: {
        value: item.prices.row_total_final_price.value,
        currency: "EUR",
      },
      regularPrice: {
        value: item.prices.price.value,
        currency: "EUR",
      },
    })),
    total: {
      includingTax: {
        value: culturaCart.prices.grand_total.value,
        currency: "EUR",
      },
      excludingTax: {
        value: culturaCart.prices.subtotal_excluding_tax.value,
        currency: "EUR",
      },
    },
    subtotal: {
      includingTax: {
        value: culturaCart.prices.subtotal_including_tax.value,
        currency: "EUR",
      },
      excludingTax: {
        value: culturaCart.prices.subtotal_excluding_tax.value,
        currency: "EUR",
      },
      includingDiscountOnly: {
        value: culturaCart.prices.subtotal_with_discount_including_tax.value,
        currency: "EUR",
      },
    },
  };

  return data;
};
