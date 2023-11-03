import UserAnalytics from "@/app/components/Admin/Analytics/UserAnalytics";
import OrderAnalytics from "@/app/components/Admin/Analytics/OrderAnalytics";
import { Box, CircularProgress } from "@mui/material";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import AllInvoices from "../Order/AllInvoices";
import { useEffect, useState } from "react";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel = ({ open, value }: Props) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets = ({ open }: Props) => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>(
    {}
  );
  const [usersComparePercentage, setUsersComparePercentage] = useState<any>({});

  const { data: usersData, isLoading: usersLoading } =
    useGetUsersAnalyticsQuery(undefined, {});
  const { data: ordersData, isLoading: ordersLoading } =
    useGetOrdersAnalyticsQuery(undefined, {});

  useEffect(() => {
    if (!usersLoading && usersData) {
      const lastTwoMonths = usersData.users.last12Months.slice(-2);
      const currentMonth = lastTwoMonths[1].count;
      const previousMonth = lastTwoMonths[0].count;

      const percentageChange = parseInt(
        (
          ((currentMonth - previousMonth) * 100) /
          (previousMonth !== 0 ? previousMonth : 1)
        ).toFixed(0)
      );

      setUsersComparePercentage({
        currentMonth,
        previousMonth,
        percentageChange,
      });
    }
    if (!ordersLoading && ordersData) {
      const lastTwoMonths = ordersData.orders.last12Months.slice(-2);
      const currentMonth = lastTwoMonths[1].count;
      const previousMonth = lastTwoMonths[0].count;

      const percentageChange = parseInt(
        (
          ((currentMonth - previousMonth) * 100) /
          (previousMonth !== 0 ? previousMonth : 1)
        ).toFixed(0)
      );

      setOrdersComparePercentage({
        currentMonth,
        previousMonth,
        percentageChange,
      });
    }
  }, [ordersData, ordersLoading, usersData, usersLoading]);

  return (
    <div className="mt-[30px] min-h-screen">
      <div className="grid grid-cols-[75%,25%]">
        <div className="p-8">
          <UserAnalytics isDashboard={true} />
        </div>
        <div className="pt-[80px] pr-8">
          <div className="w-full dark:bg-[#111c43] rounded-sm shadow">
            <div className="flex items-center p-5 justify-between">
              <div>
                <BiBorderLeft className="dark:text-white text-black text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-white text-black text-[20px]">
                  {ordersComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-white text-black text-[20px] font-[400]">
                  Sales Obtained
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel
                  value={
                    parseInt(ordersComparePercentage?.percentageChange) > 0
                      ? 100
                      : 0
                  }
                  open={open}
                />
                <h5 className="text-center pt-4 text-white">
                  {parseInt(ordersComparePercentage?.percentageChange) > 0
                    ? "+"
                    : ""}
                  {ordersComparePercentage?.percentageChange} %
                </h5>
              </div>
            </div>
          </div>

          <div className="w-full dark:bg-[#111c43] rounded-sm shadow">
            <div className="flex items-center p-5 justify-between">
              <div>
                <PiUsersFourLight className="dark:text-[#45cba0] text-black text-[30px]" />
                <h5 className="py-2 font-Poppins dark:text-white text-black text-[20px]">
                  {usersComparePercentage?.currentMonth}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-white text-black text-[20px] font-[400]">
                  New Users
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel
                  value={
                    parseInt(usersComparePercentage.percentageChange) > 0
                      ? 100
                      : 0
                  }
                  open={open}
                />
                <h5 className="text-center pt-4 text-white">
                  {parseInt(usersComparePercentage?.percentageChange) > 0
                    ? "+"
                    : ""}
                  {usersComparePercentage?.percentageChange} %
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[65%,35%] mt-[-20px]">
        <div className="dark:bg-[#111c43] w-[94%] mt-[30px] h-[40vh] shadow-sm m-auto">
          <OrderAnalytics isDashboard={true} />
        </div>
        <div className="p-5">
          <h5 className="font-Poppins dark:text-white text-black text-[20px] font-[400] pb-3">
            Recent Transactions
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
