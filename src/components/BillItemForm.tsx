import { useState, useEffect } from "react";
import type { BillItem, Product } from "../types";
import { FiX } from "react-icons/fi";

interface BillItemFormProps {
  isOpen: boolean;
  billId: number;
  products: Product[];
  editingItem?: BillItem | null;
  onSave: (item: Omit<BillItem, "id" | "guid"> | BillItem) => void;
  onCancel: () => void;
}

export const BillItemForm = ({
  isOpen,
  billId,
  products,
  editingItem,
  onSave,
  onCancel,
}: BillItemFormProps) => {
  const [formData, setFormData] = useState({
    productId: 0,
    quantity: 1,
    unitPrice: 0,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        productId: editingItem.productId,
        quantity: editingItem.quantity,
        unitPrice: editingItem.totalPrice / editingItem.quantity,
      });
    } else {
      setFormData({
        productId: products[0]?.id || 0,
        quantity: 1,
        unitPrice: products[0]?.price || 0,
      });
    }
  }, [editingItem, products]);

  const handleProductChange = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    setFormData({
      ...formData,
      productId,
      unitPrice: product?.price || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = formData.quantity * formData.unitPrice;

    if (editingItem) {
      onSave({
        ...editingItem,
        productId: formData.productId,
        quantity: formData.quantity,
        totalPrice,
      });
    } else {
      onSave({
        billId,
        productId: formData.productId,
        quantity: formData.quantity,
        totalPrice,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          onClick={onCancel}
        >
          <FiX className="h-5 w-5" />
        </button>

        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingItem ? "Edit Item" : "Add Item"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="product"
              className="block text-sm font-medium text-gray-700"
            >
              Product
            </label>
            <select
              id="product"
              value={formData.productId}
              onChange={(e) => handleProductChange(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="unitPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Unit Price
            </label>
            <input
              type="number"
              id="unitPrice"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData({ ...formData, unitPrice: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
            />
          </div>

          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold">${(formData.quantity * formData.unitPrice).toFixed(2)}</span>
            </p>
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
              {editingItem ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
