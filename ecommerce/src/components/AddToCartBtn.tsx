import { Product } from "../../interfaces";
import React from "react";
import {
  decrement,
  increment,
  productQtyInCartSelector,
} from "../../store/features/cartSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import QtyBtn from "./QtyBtn";

interface Props {
  product: Product;
}

const AddToCartBtn = (props: Props) => {
  const qty = useAppSelector((state) =>
    props.product ? productQtyInCartSelector(state, props.product.pid) : 0
  );
  const dispatch = useAppDispatch();
  
  if (!qty)
    return (
      <div className="flex justify-center">
        <button className="bg-yellow-400 p-4 rounded-2xl" onClick={() => dispatch(increment(props.product))}>
          Add To Cart
        </button>
      </div>
    );
  return (
    <QtyBtn
      onDecrease={() => dispatch(decrement(props.product))}
      onIncrease={() => dispatch(increment(props.product))}
      qty={qty}
    />
  );
};

export default AddToCartBtn;
