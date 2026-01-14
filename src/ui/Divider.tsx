import { HTMLAttributes, forwardRef } from 'react';

interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
}

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ text, className = '', ...props }, ref) => {
    if (text) {
      return (
        <div ref={ref} className={`relative my-6 ${className}`} {...props}>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">{text}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`border-t border-gray-300 my-6 ${className}`}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export { Divider };
export type { DividerProps };
