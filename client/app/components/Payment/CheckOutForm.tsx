import { styles } from "@/app/styles/style";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { PaymentElement } from "@stripe/react-stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socketIO from "socket.io-client";
const socketId = socketIO(process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "", {
  transports: ["websocket"],
});

type Props = {
  setOpen: (open: boolean) => void;
  courseData: any;
  user: any;
};

const CheckOutForm = ({ setOpen, courseData, user }: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<any>("");
  const [createOrder, { data: orderData, error }] = useCreateOrderMutation();
  const [loadUser, setLoadUser] = useState<boolean>(false);
  const {} = useLoadUserQuery({
    skip: !loadUser,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error?.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setIsLoading(false);

      createOrder({
        courseId: courseData._id,
        payment_info: paymentIntent,
      });

      setMessage("Payment Successfull");
    }
  };

  useEffect(() => {
    if (orderData) {
      setLoadUser(true);
      setOpen(false);
      socketId.emit("notification", {
        title: "New Order",
        message: `New order for ${courseData.name} by ${user.name}`,
        userId: user._id,
      });
      redirect(`/course-access/${courseData._id}`);
    }
    if (error) {
      if ("data" in error) {
        const errMsg = error as any;
        toast.error(errMsg.data.message);
      }
    }
  }, [
    courseData._id,
    courseData.name,
    error,
    orderData,
    setOpen,
    user._id,
    user.name,
  ]);

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="w-full">
      <PaymentElement id="payment-element" />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold my-5 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        <span id="button-text">{isLoading ? "Paying..." : "Pay Now"}</span>
      </button>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="text-black dark:text-white">
          {message}
        </div>
      )}
    </form>

    // <form id="payment-form" onSubmit={handleSubmit} className="w-full">
    //   <LinkAuthenticationElement id="link-authentication-element" />
    //   <PaymentElement id="payment-element" />
    //   <button
    //     disabled={isLoading || !stripe || !elements}
    //     id="submit"
    //     // className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //     className={styles.button}
    //     type="submit"
    //   >
    //     <span id="button-text">{isLoading ? "Paying..." : "Pay Now"}</span>
    //   </button>

    //   {/* show any error or success messages */}
    //   {message && (
    //     <div id="payment-message" className="text-black dark:text-white">
    //       {message}
    //     </div>
    //   )}
    // </form>
  );
};

export default CheckOutForm;
