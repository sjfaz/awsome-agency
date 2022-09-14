import React from "react";
import { trpc } from "../../utils/trpc";
import { Input } from "../components";

interface OrderHistoryProps {}

export const OrderHistory: React.FC<OrderHistoryProps> = (
  props: OrderHistoryProps
) => {
  const getOrders = trpc.useQuery(["getOrders", "shaun@example.com"]);
  return (
    <div className="">
      <div>Email Input here</div>
      <div className="pt-5 text-center">
        {getOrders.isLoading
          ? "Loading..."
          : getOrders.data?.Items?.map((order, i) => (
              <div key={order.createdDate} className="mt-3">
                <p className="text-l font-bold">
                  {`${order.createdDate} - ${order.email} - ${order.orderType}`}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};