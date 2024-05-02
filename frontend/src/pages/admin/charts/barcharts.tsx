import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { RootState } from "../../../redux/store";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import { CustomError } from "../../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/Loader";
import { getLastMonths } from "../../../utils/features";


const {last12Months, last6Months} = getLastMonths();
console.log("barcharts.tsx >>> ", last6Months, last12Months);

const Barcharts = () => {

  const {user} = useSelector((state: RootState)=>state.userReducer);

  const {isLoading, data, error, isError} = useBarQuery(user?._id as string);

  const barData = data?.charts;

  if(isError){
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>
        {
          isLoading ? <Skeleton/> : (
            <>
              <section>
          <BarChart
            data_1={barData?.products as number[]}
            data_2={barData?.users as number[]}
            title_1="Products"
            title_2="Users"
            bgColor_1={`hsl(260, 50%, 30%)`}
            bgColor_2={`hsl(360, 90%, 90%)`}
            labels={last6Months}
          />
          <h2>Top Products & Top Customers</h2>
        </section>

        <section>
          <BarChart
            horizontal={true}
            data_1={barData?.orders as number[]}
            data_2={[]}
            title_1="Orders"
            title_2=""
            bgColor_1={`hsl(180, 40%, 50%)`}
            bgColor_2=""
            labels={last12Months}
          />
          <h2>Orders throughout the year</h2>
        </section>

            </>
          )
        }
      </main>
    </div>
  );
};

export default Barcharts;
