import React from "react";
import { trpc } from "../../utils/trpc";
import { validateEmail } from "../../utils/validate";

interface OrderHistoryProps {
  email: string;
}

export const OrderHistory: React.FC<OrderHistoryProps> = (
  props: OrderHistoryProps
) => {
  const validEmail = validateEmail(props.email);
  const getOrders = validEmail
    ? trpc.useQuery(["getOrders", props.email])
    : undefined;

  return (
    <div className="">
      <div className="pt-5 text-center">
        {getOrders?.isLoading
          ? "Loading..."
          : getOrders?.data?.Items?.map((order, i) => (
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
