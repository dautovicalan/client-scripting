import { useAuth } from "../hooks/useAuth";
import type { Bill, Customer, BillSortState } from "../types";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";

interface BillTableProps {
  bills: Bill[];
  customers: Customer[];
  sortState: BillSortState;
  onSort: (field: keyof Bill) => void;
  onDelete?: (id: number) => void;
}

export const BillTable = ({
  bills,
  customers,
  sortState,
  onSort,
  onDelete,
}: BillTableProps) => {
  const { isAuthenticated } = useAuth();

  const getCustomerName = (customerId: number) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? `${customer.name} ${customer.surname}` : "-";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const renderSortIcon = (field: keyof Bill) => {
    if (sortState.field !== field) {
      return null;
    }
    return sortState.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />;
  };

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("billNumber")}
            >
              <div className="flex items-center gap-2">
                Bill Number {renderSortIcon("billNumber")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("date")}
            >
              <div className="flex items-center gap-2">
                Date {renderSortIcon("date")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("customerId")}
            >
              <div className="flex items-center gap-2">
                Customer {renderSortIcon("customerId")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("total")}
            >
              <div className="flex items-center gap-2">
                Total {renderSortIcon("total")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Comment
            </th>
            {isAuthenticated && (
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bills.map((bill) => (
            <tr key={bill.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                {bill.billNumber}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatDate(bill.date)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {getCustomerName(bill.customerId)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatCurrency(bill.total)}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                {bill.comment || "-"}
              </td>
              {isAuthenticated && (
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex gap-3 justify-end">
                    <Link
                      to={`/bills/${bill.id}`}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <FiEdit />
                      Edit
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(bill.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {bills.length === 0 && (
        <div className="text-center py-12 bg-white">
          <p className="text-gray-500">No bills found</p>
        </div>
      )}
    </div>
  );
};
