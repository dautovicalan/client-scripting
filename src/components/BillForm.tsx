import { useState, useEffect } from "react";
import type { Bill, Customer, Seller } from "../types";
import { FiX } from "react-icons/fi";

interface BillFormProps {
  isOpen: boolean;
  customers: Customer[];
  sellers: Seller[];
  onSave: (bill: Omit<Bill, "id" | "guid">) => void;
  onCancel: () => void;
}

export const BillForm = ({
  isOpen,
  customers,
  sellers,
  onSave,
  onCancel,
}: BillFormProps) => {
  const [formData, setFormData] = useState({
    billNumber: "",
    date: new Date().toISOString().split("T")[0],
    customerId: 0,
    sellerId: 0,
    creditCardId: null as number | null,
    comment: "",
    total: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        billNumber: `BILL-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        customerId: customers[0]?.id || 0,
        sellerId: sellers[0]?.id || 0,
        creditCardId: null,
        comment: "",
        total: 0,
      });
    }
  }, [isOpen, customers, sellers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          onClick={onCancel}
        >
          <FiX className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Bill</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="billNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Bill Number
            </label>
            <input
              type="text"
              id="billNumber"
              value={formData.billNumber}
              onChange={(e) =>
                setFormData({ ...formData, billNumber: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="customer"
              className="block text-sm font-medium text-gray-700"
            >
              Customer
            </label>
            <select
              id="customer"
              value={formData.customerId}
              onChange={(e) =>
                setFormData({ ...formData, customerId: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              required
            >
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.surname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="seller"
              className="block text-sm font-medium text-gray-700"
            >
              Seller
            </label>
            <select
              id="seller"
              value={formData.sellerId}
              onChange={(e) =>
                setFormData({ ...formData, sellerId: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              required
            >
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.name} {seller.surname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Comment
            </label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md border border-transparent bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
