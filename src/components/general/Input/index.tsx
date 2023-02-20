import clsx from "clsx";
import { InputHTMLAttributes } from "react";

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={clsx(
        "bg-gray-100 border border-gray-300 rounded-md py-2 px-4 block w-full appearance-none leading-normal"
      )}
      {...props}
    />
  );
};
