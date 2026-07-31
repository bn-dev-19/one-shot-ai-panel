"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  label: string;
  loading?: boolean;
  hideLabelOnLoading?: boolean;
  disableOnLoading?: boolean;
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ label, loading, hideLabelOnLoading, disableOnLoading = true, children, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={(disableOnLoading && loading) || props.disabled} {...props}>
        {loading ? (
          <Loader2 className={hideLabelOnLoading ? "size-4 animate-spin" : "size-4 animate-spin mr-1.5"} />
        ) : (
          children
        )}
        {(!loading || !hideLabelOnLoading) && <span>{label}</span>}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
