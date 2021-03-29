import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import buildClient from "../../api/build-client";

const OrderShow = ({ order, currentUser, stripeKey }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => console.log(payment)
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft(); // setInterval will start after 1s later, this call to display the time left immediately
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={stripeKey}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const stripeKey = process.env.STRIPE_PUBLIC_KEY;

  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return {
    props: { order: data, stripeKey } // will be passed to the page component as props
  };
}

export default OrderShow;
