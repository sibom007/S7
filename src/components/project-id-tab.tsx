import { cn } from "@/lib/utils";

export const Tab = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 h-full cursor-pointer px-3 text-muted-foreground border-r hover:bg-accent/30",
        isActive && "bg-background text-foreground",
      )}>
      <span className="text-sm">{label}</span>
    </div>
  );
};
