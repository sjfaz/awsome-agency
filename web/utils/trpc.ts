// utils/trpc.ts
import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from "../../services/functions/tRPC";

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}
