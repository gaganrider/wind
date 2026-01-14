import { TextareaHTMLAttributes, forwardRef } from 'react';

type TextareaVariant = 'default' | 'error';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  label?: string;
  error?: string;
  helperText?: string;
}

const variantStyles: Record<TextareaVariant, string> = {
  default:
    'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  error: 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent',
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
      label,
      error,
      helperText,
      className = '',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const actualVariant = error ? 'error' : variant;

    const baseStyles =
      'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-y';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`${baseStyles} ${variantStyles[actualVariant]} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps, TextareaVariant };
