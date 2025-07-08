import { addSimpleProductToCart, createEmptyCart } from "./cartActions.js";

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
