import * as Cart from "@dropins/storefront-cart/api.js";
import { events } from "@dropins/tools/event-bus.js";
import {
  removeCartItem,
  setCartItemQuantity,
} from "../../libs/cultura/cart/cartServices.js";

export default class CustomCartSummaryList {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      routeProduct: null,
      ...options,
    };

    // Récupérer les données initiales du panier
    this.cart = Cart.getCartDataFromCache();

    this.init();
  }

  async init() {
    // Écouter les changements du panier
    events.on(
      "cart/data",
      (cartData) => {
        this.cart = cartData;
        this.render();
      },
      { eager: true }
    );

    this.render();
  }

  render() {
    if (!this.cart || this.cart.items.length === 0) {
      this.renderEmptyCart();
      return;
    }

    this.container.innerHTML = this.generateHTML();
    this.attachEventListeners();
  }

  generateHTML() {
    const { items } = this.cart;

    const heading = `
      <div class="cart-cart-summary-list__heading">
        <div class="cart-cart-summary-list__heading-text">
          <div data-testid="default-cart-heading">Shopping Cart (${this.cart.totalQuantity})</div>
        </div>
        <hr
          role="separator"
          class="dropin-divider dropin-divider--primary cart-cart-summary-list__heading-divider"
        />
      </div>
    `;

    const itemsHTML = items.map((item) => this.generateItemHTML(item)).join("");

    return `
      <div class="cart__list dropin-design">
        <div class="cart-cart-summary-list cart-cart-summary-list__background--primary">
          ${heading}
          <div class="cart-cart-summary-list__content">
            <div data-testid="cart-list" class="dropin-cart-list">
              <div
                aria-live="assertive"
                aria-relevant="all"
                class="dropin-cart-list__wrapper"
              >
                ${itemsHTML}
              </div>
            </div>
          </div>
          <hr
            role="separator"
            class="dropin-divider dropin-divider--primary cart-cart-summary-list__footer-divider"
          />
          <div
            data-testid="cart-cart-summary-footer-slot"
            data-slot="Footer"
            class="cart-cart-summary-list__footer-text"
          >
            <div data-testid="cart-cart-summary-footer"></div>
          </div>
        </div>
      </div>
    `;
  }

  generateItemHTML(item) {
    const productLink = this.options.routeProduct
      ? this.options.routeProduct(item)
      : `#`;

    const imageHTML = `
      <div data-slot="Thumbnail" class="dropin-cart-item__image">
        <a href="${productLink}">
          <img
            data-testid="cart-list-item-image"
            alt="${item.name}"
            width="300"
            height="300"
            loading="eager"
            src="${item.image?.src || ""}"
            class="dropin-image dropin-image--loaded"
          />
        </a>
      </div>
    `;

    const nameHTML = `
      <span
        data-testid="cart-list-item-title"
        class="dropin-cart-item__title dropin-cart-item__title--edit"
      >
        <a href="${productLink}">${item.name}</a>
      </span>
    `;

    const skuHTML = `
      <span
        data-testid="cart-list-item-sku"
        class="dropin-cart-item__sku"
      >${item.sku}</span>
    `;

    const priceHTML = `
      <span
        aria-label="price per item"
        class="dropin-cart-item__price"
      >
        <span
          data-testid="regular-item-price"
          role="text"
          class="dropin-price dropin-price--default dropin-price--small dropin-price--bold"
          style="font: inherit"
        >${this.formatPrice(item.price)}</span>
      </span>
    `;

    const quantityHTML = `
      <div class="dropin-cart-item__quantity dropin-cart-item__quantity--edit">
        ${this.generateQuantityHTML(item)}
      </div>
    `;

    const totalHTML = `
      <div class="dropin-cart-item__total dropin-cart-item__total--edit">
        <div class="dropin-cart-item__row-total__wrapper">
          <div class="dropin-cart-item__row-total">
            <span
              aria-label="Regular Price"
              data-testid="regular-item-total"
              class="dropin-price dropin-price--default dropin-price--small dropin-price--bold"
            >${this.formatPrice(item.total)}</span>
          </div>
        </div>
      </div>
    `;

    const removeButtonHTML = `
      <button
        role="button"
        data-testid="cart-item-remove-button"
        class="dropin-iconButton dropin-iconButton--medium dropin-iconButton--tertiary dropin-cart-item__remove"
        data-uid="${item.uid}"
        aria-label="Remove item from the cart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          data-testid="cart-item-remove-icon"
          aria-label="Remove item from the cart"
          class="dropin-icon dropin-icon--shape-stroke-2 dropin-button-icon dropin-button-icon--tertiary"
        >
          <path
            d="M1 5H23"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
          ></path>
          <path
            d="M17.3674 22H6.63446C5.67952 22 4.88992 21.2688 4.8379 20.3338L4 5H20L19.1621 20.3338C19.1119 21.2688 18.3223 22 17.3655 22H17.3674Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
          ></path>
          <path
            d="M9.87189 2H14.1281C14.6085 2 15 2.39766 15 2.88889V5H9V2.88889C9 2.39912 9.39006 2 9.87189 2Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
          ></path>
          <path
            d="M8.87402 8.58057L9.39348 17.682"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
          ></path>
          <path
            d="M14.6673 8.58057L14.146 17.682"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-miterlimit="10"
          ></path>
        </svg>
      </button>
    `;

    return `
      <div class="dropin-cart-list__item">
        <div
          data-testid="cart-list-item-entry-${item.uid}"
          class="dropin-cart-item"
        >
          <div class="dropin-cart-item__wrapper">
            ${imageHTML}
            ${nameHTML}
            ${skuHTML}
            <div class="dropin-cart-item__savings__wrapper"></div>
            <div class="dropin-cart-item__attributes">
              <div data-slot="ProductAttributes"></div>
            </div>
            ${priceHTML}
            ${quantityHTML}
            ${totalHTML}
            <div class="dropin-cart-item__footer">
              <div data-slot="Footer">
                <div data-slot-html-element="div">
                  <div class="dropin-design"><div></div></div>
                </div>
              </div>
            </div>
          </div>
          ${removeButtonHTML}
        </div>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  generateQuantityHTML(item) {
    return `
      <div class="dropin-incrementer dropin-incrementer--medium dropin-cart-item__quantity__incrementer">
        <div class="dropin-incrementer__content dropin-incrementer__content--medium">
          <div class="dropin-incrementer__button-container">
            <button
              type="button"
              ${item.quantity <= 1 ? "disabled" : ""}
              aria-label="Decrease Quantity"
              class="dropin-incrementer__decrease-button"
              data-uid="${item.uid}"
            >
              <svg
                width="16"
                height="16"
                viewBox="4 2 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="dropin-icon dropin-icon--shape-stroke-1 dropin-incrementer__down"
              >
                <path
                  d="M17.3332 11.75H6.6665"
                  stroke-width="1.5"
                  stroke-linecap="square"
                  stroke-linejoin="round"
                  vector-effect="non-scaling-stroke"
                  fill="none"
                  stroke="currentColor"
                ></path>
              </svg>
            </button>
          </div>
          <input
            min="1"
            step="1"
            type="number"
            name="quantity"
            aria-label="Quantity"
            class="dropin-incrementer__input"
            value="${item.quantity}"
            data-uid="${item.uid}"
          />
          <div class="dropin-incrementer__button-container">
            <button
              type="button"
              aria-label="Increase Quantity"
              class="dropin-incrementer__increase-button"
              data-uid="${item.uid}"
            >
              <svg
                id="Icon_Add_Base"
                data-name="Icon – Add – Base"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="4 2 20 20"
                class="dropin-icon dropin-icon--shape-stroke-1 dropin-incrementer__add"
              >
                <g id="Large">
                  <rect
                    id="Placement_area"
                    data-name="Placement area"
                    width="24"
                    height="24"
                    fill="#fff"
                    opacity="0"
                  ></rect>
                  <g
                    id="Add_icon"
                    data-name="Add icon"
                    transform="translate(9.734 9.737)"
                  >
                    <line
                      vector-effect="non-scaling-stroke"
                      id="Line_579"
                      data-name="Line 579"
                      y2="12.7"
                      transform="translate(2.216 -4.087)"
                      fill="none"
                      stroke="currentColor"
                    ></line>
                    <line
                      vector-effect="non-scaling-stroke"
                      id="Line_580"
                      data-name="Line 580"
                      x2="12.7"
                      transform="translate(-4.079 2.263)"
                      fill="none"
                      stroke="currentColor"
                    ></line>
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  formatPrice(price) {
    if (!price) return "";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: price.currency || "EUR",
    }).format(price.value);
  }

  renderEmptyCart() {
    this.container.innerHTML = `
      <div class="cart__list dropin-design">
        <div class="cart-cart-summary-list cart-cart-summary-list__background--primary">
          <div class="cart-cart-summary-list__heading">
            <div class="cart-cart-summary-list__heading-text">
              <div data-testid="default-cart-heading">Shopping Cart (0)</div>
            </div>
            <hr
              role="separator"
              class="dropin-divider dropin-divider--primary cart-cart-summary-list__heading-divider"
            />
          </div>
          <div class="cart-cart-summary-list__content">
            <div class="dropin-cart-list">
              <div class="dropin-cart-list__wrapper">
                <div class="dropin-cart-list__item">
                  <div class="dropin-cart-item">
                    <div class="dropin-cart-item__wrapper">
                      <div class="dropin-cart-item__title">
                        <span>Your cart is empty</span>
                      </div>
                      <div class="dropin-cart-item__footer">
                        <a href="#" class="dropin-button dropin-button--primary">
                          Start Shopping
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    // Gestion des boutons de suppression
    this.container
      .querySelectorAll(".dropin-cart-item__remove")
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const { uid } = button.dataset;
          this.removeItem(uid);
        });
      });

    // Gestion des modifications de quantité
    this.container
      .querySelectorAll(".dropin-incrementer__decrease-button")
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const { uid } = button.dataset;
          const input = this.container.querySelector(
            `input[data-uid="${uid}"]`
          );
          const currentQuantity = parseInt(input.value, 10);
          if (currentQuantity > 1) {
            this.updateItemQuantity(uid, currentQuantity - 1);
          }
        });
      });

    this.container
      .querySelectorAll(".dropin-incrementer__increase-button")
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();

          const { uid } = button.dataset;
          const input = this.container.querySelector(
            `input[data-uid="${uid}"]`
          );
          const currentQuantity = parseInt(input.value, 10);
          this.updateItemQuantity(uid, currentQuantity + 1);
        });
      });

    this.container
      .querySelectorAll(".dropin-incrementer__input")
      .forEach((input) => {
        input.addEventListener("change", (e) => {
          const { uid } = e.target.dataset;
          const newQuantity = parseInt(e.target.value, 10);
          if (newQuantity > 0) {
            this.updateItemQuantity(uid, newQuantity);
          }
        });
      });
  }

  // eslint-disable-next-line class-methods-use-this
  async updateItemQuantity(uid, quantity) {
    try {
      // Appel API personnalisé pour mettre à jour la quantité
      const updatedCart = await setCartItemQuantity(uid, quantity);

      if (updatedCart) {
        // Émettre l'événement personnalisé
        // events.emit("cart/updateItem", {
        //   item: updatedCart.items.find((cartItem) => cartItem.uid === uid),
        //   quantity,
        //   success: true,
        // });
        // Mettre à jour l'affichage
        // this.render();

        events.emit("cart/data", updatedCart);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité:", error);
      events.emit("cart/error", {
        message: "Erreur lors de la mise à jour de la quantité",
        error,
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async removeItem(uid) {
    try {
      // Appel API personnalisé pour supprimer l'article
      const updatedCart = await removeCartItem(uid);

      if (updatedCart) {
        // Émettre l'événement personnalisé
        // events.emit("cart/removeItem", {
        //   item: removedItem,
        //   success: true,
        // });

        // Mettre à jour l'affichage
        // this.render();

        events.emit("cart/data", updatedCart);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
      events.emit("cart/error", {
        message: "Erreur lors de la suppression de l'article",
        error,
      });
    }
  }
}
