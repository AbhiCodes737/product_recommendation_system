import { CartItem } from "../../interfaces";
import Image from "next/image";
import React from "react";
import { decrement, increment } from "../../store/features/cartSlice";
import { useAppDispatch } from "../../store/store";
import QtyBtn from "./QtyBtn";

interface Props {
  cartItem: CartItem;
}
const CartItemCard = ({ cartItem }: Props) => {
  const dispatch = useAppDispatch();
  return (
    <div className="grid grid-cols-4 items-center py-2 border border-gray-500 rounded-md w-[80%]">
      <img
        src={cartItem.product.image[0]}
        width={200}
        height={150}
        alt={cartItem.product.product_name}
        className="rounded-md"
      />
      <p className="text-slate-800 text-center">
        {cartItem.product.product_name}
      </p>
      <div className="flex flex-col items-center justify-center gap-3">
        <p className="text-red-500 font-semibold mt-1">Rs.{cartItem.product.discounted_price}</p>
        <QtyBtn
          qty={cartItem.qty}
          onDecrease={() => dispatch(decrement(cartItem.product))}
          onIncrease={() => dispatch(increment(cartItem.product))}
        />
      </div>
      <p className="text-center">
        Rs.{cartItem.qty * cartItem.product.discounted_price}
      </p>
    </div>
  );
};

export default CartItemCard;
