// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { useState } from "react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { trpc } from "../utils/trpc";
// import "./index.css";

// export function MainApp() {
//   const [queryClient] = useState(() => new QueryClient());
//   const [trpcClient] = useState(() =>
//     trpc.createClient({
//       url: "http://localhost:5000/trpc",

//       // optional
//       // headers() {
//       //   return {
//       //     authorization: "Bearer ...",
//       //   };
//       // },
//     })
//   );
//   return (
//     <trpc.Provider client={trpcClient} queryClient={queryClient}>
//       <QueryClientProvider client={queryClient}>
//         <App />
//       </QueryClientProvider>
//     </trpc.Provider>
//   );
// }

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <MainApp />
//   </React.StrictMode>
// );

import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";
import { trpc } from "../utils/trpc";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    // const token = localStorage.getItem("token");
    return trpc.createClient({
      url: "http://127.0.0.1:3000/beta",
      // url: "https://gpt7moq413.execute-api.eu-west-1.amazonaws.com/beta",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Sample />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Sample() {
  const hello = trpc.useQuery(["getUser", "My message"]);
  const createUser = trpc.useMutation(["createUser"]);

  return (
    <div>
      <div>{hello.isLoading ? "Loading..." : hello.data?.name}</div>
      <button
        disabled={createUser.isLoading}
        onClick={() => {
          createUser.mutate({
            title: "My new todo",
          });
        }}
      >
        {createUser.isLoading ? "Creating..." : "Create"}
      </button>
      <pre>{JSON.stringify(createUser.data, null, 2)}</pre>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
