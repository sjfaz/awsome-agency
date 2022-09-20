import { useState } from "react";
import { Input, Alert, Select, Header } from "../components";
import { trpc } from "../../utils/trpc";

export default function Home() {
  const [inputValue, setInputValue] = useState({
    email: "",
    name: "",
    orderType: "Website",
  });
  const { email, name, orderType } = inputValue;
  const createOrder = trpc.useMutation(["createOrder"]);
  const incompleteForm = !email || !name;

  return (
    <div className="bg-base-200 min-h-screen">
      <Header buttonUrl="/history" />
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
