import clsx from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      className={clsx(
        "bg-gray-100 border-none rounded-md py-2 px-4 block w-full",
        "focus:ring-2 ring-gray-300 outline-none"
      )}
      ref={ref}
      {...props}
    />
  );
});
