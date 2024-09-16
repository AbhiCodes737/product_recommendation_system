"use client";
import CartItemCard from "@/components/CartItemCard";
import React from "react";
import { TotalPriceSelector } from "../../../store/features/cartSlice";
import { useAppSelector } from "../../../store/store";

const CartPage = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const totalPrice = useAppSelector(TotalPriceSelector);
  const productIds = cartItems.map((item) => item.product.pid);

  const addFBIT = async () => {
    let result = await fetch("http://localhost:3000/api/cart", {
      method: "POST",
      body: JSON.stringify({ cartItems: productIds }),
    });
    result = await result.json();
    if (result) {
      alert("Items Bought");
    }
  };

  return (
    <div className="p-2">
      <div className="flex flex-col items-center gap-1">
        {cartItems.map((item) => (
          <CartItemCard key={item.product.pid} cartItem={item} />
        ))}
      </div>

      <div className="flex justify-center m-2">
        <p className="text-slate-600">
          Total Price:{" "}
          <span className="text-slate-900 font-bold">Rs. {totalPrice}</span>
        </p>
      </div>
      <div className="flex justify-center">
        <button className="bg-green-500 py-4 px-8 rounded-lg text-white font-bold" onClick={addFBIT}>
          Buy
        </button>
      </div>
    </div>
  );
};

export default CartPage;
