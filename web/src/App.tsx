import { useState } from "react";
import { Input, Alert, Select } from "./components";
import { trpc } from "../utils/trpc";
import { OrderHistory } from "./components";
import "./style/App.css";

function App() {
  const [inputValue, setInputValue] = useState({
    email: "",
    name: "",
    orderType: "Website",
    showHistory: false,
  });
  const { email, name, orderType, showHistory } = inputValue;
  const createOrder = trpc.useMutation(["createOrder"]);
  const incompleteForm = !email || !name;
  const toggleHistory = () => {
    setInputValue((prev) => ({ ...prev, showHistory: !prev.showHistory }));
  };

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="hero pt-5">
        <div
          onClick={toggleHistory}
          className="hero-content text-center bg-base-300 w-[480px]"
        >
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
                  setInputValue((prev) => ({
                    ...prev,
                    orderType: e.target.value,
                  }))
                }
              />
              <Input
                labelName={"Name"}
                value={name}
                onchange={(e) =>
                  setInputValue((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                labelName={"Email"}
                value={email}
                onchange={(e) =>
                  setInputValue((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <button
                className="btn btn-primary mt-3"
                disabled={createOrder.isLoading}
                onClick={async () => {
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
          </div>
          {showHistory && <OrderHistory />}
        </div>
      </div>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Copyright © 2022 - All right reserved by AWSome Agency Ltd</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
