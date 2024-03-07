import { ReactElement, useState } from 'react';
import {Link} from 'react-router-dom';
import TableHOC from '../components/admin/TableHOC';
import { Column } from 'react-table';

type DataType = {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: ReactElement;
  action: ReactElement;
};

const column: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },  
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
]

function Orders() {
  const [rows, setRows] = useState<DataType[]>([
    {
      _id: "asdfa_73693",
      amount: 23764,
      quantity: 1,
      discount: 275,
      status: <span className='green'>Dispatched</span>,
      action: <Link to={`/order/asdfa_73693`}>View</Link>,
    },
  ])

  const Table = TableHOC<DataType>(column, rows, "dashboard-product-box", "Orders", rows.length > 6)();
  return (
    <div className='container'>
      <h1>My Orders</h1>
      {Table}
    </div>
  )
}

export default Orders