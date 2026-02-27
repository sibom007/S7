import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

export const LeftTokens = () => {
  const balance = useQuery(api.auth.getBalanceTokenFromClient);
  const creditsLeft = balance?.credit ?? 0;
  const isLoading = balance === undefined;

  return (
    <div className="bg-accent/40 px-10 py-0.5 rounded-2xl mt-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          Credits Left
        </p>

        <div className=" ">
          <span className="text-sm font-semibold text-primary">
            {isLoading ? "..." : creditsLeft}
          </span>
        </div>
      </div>
    </div>
  );
};
