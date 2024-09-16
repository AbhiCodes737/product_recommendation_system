import React from "react";
interface Props {
  onIncrease: () => void;
  onDecrease: () => void;
  qty: number;
}
const QtyBtn = (props: Props) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      <button
        className="w-6 h-8 border border-gray-600 rounded-md bg-red-400"
        onClick={props.onDecrease}
      >
        -
      </button>
      <p className="m-2">{props.qty}</p>
      <button
        className="w-6 h-8 border border-gray-600 rounded-md bg-green-400"
        onClick={props.onIncrease}
      >
        +
      </button>
    </div>
  );
};

export default QtyBtn;