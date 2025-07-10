/* eslint-disable import/no-unresolved */
/* eslint-disable padding-line-between-statements */

import { h, render } from "https://esm.sh/preact";

import * as pdpApi from "@dropins/storefront-pdp/api.js";
import { render as pdpRendered } from "@dropins/storefront-pdp/render.js";
import {
  Button,
  Icon,
  InLineAlert,
  provider as UI,
} from "@dropins/tools/components.js";
import { events } from "@dropins/tools/event-bus.js";

// Containers
import ProductAttributes from "@dropins/storefront-pdp/containers/ProductAttributes.js";
import ProductDescription from "@dropins/storefront-pdp/containers/ProductDescription.js";
import ProductGallery from "@dropins/storefront-pdp/containers/ProductGallery.js";
import ProductHeader from "@dropins/storefront-pdp/containers/ProductHeader.js";
import ProductOptions from "@dropins/storefront-pdp/containers/ProductOptions.js";
import ProductPrice from "@dropins/storefront-pdp/containers/ProductPrice.js";
import ProductQuantity from "@dropins/storefront-pdp/containers/ProductQuantity.js";
import ProductShortDescription from "@dropins/storefront-pdp/containers/ProductShortDescription.js";

// Libs
import { fetchPlaceholders } from "../../scripts/commerce.js";

// Initializers
import { addProductToCart } from "../../libs/cultura/cart/cartServices.js";
import "../../scripts/initializers/cart.js";
import { IMAGES_SIZES } from "../../scripts/initializers/pdp.js";
import { ProductStock } from "./components/productStock.js";

export default async function decorate(block) {
  // eslint-disable-next-line no-underscore-dangle

  const product = events._lastEvent?.["pdp/data"]?.payload ?? null;

  const labels = await fetchPlaceholders();

  // Layout
  const fragment = document.createRange().createContextualFragment(`
    <div class="product-details__wrapper">
      <div class="product-details__alert"></div>
      <div class="product-details__left-column">
        <div class="product-details__gallery"></div>
      </div>
      <div class="product-details__right-column">
        <div class="product-details__header"></div>
        <div class="product-details__price"></div>
        <div class="product-details__gallery"></div>
        <div class="product-details__short-description"></div>

        <div class="product-details__stock"></div>

        <div class="product-details__configuration">
          <div class="product-details__options"></div>
          <div class="product-details__quantity"></div>
          <div class="product-details__buttons">
            <div class="product-details__buttons__add-to-cart"></div>
            <div class="product-details__buttons__add-to-wishlist"></div>
          </div>
        </div>
        <div class="product-details__description"></div>
        <div class="product-details__attributes"></div>
      </div>
    </div>
  `);

  const $alert = fragment.querySelector(".product-details__alert");
  const $gallery = fragment.querySelector(".product-details__gallery");
  const $header = fragment.querySelector(".product-details__header");
  const $price = fragment.querySelector(".product-details__price");
  const $galleryMobile = fragment.querySelector(
    ".product-details__right-column .product-details__gallery"
  );
  const $shortDescription = fragment.querySelector(
    ".product-details__short-description"
  );
  const $stock = fragment.querySelector(".product-details__stock");
  const $options = fragment.querySelector(".product-details__options");
  const $quantity = fragment.querySelector(".product-details__quantity");
  const $addToCart = fragment.querySelector(
    ".product-details__buttons__add-to-cart"
  );
  const $addToWishlist = fragment.querySelector(
    ".product-details__buttons__add-to-wishlist"
  );
  const $description = fragment.querySelector(".product-details__description");
  const $attributes = fragment.querySelector(".product-details__attributes");

  block.appendChild(fragment);

  // Alert
  let inlineAlert = null;

  // Render Containers
  const [
    _galleryMobile,
    _gallery,
    _header,
    _price,
    _shortDescription,
    _options,
    _quantity,
    addToCart,
    addToWishlist,
    _description,
    _attributes,
  ] = await Promise.all([
    // Gallery (Mobile)
    pdpRendered.render(ProductGallery, {
      controls: "dots",
      arrows: true,
      peak: false,
      gap: "small",
      loop: false,
      imageParams: {
        ...IMAGES_SIZES,
      },
    })($galleryMobile),

    // Gallery (Desktop)
    pdpRendered.render(ProductGallery, {
      controls: "thumbnailsColumn",
      arrows: true,
      peak: true,
      gap: "small",
      loop: false,
      imageParams: {
        ...IMAGES_SIZES,
      },
    })($gallery),

    // Header
    pdpRendered.render(ProductHeader, {})($header),

    // Price
    pdpRendered.render(ProductPrice, {})($price),

    // Short Description
    pdpRendered.render(ProductShortDescription, {})($shortDescription),

    // Product Stock
    render(h(ProductStock, { product }), $stock),

    // Configuration - Swatches
    pdpRendered.render(ProductOptions, { hideSelectedValue: false })($options),

    // Configuration  Quantity
    pdpRendered.render(ProductQuantity, {})($quantity),

    // Configuration – Button - Add to Cart
    UI.render(Button, {
      children: labels.PDP?.Product?.AddToCart?.label,
      icon: Icon({ source: "Cart" }),
      onClick: async () => {
        try {
          addToCart.setProps((prev) => ({
            ...prev,
            children: labels.Custom?.AddingToCart?.label,
            disabled: true,
          }));

          const cart = await addProductToCart(product.sku);
          console.log("cart", cart);

          inlineAlert = await UI.render(InLineAlert, {
            heading: "success",
            description: "Product added to cart",
            icon: Icon({ source: "Check" }),
            "aria-live": "assertive",
            role: "alert",
            onDismiss: () => {
              inlineAlert.remove();
            },
          })($alert);

          // Scroll the alertWrapper into view
          $alert.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } catch (error) {
          // add alert message
          inlineAlert = await UI.render(InLineAlert, {
            heading: "Error",
            description: error.message,
            icon: Icon({ source: "Warning" }),
            "aria-live": "assertive",
            role: "alert",
            onDismiss: () => {
              inlineAlert.remove();
            },
          })($alert);

          // Scroll the alertWrapper into view
          $alert.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } finally {
          addToCart.setProps((prev) => ({
            ...prev,
            children: labels.PDP?.Product?.AddToCart?.label,
            disabled: false,
          }));
        }
      },
    })($addToCart),

    // Configuration - Add to Wishlist
    UI.render(Button, {
      icon: Icon({ source: "Heart" }),
      variant: "secondary",
      "aria-label": labels.Custom?.AddToWishlist?.label,
      onClick: async () => {
        try {
          addToWishlist.setProps((prev) => ({
            ...prev,
            disabled: true,
            "aria-label": labels.Custom?.AddingToWishlist?.label,
          }));

          const values = pdpApi.getProductConfigurationValues();

          if (values?.sku) {
            const wishlist = await import("../../scripts/wishlist/api.js");
            await wishlist.addToWishlist(values.sku);
          }
        } catch (error) {
          console.error(error);
        } finally {
          addToWishlist.setProps((prev) => ({
            ...prev,
            disabled: false,
            "aria-label": labels.Custom?.AddToWishlist?.label,
          }));
        }
      },
    })($addToWishlist),

    // Description
    pdpRendered.render(ProductDescription, {})($description),

    // Attributes
    pdpRendered.render(ProductAttributes, {})($attributes),
  ]);

  // Lifecycle Events
  events.on(
    "pdp/valid",
    (valid) => {
      // update add to cart button disabled state based on product selection validity
      addToCart.setProps((prev) => ({ ...prev, disabled: !valid }));
    },
    { eager: true }
  );

  // Set JSON-LD and Meta Tags
  events.on(
    "aem/lcp",
    () => {
      if (product) {
        setMetaTags(product);
        document.title = product.name;
      }
    },
    { eager: true }
  );

  return Promise.resolve();
}

function createMetaTag(property, content, type) {
  if (!property || !type) {
    return;
  }
  let meta = document.head.querySelector(`meta[${type}="${property}"]`);
  if (meta) {
    if (!content) {
      meta.remove();
      return;
    }
    meta.setAttribute(type, property);
    meta.setAttribute("content", content);
    return;
  }
  if (!content) {
    return;
  }
  meta = document.createElement("meta");
  meta.setAttribute(type, property);
  meta.setAttribute("content", content);
  document.head.appendChild(meta);
}

function setMetaTags(product) {
  if (!product) {
    return;
  }

  const price =
    product.prices.final.minimumAmount ?? product.prices.final.amount;

  createMetaTag("title", product.metaTitle || product.name, "name");
  createMetaTag("description", product.metaDescription, "name");
  createMetaTag("keywords", product.metaKeyword, "name");

  createMetaTag("og:type", "product", "property");
  createMetaTag("og:description", product.shortDescription, "property");
  createMetaTag("og:title", product.metaTitle || product.name, "property");
  createMetaTag("og:url", window.location.href, "property");
  const mainImage = product?.images?.filter((image) =>
    image.roles.includes("thumbnail")
  )[0];
  const metaImage = mainImage?.url || product?.images[0]?.url;
  createMetaTag("og:image", metaImage, "property");
  createMetaTag("og:image:secure_url", metaImage, "property");
  createMetaTag("product:price:amount", price.value, "property");
  createMetaTag("product:price:currency", price.currency, "property");
}
