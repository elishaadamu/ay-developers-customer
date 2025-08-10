import { Button } from "./button";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={loading || disabled} className={cn(className)} {...props}>
      {loading && <Spinner size="sm" className="mr-2" />}
      {loading ? loadingText || children : children}
    </Button>
  );
}
