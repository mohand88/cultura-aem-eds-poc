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

export const getCart = async (cartId) => {
  const apiEndpoint = getConfigValue("commerce-core-endpoint");

  const query = `query getCartDetails($cartId: String!) {
    cart(cart_id: $cartId) {
        id
        cart_error

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
            quantity_available_lad
            quantity_available_magasin
            retailer_flag

            product {
                ean
                sku
                name
                automatic_flags
                manual_flags
                front_subtitle
                main_category_id
                main_flag {
                    label
                    value
                }
                gsm_salesrule_ids {
                    gsm_salesrule_id
                    gsm_salesrule_title
                    gsm_salesrule_begin_date
                    gsm_salesrule_end_date
                    gsm_salesrule_banner_title
                    gsm_salesrule_description
                    gsm_salesrule_picto
                    gsm_salesrule_url
                    gsm_salesrule_offer
                }
                thumbnail {
                    url
                }

                kit_image {
                    url
                    label
                }
                kit_nb_options
                ... on BundleProduct {
                    items {
                        option_id
                        options {
                            label
                            quantity
                            can_change_quantity
                            price
                            product {
                                name
                                url_key
                                rating
                                sku
                                ean
                                erp_product_code
                                stock_status
                                image {
                                    url
                                    label
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
                                        discount {
                                            amount_off
                                            percent_off
                                        }
                                        final_price_excl_tax {
                                            value
                                            currency
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

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
                    offer_count
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
                    parent_id
                    id
                    level
                }

                price {
                    regularPrice {
                        amount {
                            value
                        }
                    }
                }

                is_subscription
                type_id
                ebookType
            }

            unit_promise_lad {
                early_promise
                late_promise
                partial
            }

            unit_promise_magasin {
                early_promise
                late_promise
                partial
            }

            activation_product {
                ebook {
                    error
                    availableQuantity
                }
            }

            session_data {
                course_id
                session_id
                customer_phone
                child_id
                quantity
                availableQuantity
                ageCategories
                picture
                label
                type
                discipline
                academyLabel
                startDate
                endDate
                otherSessions
                maxStudent
                bookingNumber
                subscriptionPrice
                error
            }

            is_gift
            id_mo
            qty_offered

            mp_info {
                shop_id
                shop_name
                state_code
                offer_id
                quantity
            }
        }

        mp_info {
            orders {
                shop_id
                shop_name
                offers {
                    id
                    price
                    quantity
                }
            }
        }

        gifts {
            id_mo
            number_of_choices
            is_selected
        }

        prices {
            subtotal_including_tax {
                value
            }
            subtotal_excluding_tax {
                value
            }
            grand_total {
                value
            }
            total_deee {
                value
            }
            remaining_amount_to_pay {
                value
            }
            discounts {
                idDiscount
                label
                amount {
                    value
                }
                category
                percent
            }
            subtotal_with_discount_including_tax {
                value
            }
            regularPrice {
                amount {
                    value
                }
            }
        }

        total_by_type {
            simple {
                price
                quantity
            }
            gift {
                price
                quantity
            }
            virtual {
                price
                quantity
            }
            course {
                price
                quantity
            }
            subscription {
                price
                quantity
            }
        }

        applied_coupons {
            code
        }

        shipping_addresses {
            address_type
            mirakl_shop_name
            mirakl_offers_id
            customer_address_id
            address_name
            city
            company
            country {
                code
            }
            firstname
            lastname
            postcode
            region {
                code
            }
            street
            telephone
            pickup_name
            pickup_identifier
            pickup_type
            pickup_on_behalf
            selected_shipping_method {
                carrier_code
                method_code
                method_title
                amount {
                    value
                }
                promise {
                    early_promise
                    late_promise
                }
            }
        }

        billing_address {
            address_name
            customer_address_id
            city
            company
            country {
                code
            }
            firstname
            lastname
            postcode
            region {
                code
            }
            street
            telephone
        }

        selected_payment_methods {
            code
            additional_data
            payment_id
            partial_amount
        }

        total_quantity
        total_quantity_offered

        cart_api {
            error_message
        }

    }
}`;

  try {
    const variables = { cartId };

    const response = await fetch(apiEndpoint, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.cart;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error;
  }
};
