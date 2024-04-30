import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/Loader";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userAPI";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { FaTrash } from "react-icons/fa";
import { responseToast } from "../../utils/features";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const {user} = useSelector((state: RootState)=>state.userReducer);
  const {isLoading, data, error, isError} = useAllUsersQuery(user?._id as string);

  const [rows, setRows] = useState<DataType[]>([]);

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({userId, adminId: user?._id as string})

    responseToast(res, null, "");    
  }

  if(isError){
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(()=>{
    
    if(data) setRows(data.users.map(i=>({
      avatar: (<img src={i.photo} style={{borderRadius: "50%", boxShadow: "1px 1px 5px grey, -1px -1px 5px grey"}} alt={i.name.slice(0, 2)}/>),
      name: i.name,
      email: i.email,
      gender: i.gender,
      role: i.role,
      action: (
        <button onClick={()=>deleteHandler(i._id)}><FaTrash/></button>
      )
      })));
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading? <Skeleton/>: Table}</main>
    </div>
  );
};

export default Customers;
