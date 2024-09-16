import {
    createSelector,
    createSlice,
    PayloadAction,
  } from "@reduxjs/toolkit";
  import { CartItem, Product } from "../../interfaces";
  import { RootState } from "../store";
  
  export interface CartState {
    cartItems: CartItem[];
  }
  const initialState: CartState = {
    cartItems: [],
  };
  
  export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
      increment: (state, action: PayloadAction<Product>) => {
        const cartItem = state.cartItems.find(
          (el) => el.product.pid === action.payload.pid
        );
        if (cartItem) cartItem.qty++;
        else {
          state.cartItems.push({
            product: action.payload,
            qty: 1,
          });
        }
      },
  
      decrement: (state, action: PayloadAction<Product>) => {
        const cartItem = state.cartItems.find(
          (el) => el.product.pid === action.payload.pid
        );
        if (cartItem) {
          cartItem.qty--;
          if (cartItem.qty === 0) {
            state.cartItems = state.cartItems.filter(
              (el) => el.product.pid !== action.payload.pid
            );
          }
        }
      },
    },
  });
  
  const cartItems = (state: RootState) =>
    state.cart.cartItems;
  
  export const productQtyInCartSelector = createSelector(
    [cartItems, (cartItems, productId: string) => productId],
    (cartItems, productId) =>
      cartItems.find((el) => el.product.pid === productId)?.qty
  );
  
  export const totalCartItemsSelector = createSelector(
    [cartItems],
    (cartItems) =>
      cartItems.reduce(
        (total: number, curr: CartItem) =>
          (total += curr.qty),
        0
      )
  );
  export const TotalPriceSelector = createSelector(
    [cartItems],
    (cartItems) =>
      cartItems.reduce(
        (total: number, curr: CartItem) =>
          (total += curr.qty * curr.product.discounted_price),
        0
      )
  );
  
  export const { increment, decrement } = cartSlice.actions;
  
  export default cartSlice.reducer;