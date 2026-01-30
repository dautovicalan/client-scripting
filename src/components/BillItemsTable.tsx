import type { BillItem, Product } from "../types";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface BillItemsTableProps {
  items: BillItem[];
  products: Product[];
  onEdit: (item: BillItem) => void;
  onDelete: (id: number) => void;
}

export const BillItemsTable = ({
  items,
  products,
  onEdit,
  onDelete,
}: BillItemsTableProps) => {
  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "-";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Subtotal
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                {getProductName(item.productId)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {item.quantity}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatCurrency(item.price)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatCurrency(item.quantity * item.price)}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                  >
                    <FiEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="text-center py-12 bg-white">
          <p className="text-gray-500">No items in this bill</p>
        </div>
      )}
    </div>
  );
};
