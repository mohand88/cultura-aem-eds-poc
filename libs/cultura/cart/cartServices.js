import {
  addSimpleProductToCart,
  createEmptyCart,
  getCart,
  removeItemFromCart,
  updateCartItemQuantity,
} from "./cartActions.js";
import { parseToAEMCart } from "./cartUtils.js";

export const getCartId = async () => {
  // check if cartId is in local storage
  const cartId = localStorage.getItem("cartId");
  if (cartId) {
    return cartId;
  }

  // if not, create a new cart
  const newCartId = await createEmptyCart();

  // save the cartId in local storage
  localStorage.setItem("cartId", newCartId);

  return newCartId;
};

export const addProductToCart = async (sku) => {
  const cartId = await getCartId();

  const { cart } = await addSimpleProductToCart(cartId, sku);

  return cart;
};

export const getCartDetails = async () => {
  const cartId = await getCartId();

  const cart = await getCart(cartId);

  return parseToAEMCart(cart);
};

export const setCartItemQuantity = async (itemId, quantity) => {
  const cartId = await getCartId();

  const { cart } = await updateCartItemQuantity(cartId, itemId, quantity);

  return parseToAEMCart(cart);
};

export const removeCartItem = async (itemId) => {
  const cartId = await getCartId();

  const { cart } = await removeItemFromCart(cartId, itemId);

  return parseToAEMCart(cart);
};
