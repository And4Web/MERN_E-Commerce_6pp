import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import {categories} from "../../../assets/data.json";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { usePieQuery } from "../../../redux/api/dashboardAPI";
import { CustomError } from "../../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/Loader";

const PieCharts = () => {

  const {user} = useSelector((state: RootState)=>state.userReducer);

  const {isLoading, data, error, isError} = usePieQuery(user?._id as string);

  const pieData = data?.charts;

  console.log("pieData >>> ", pieData);

  if(isError){
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Pie & Doughnut Charts</h1>
        {
          isLoading ? <Skeleton/> : (
            <>
              <section>
          <div>
            <PieChart
              labels={["Processing", "Shipped", "Delivered"]}
              data={[pieData?.orderFullfillment.processing as number, pieData?.orderFullfillment.shipped as number, pieData?.orderFullfillment.delivered as number]}
              backgroundColor={[
                `hsl(110,80%, 80%)`,
                `hsl(110,80%, 50%)`,
                `hsl(110,40%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Order Fulfillment Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={pieData?.productCategories.map((i) => Object.keys(i)[0])}
              data={pieData?.productCategories.map((i) => Object.values(i)[0])}
              backgroundColor={categories.map(
                (i) => `hsl(${i.value * 4}, ${i.value}%, 50%)`
              )}
              legends={false}
              offset={[0, 0, 0, 80]}
            />
          </div>
          <h2>Product Categories Ratio</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["In Stock", "Out Of Stock"]}
              data={[pieData?.stockAvailability.inStock as number, pieData?.stockAvailability.outOfStock as number]}
              backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
              legends={false}
              offset={[0, 80]}
              cutout={"70%"}
            />
          </div>
          <h2> Stock Availability</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={[
                "Marketing Cost",
                "Discount",
                "Burnt",
                "Production Cost",
                "Net Margin",
              ]}
              data={[pieData?.revenueDistribution.marketingCost as number, pieData?.revenueDistribution.discount as number, pieData?.revenueDistribution.burnt as number, pieData?.revenueDistribution.productionCost as number, pieData?.revenueDistribution.netMargin as number]}
              backgroundColor={[
                "hsl(110,80%,40%)",
                "hsl(19,80%,40%)",
                "hsl(69,80%,40%)",
                "hsl(300,80%,40%)",
                "rgb(53, 162, 255)",
              ]}
              legends={false}
              offset={[20, 30, 20, 30, 80]}
            />
          </div>
          <h2>Revenue Distribution</h2>
        </section>

        <section>
          <div>
            <PieChart
              labels={[
                "Teenager(Below 20)",
                "Adult (20-40)",
                "Older (above 40)",
              ]}
              data={[pieData?.usersAgeGroup.teen as number, pieData?.usersAgeGroup.adult as number, pieData?.usersAgeGroup.old as number]}
              backgroundColor={[
                `hsl(10, ${80}%, 80%)`,
                `hsl(10, ${80}%, 50%)`,
                `hsl(10, ${40}%, 50%)`,
              ]}
              offset={[0, 0, 50]}
            />
          </div>
          <h2>Users Age Group</h2>
        </section>

        <section>
          <div>
            <DoughnutChart
              labels={["Admin", "Customers"]}
              data={[pieData?.adminCustomers.admin as number, pieData?.adminCustomers.customer as number]}
              backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
              offset={[0, 50]}
            />
          </div>
        </section>

            </>
          )
        }
      </main>
    </div>
  );
};

export default PieCharts;
