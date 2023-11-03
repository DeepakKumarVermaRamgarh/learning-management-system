import { FC } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Label,
  YAxis,
  LabelList,
} from "recharts";
import Loader from "@/app/components/Loader/Loader";
import { styles } from "@/app/styles/style";
import { useGetCoursesAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";

type Props = {};

const CourseAnalytics: FC<Props> = () => {
  const { data, isLoading } = useGetCoursesAnalyticsQuery(undefined, {});

  const analyticsData: any[] = [];

  const minValue: number = 0;

  if (data) {
    data.courses.last12Months.forEach((item: any) =>
      analyticsData.push({ name: item.month, uv: item.count })
    );
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="h-screen">
          <div className="mt-[50px]">
            <h1 className={`${styles.title} px-5 !text-start`}>
              Courses Analytics
            </h1>
            <p className={`${styles.label} px-5`}>
              {" "}
              Last 12 months analytics data{" "}
            </p>
          </div>

          <div className="w-full h-[90%] flex items-center justify-center ">
            <ResponsiveContainer width={"90%"} height={"50%"}>
              <BarChart width={150} height={300} data={analyticsData}>
                <XAxis dataKey={"name"}>
                  <Label offset={0} position={"insideBottom"} />
                </XAxis>
                <YAxis domain={[minValue, "auto"]} />
                <Bar dataKey={"uv"} fill="#3faf82">
                  <LabelList dataKey="uv" position={"top"} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseAnalytics;
