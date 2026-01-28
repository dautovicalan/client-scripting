import { useAuth } from "../hooks/useAuth";
import type { Customer, City, SortState } from "../types";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";

interface CustomerTableProps {
  customers: Customer[];
  cities: City[];
  sortState: SortState;
  onSort: (field: keyof Customer) => void;
  onDelete?: (id: number) => void;
}

export const CustomerTable = ({
  customers,
  cities,
  sortState,
  onSort,
  onDelete,
}: CustomerTableProps) => {
  const { isAuthenticated } = useAuth();

  const getCityName = (cityId: number | null) => {
    if (!cityId) return "-";
    const city = cities.find((c) => c.id === cityId);
    return city ? city.name : "-";
  };

  const renderSortIcon = (field: keyof Customer) => {
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
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-2">
                Name {renderSortIcon("name")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("surname")}
            >
              <div className="flex items-center gap-2">
                Last Name {renderSortIcon("surname")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("email")}
            >
              <div className="flex items-center gap-2">
                Email {renderSortIcon("email")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("telephone")}
            >
              <div className="flex items-center gap-2">
                Phone {renderSortIcon("telephone")}
              </div>
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              onClick={() => onSort("cityId")}
            >
              <div className="flex items-center gap-2">
                City {renderSortIcon("cityId")}
              </div>
            </th>
            {isAuthenticated && (
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                {customer.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {customer.surname}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {customer.email}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {customer.telephone}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {getCityName(customer.cityId)}
              </td>
              {isAuthenticated && (
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex gap-3 justify-end">
                    <Link
                      to={`/customer/${customer.id}`}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    >
                      <FiEdit />
                      Edit
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(customer.id)}
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
      {customers.length === 0 && (
        <div className="text-center py-12 bg-white">
          <p className="text-gray-500">No customers found</p>
        </div>
      )}
    </div>
  );
};
