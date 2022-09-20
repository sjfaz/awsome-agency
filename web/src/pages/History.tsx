import { useState } from "react";
import { Input, Alert, Header, OrderHistory } from "../components";

export default function History() {
  const [email, setEmail] = useState("");

  return (
    <div className="bg-base-200 min-h-screen">
      <Header buttonUrl="/" />
      <div className="flex flex-col w-full border-opacity-50 pb-20 h-full">
        <div className="divider"></div>
        <div className="grid rounded-box place-items-center">
          <div className="text-center">
            <div className="form-control w-[480px]">
              <Input
                labelName={"Email"}
                value={email}
                onchange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              {!email && <Alert message="Please enter the email." />}
              {email && <OrderHistory email={email} />}
            </div>
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
