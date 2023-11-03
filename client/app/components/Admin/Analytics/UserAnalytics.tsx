import { FC } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  AreaChart,
  Tooltip,
  Area,
} from "recharts";
import Loader from "@/app/components/Loader/Loader";
import { styles } from "@/app/styles/style";
import { useGetUsersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

type Props = {
  isDashboard?: boolean;
};

const CourseAnalytics: FC<Props> = ({ isDashboard }) => {
  const { data, isLoading } = useGetUsersAnalyticsQuery(undefined, {});
  const analyticsData: any[] = [];

  if (data) {
    data.users.last12Months.forEach((item: any) =>
      analyticsData.push({ name: item.month, Count: item.count })
    );
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div
          className={`${
            !isDashboard
              ? "mt-[50px]"
              : "mt-[50px] dark:bg-[#111c43] shadow-sm pb-5 rounded-sm"
          }`}
        >
          <div className={`${isDashboard ? "!ml-8 mb-5" : ""}`}>
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              Users Analytics
            </h1>
            {!isDashboard && (
              <p className={`${styles.label} px-5`}>
                Last 12 months analytics data
              </p>
            )}
          </div>

          <div
            className={`w-full ${
              isDashboard ? "h-[30vh]" : "h-screen"
            } flex items-center justify-center `}
          >
            {analyticsData && analyticsData.length > 0 && (
              <ResponsiveContainer
                width={isDashboard ? "100%" : "90%"}
                height={isDashboard ? "50%" : "80%"}
              >
                <AreaChart
                  data={analyticsData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <XAxis dataKey={"name"} />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type={"monotone"}
                    dataKey={"Count"}
                    stroke="#4d62d9"
                    fill="#4d62d9"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;
