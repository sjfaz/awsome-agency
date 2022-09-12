import { useState } from "react";
import { Input, Alert, Select } from "./components";
import { trpc } from "../utils/trpc";
import "./style/App.css";
// min-h-[calc(100vh-200px)]

function App() {
  const [inputValue, setInputValue] = useState({
    email: "",
    name: "",
    orderType: "Website",
  });
  const getOrders = trpc.useQuery(["getOrders", "s@s.com"]);
  const createOrder = trpc.useMutation(["createOrder"]);
  const { email, name, orderType } = inputValue;
  const incompleteForm = !email || !name;

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="hero pt-5">
        <div className="hero-content text-center bg-base-300 w-[480px]">
          <div className="max-w-md bg-base-500">
            <h1 className="text-5xl font-bold">AWSome Agency</h1>
            <p className="py-6">Enter your details to start your order.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full border-opacity-50 pb-20 h-full">
        <div className="divider"></div>
        <div className="grid rounded-box place-items-center">
          <div className="text-center">
            <div className="form-control w-[480px]">
              <Select
                onchange={(e) =>
                  setInputValue({ ...inputValue, orderType: e.target.value })
                }
              />
              <Input
                labelName={"Name"}
                value={name}
                onchange={(e) =>
                  setInputValue({ ...inputValue, name: e.target.value })
                }
              />
              <Input
                labelName={"Email"}
                value={email}
                onchange={(e) =>
                  setInputValue({ ...inputValue, email: e.target.value })
                }
              />
              <button
                className="btn btn-primary mt-3"
                disabled={createOrder.isLoading}
                onClick={() => {
                  if (incompleteForm) {
                    return;
                  }
                  createOrder.mutate({
                    name,
                    email,
                    orderType,
                  });
                }}
              >
                {createOrder.isLoading ? "Creating..." : "Submit"}
              </button>
            </div>
            {incompleteForm && (
              <Alert message="Please ensure the name and email are provided." />
            )}
            <pre>{JSON.stringify(createOrder.data, null, 2)}</pre>
          </div>
          <div className="pt-5 text-center">
            {getOrders.isLoading
              ? "Loading..."
              : JSON.stringify(getOrders.data?.Items)}
          </div>
          <div>{JSON.stringify(inputValue)}</div>
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

export default App;
