import React from "react";
import { useNavigate } from "@tanstack/react-location";

interface HeaderProps {
  buttonUrl: string;
}

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const navigate = useNavigate();
  const { buttonUrl } = props;
  const message =
    buttonUrl === "/history"
      ? "Enter your details to start your order."
      : "Enter email to see order history.";
  return (
    <div className="hero pt-5">
      <div className="hero-content text-center bg-base-300 w-[480px]">
        <div className="max-w-md bg-base-500">
          <h1 className="text-5xl font-bold">AWSome Agency</h1>
          <p className="py-6">{message}</p>
          <button
            onClick={() => navigate({ to: buttonUrl, replace: true })}
            className="btn mt-1"
          >
            {buttonUrl === "/history" ? "Order History" : "Home"}
          </button>
        </div>
      </div>
    </div>
  );
};
