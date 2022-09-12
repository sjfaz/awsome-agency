import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "../utils/trpc";
import "./style/App.css";

function Main() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    // const token = localStorage.getItem("token");
    return trpc.createClient({
      url: "https://fvtz7ntv6a.execute-api.eu-west-1.amazonaws.com/beta",
    });
  });

  console.log("rendering...");

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

let container: HTMLElement;

document.addEventListener("DOMContentLoaded", () => {
  if (!container) {
    container = document.getElementById("root") as HTMLElement;
    createRoot(container).render(
      <React.StrictMode>
        <Main />
      </React.StrictMode>
    );
  }
});
