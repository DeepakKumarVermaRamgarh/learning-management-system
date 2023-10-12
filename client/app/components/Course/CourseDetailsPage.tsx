import { useGetCourseDetailsQuery } from "@/redux/features/courses/courseApi";
import React, { FC, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import Header from "../Header";
import Footer from "../Footer";
import CourseDetails from "./CourseDetails";
import {
  useCreatePaymentIndentMutation,
  useGetStripePublishableKeyQuery,
} from "@/redux/features/orders/ordersApi";
import { loadStripe } from "@stripe/stripe-js";

type Props = {
  id: string;
};

const CourseDetailsPage: FC<Props> = ({ id }) => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useGetCourseDetailsQuery(id);
  const { data: config } = useGetStripePublishableKeyQuery({});
  const [createPaymentIndent, { data: paymentIndentData }] =
    useCreatePaymentIndentMutation();

  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (config) {
      const publishableKey = config?.publishableKey;
      setStripePromise(loadStripe(publishableKey));
    }
    if (data) {
      const amount = Math.round(data.course.price * 100);
      createPaymentIndent(amount);
    }
  }, [config, createPaymentIndent, data]);

  useEffect(() => {
    if (paymentIndentData) {
      setClientSecret(paymentIndentData?.client_secret);
    }
  }, [paymentIndentData]);

  return isLoading ? (
    <Loader />
  ) : (
    <div>
      <Heading
        title={`${data.course.name} | E-Learning`}
        description="ELearning is a programming community provides courses on various techstacks to improve and be a better version of yourself. Developed by Deepak Kumar Verma."
        keywords={data.course?.tags}
      />
      <Header
        route={route}
        setRoute={setRoute}
        open={open}
        setOpen={setOpen}
        activeItem={1}
      />
      {stripePromise && (
        <CourseDetails
          courseData={data.course}
          stripePromise={stripePromise}
          clientSecret={clientSecret}
        />
      )}
      <Footer />
    </div>
  );
};

export default CourseDetailsPage;
