import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  overlay?: boolean;
  className?: string;
}

export function Loading({
  size = "md",
  text,
  overlay = false,
  className,
}: LoadingProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6",
        overlay && "absolute inset-0 bg-background/80 backdrop-blur-sm z-50",
        className
      )}
    >
      <Spinner size={size} />
      {text && (
        <p className="text-muted-foreground text-sm animate-pulse">{text}</p>
      )}
    </div>
  );

  if (overlay) {
    return content;
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      {content}
    </div>
  );
}
