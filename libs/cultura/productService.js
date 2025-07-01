import { getParsedProduct } from "./productUtils.js";

export const fetchProductDataCultura = async (urlKey) => {
  // const endpoint = "https://www.cultura.com/magento/graphql";
  // const endpoint = "https://e75f-130-41-134-133.ngrok-free.app/proxy/graphql";
  const endpoint = "http://localhost:4000/proxy/graphql";

  const query = `
    query GET_PRODUCT_DATA_CULTURA($urlKey: String!) {
      products(resolverLight: 1, filter: {url_key: {eq: $urlKey}}) {
        items {
      id
      sku
      name
      data_source
      option_text_data_source
      kit_nb_options
      kit_image {
        url
        label
      }
      hexadecimal_color {
        label
        value
      }
      categories {
        name
        parent_id
        id
        level
      }
      status
      is_disabled
      is_subscription
      release_date
      web_sellable
      stock_item_extra {
        front_availability
        availability_date
        order_delay
        max_quantity_in_cart
        min_quantity_in_cart
        qty_increments
        offer {
          front_availability
          seller_code
          qty
        }
      }
      main_category_id
      type_id
      ebookType
      cross_format_label
      ean
      erp_product_code
      rating
      nb_reviews
      mp_info {
        offers {
          offer_id
          product_sku
          quantity
          shop {
            name
            id
            url_key
            grade
            evaluations_count
          }
          ranking
          price
          total_price
          origin_price
          state_code
          ecotax
        }
        total_new
        total_used
        lowest_price_new {
          value
        }
        lowest_price_used {
          value
        }
        second_lowest_price_new {
          value
        }
        second_lowest_price_used {
          value
        }
      }
      cultura_review {
        review_id
      }
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
      description {
        html
      }
      image {
        label
        url
      }
      small_image {
        url
      }
      thumbnail {
        label
        url
      }
      brand {
        image_1
        entity_id
        label
        catchphrase
      }
      author {
        label
        entity_id
      }
      series_saga {
        label
        entity_id
      }
      main_artist {
        label
        entity_id
      }
      license {
        label
        entity_id
      }
      url_key
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
      oney_prices {
        facilypay_3x
        facilypay_4x
        facilypay_10x
      }
      media_gallery {
        disabled
        url
        label
        position
        media_type
      }
      document_gallery {
        url
        type
      }
      security_form_media_gallery {
        url
        type
      }
      game_rules
      game_rule_media_gallery {
        url
        type
      }
      book_leafing_media
      cnet_key_selling_points
      cnet_description
      meta_title
      meta_description
      front_subtitle
      deee
      deee_dds
      deee_furniture
      pdp_subtitle {
        prefix
        label
        suffix
        entity_id
      }
      automatic_flags
      manual_flags
      promote_1
      promote_2
      promote_3
      press_review {
        date
      }
      tracklist {
        disk
      }
      ... on GroupedProduct {
        items {
          product {
            id
            sku
            erp_product_code
            is_subscription
            name
            ean
            audience
            free
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
              }
            }
            special_price
          }
        }
      }
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
              stock_status
              ean
              erp_product_code
              nb_reviews
              front_subtitle
              categories {
                name
              }
              image {
                url
                label
              }
              hexadecimal_color {
                label
                value
              }
              stock_item_extra {
                front_availability
                availability_date
                order_delay
                max_quantity_in_cart
                min_quantity_in_cart
                qty_increments
                offer {
                  front_availability
                  seller_code
                  qty
                }
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
    }
      }
    }
  `;

  try {
    const variables = JSON.stringify({ urlKey });
    const params = new URLSearchParams({ query, variables });

    const response = await fetch(`${endpoint}?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
