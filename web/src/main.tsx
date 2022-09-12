import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "../utils/trpc";
import "./App.css";

function App() {
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
        <Main />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

// const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   console.log("value is:", event.target.value);
// };

interface IMyProps {
  labelName: string;
  value: string;
  onchange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<IMyProps> = (props: IMyProps) => {
  //keydown();
  return (
    <label className="input-group mb-2">
      <span>{props.labelName}</span>
      <input
        type="text"
        placeholder={props.labelName}
        className="input input-bordered"
        onChange={props.onchange}
        value={props.value}
      />
    </label>
  );
};

function Main() {
  const [inputValue, setInputValue] = useState({ email: "" });
  const getOrders = trpc.useQuery(["getOrders", "shaun@shaun.com"]);
  const createOrder = trpc.useMutation(["createOrder"]);

  return (
    <div className="bg-base-200">
      <div className="hero pt-5">
        <div className="hero-content text-center bg-base-300">
          <div className="max-w-md bg-base-400">
            <h1 className="text-5xl font-bold">AWSome Agency</h1>
            <p className="py-6">Enter your details to request a Demo...</p>
            {/* <button className="btn btn-primary">Get Started</button> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full border-opacity-50 pb-20">
        <div className="divider"></div>
        <div className="grid rounded-box place-items-center">
          <div className="text-center">
            <div>
              {getOrders.isLoading
                ? "Loading..."
                : JSON.stringify(getOrders.data?.Items)}
            </div>
            <div className="form-control">
              <Input
                labelName={"Email"}
                value={inputValue.email}
                onchange={(e) => setInputValue({ email: e.target.value })}
              />
              <button
                className="btn"
                disabled={createOrder.isLoading}
                onClick={() => {
                  createOrder.mutate({
                    email: "shaun@shaun.com",
                  });
                }}
              >
                {createOrder.isLoading ? "Creating..." : "Submit"}
              </button>
            </div>

            <pre>{JSON.stringify(createOrder.data, null, 2)}</pre>
          </div>
        </div>
      </div>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Copyright © 2022 - All right reserved by Awsome Agency Ltd</p>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
