/* eslint-disable no-underscore-dangle */
import { addProductsToCart } from "@dropins/storefront-cart/api.js";
import { Button, provider as UI } from "@dropins/tools/components.js";
import { readBlockConfig } from "../../scripts/aem.js";
import { getConfigValue } from "../../scripts/configs.js";

// initialize dropins
import { fetchRecommandations } from "../../libs/cultura/recommendationService.js";
import { getSkuFromUrl } from "../../scripts/commerce.js";
import "../../scripts/initializers/cart.js";
import { rootLink } from "../../scripts/scripts.js";

const isMobile = window.matchMedia(
  "only screen and (max-width: 900px)"
).matches;

let unitsPromise;

function renderPlaceholder(block) {
  block.innerHTML = `<h2></h2>
  <div class="scrollable">
    <div class="product-grid">
      ${[...Array(5)]
        .map(
          () => `
        <div class="placeholder">
          <picture><img width="300" height="375" src="" /></picture>
        </div>
      `
        )
        .join("")}
    </div>
  </div>`;
}

function renderItem(unitId, product) {
  const image = product.img_link;

  const clickHandler = () => {
    window.adobeDataLayer.push((dl) => {
      dl.push({
        event: "recs-item-click",
        eventInfo: {
          ...dl.getState(),
          unitId,
          productId: parseInt(product.externalId, 10) || 0,
        },
      });
    });
  };

  const addToCartHandler = async () => {
    // Always emit the add-to-cart event, regardless of product type.
    window.adobeDataLayer.push((dl) => {
      dl.push({
        event: "recs-item-add-to-cart",
        eventInfo: {
          ...dl.getState(),
          unitId,
          productId: parseInt(product.externalId, 10) || 0,
        },
      });
    });
    if (product.__typename === "SimpleProductView") {
      // Only add simple products directly to cart (no options selections needed)
      try {
        await addProductsToCart([
          {
            sku: product.sku,
            quantity: 1,
          },
        ]);
      } catch (error) {
        console.error("Error adding products to cart", error);
      }
    } else {
      // Navigate to page for non-simple products
      window.location.href = rootLink(
        `/products/${product.urlKey}/${product.sku}`
      );
    }
  };

  const ctaText = "Add to Cart";

  const html1 = `<div class="product-grid-item">
    <a href="${rootLink(`/products/${product.urlKey}/${product.sku}`)}">
      <picture>
        <source type="image/webp" srcset="${image}?width=300&format=webply&optimize=medium" />
        <img loading="lazy" alt="Image" width="300" height="375" src="${image}?width=300&format=jpg&optimize=medium" />
      </picture>
      <span>${product.name}</span>
      <div data-slot="Sku" class="dropin-product-item-card__sku">
        <span>${product.sku}</span>
      </div>
    <div class="dropin-product-item-card__price">
      <div data-slot="Price" class="dropin-product-item-card__price">
        <div data-testid="default-product-price">
          <span
            class="dropin-price dropin-price--default dropin-price--small dropin-price--bold"
            >${product.price}€ </span
          >
        </div>
      </div>
    </div>
    </a>
    <span class="product-grid-cta"></span>
  </div>`;

  const item = document.createRange().createContextualFragment(html1);
  item.querySelector("a").addEventListener("click", clickHandler);
  const buttonEl = item.querySelector(".product-grid-cta");
  UI.render(Button, {
    children: ctaText,
    onClick: addToCartHandler,
  })(buttonEl);
  return item;
}

function renderItems(block, recommendation) {
  recommendation.unitId = "66c8839d-4157-4c36-8e9d-e6dfdeeba581";

  // Render only first recommendation
  const { name, items } = recommendation;
  if (!recommendation) {
    // Hide block content if no recommendations are available
    block.textContent = "";
    return;
  }

  // Title
  block.querySelector("h2").textContent = name;

  // Grid
  const grid = block.querySelector(".product-grid");
  grid.innerHTML = "";

  items.forEach((product) => {
    grid.appendChild(renderItem(recommendation.unitId, product));
  });

  const inViewObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.adobeDataLayer.push((dl) => {
            dl.push({
              event: "recs-unit-view",
              eventInfo: { ...dl.getState(), unitId: recommendation.unitId },
            });
          });
        }
      });
    },
    { threshold: 0.5 }
  );
  inViewObserver.observe(block);
}

async function loadRecommendation(block, context, visibility) {
  // Only load once the recommendation becomes visible
  if (!visibility) {
    return;
  }

  // Only proceed if all required data is available
  if (
    !context.pageType ||
    (context.pageType === "Product" && !context.currentSku) ||
    (context.pageType === "Category" && !context.category) ||
    (context.pageType === "Cart" && !context.cartSkus)
  ) {
    return;
  }

  const storeViewCode = getConfigValue("headers.cs.Magento-Store-View-Code");

  if (unitsPromise) {
    return;
  }

  unitsPromise = new Promise((resolve, reject) => {
    // Get product view history
    try {
      const viewHistory =
        window.localStorage.getItem(`${storeViewCode}:productViewHistory`) ||
        "[]";
      context.userViewHistory = JSON.parse(viewHistory);
    } catch (e) {
      window.localStorage.removeItem("productViewHistory");
      console.error("Error parsing product view history", e);
    }

    // Get purchase history
    try {
      const purchaseHistory =
        window.localStorage.getItem(`${storeViewCode}:purchaseHistory`) || "[]";
      context.userPurchaseHistory = JSON.parse(purchaseHistory);
    } catch (e) {
      window.localStorage.removeItem("purchaseHistory");
      console.error("Error parsing purchase history", e);
    }

    window.adobeDataLayer.push((dl) => {
      dl.push({
        event: "recs-api-request-sent",
        eventInfo: { ...dl.getState() },
      });
    });

    const sku = getSkuFromUrl();
    const ean = sku.split("-").pop();

    fetchRecommandations(ean)
      .then(resolve)
      .catch((error) => {
        console.error("Error fetching recommendations", error);
        reject(error);
      });
  });

  const data = await unitsPromise;

  renderItems(block, data);
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const filters = {};
  if (config.typeid) {
    filters.typeId = config.typeid;
  }
  renderPlaceholder(block);

  const context = {};
  let visibility = !isMobile;

  function handleProductChanges({ productContext }) {
    context.currentSku = productContext?.sku;
    loadRecommendation(block, context, visibility, filters);
  }

  function handleCategoryChanges({ categoryContext }) {
    context.category = categoryContext?.name;
    loadRecommendation(block, context, visibility, filters);
  }

  function handlePageTypeChanges({ pageContext }) {
    context.pageType = pageContext?.pageType;
    loadRecommendation(block, context, visibility, filters);
  }

  function handleCartChanges({ shoppingCartContext }) {
    context.cartSkus =
      shoppingCartContext?.totalQuantity === 0
        ? []
        : shoppingCartContext?.items?.map(({ product }) => product.sku);
    loadRecommendation(block, context, visibility, filters);
  }

  window.adobeDataLayer.push((dl) => {
    dl.addEventListener("adobeDataLayer:change", handlePageTypeChanges, {
      path: "pageContext",
    });
    dl.addEventListener("adobeDataLayer:change", handleProductChanges, {
      path: "productContext",
    });
    dl.addEventListener("adobeDataLayer:change", handleCategoryChanges, {
      path: "categoryContext",
    });
    dl.addEventListener("adobeDataLayer:change", handleCartChanges, {
      path: "shoppingCartContext",
    });
  });

  if (isMobile) {
    const section = block.closest(".section");
    const inViewObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibility = true;
          loadRecommendation(block, context, visibility, filters);
          inViewObserver.disconnect();
        }
      });
    });
    inViewObserver.observe(section);
  }
}
