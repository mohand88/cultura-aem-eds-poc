import { getConfigValue } from "../../../scripts/configs.js";

export const createEmptyCart = async () => {
  const apiEndpoint = getConfigValue("commerce-core-endpoint");

  const query = `
    mutation {
      createEmptyCart
    }
  `;

  try {
    const response = await fetch(apiEndpoint, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.createEmptyCart;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error;
  }
};

export const addSimpleProductToCart = async (cartId, sku) => {
  const apiEndpoint = getConfigValue("commerce-core-endpoint");

  const query = `
    mutation ($cartId: String!, $cartItems: [SimpleProductCartItemInput]!) {
    addSimpleProductsToCart(input: { cart_id: $cartId, cart_items: $cartItems }) {
        cart {
            id
            cart_error
            total_quantity
            total_quantity_offered

            items {
                id

                prices {
                    price {
                        value
                    }
                    row_total_including_tax {
                        value
                    }
                    row_total_final_price {
                        value
                    }
                    price_incl_tax {
                        value
                    }
                    discounts {
                        amount {
                            value
                        }
                        label
                        percent
                        qty
                        category
                    }
                    subtotal_with_discount_including_tax {
                        value
                    }
                }

                quantity
                quantity_available
                retailer_flag

                product {
                    ean
                    sku
                    name
                    automatic_flags
                    manual_flags
                    front_subtitle
                    main_flag {
                        label
                        value
                    }
                    thumbnail {
                        url
                    }

                    kit_image {
                        url
                        label
                    }
                    kit_nb_options

                    digital_media_format

                    release_date
                    backorder_end_date
                    web_sellable

                    stock_item_extra {
                        min_quantity_in_cart
                        max_quantity_in_cart
                        quantity
                        qty_increments
                        availability_date
                        front_availability
                        order_delay
                        offer {
                            front_availability
                            seller_code
                            qty
                        }
                    }

                    image {
                        url
                    }

                    url_key

                    price_range {
                        minimum_price {
                            regular_price {
                                value
                                currency
                            }
                            discount {
                                amount_off
                                percent_off
                            }
                        }
                    }

                    special_price

                    categories {
                        name
                    }

                    is_subscription
                    type_id
                    ebookType
                }

                unit_promise {
                    early_promise
                    late_promise
                    partial
                }
            }

            is_gift
            qty_offered

            shipping_addresses {
                address_name
            }

            billing_address {
                address_name
            }

            valorisation {
                errorMessage
            }

            next_availability_promise {
                early_promise
                late_promise
            }
        }
    }
}
  `;

  const variables = {
    cartItems: [{ data: { quantity: 1, sku } }],
    cartId,
  };

  try {
    const response = await fetch(apiEndpoint, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.addSimpleProductsToCart;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error;
  }
};
