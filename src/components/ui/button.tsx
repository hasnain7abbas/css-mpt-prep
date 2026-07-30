import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold tracking-tight transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-out-expo)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-surface hover:bg-primary-dark",
        secondary:
          "bg-ink text-surface hover:bg-ink/90",
        outline:
          "border border-ink/25 bg-transparent text-ink hover:bg-ink/5",
        ghost: "text-ink-muted hover:bg-ink/5 hover:text-ink",
        danger: "bg-accent text-surface hover:bg-accent/90",
        link: "text-ink underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        default: "h-11 px-5",
        lg: "h-12 px-7 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
