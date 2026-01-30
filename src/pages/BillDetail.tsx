import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import type { Bill, BillItem, Customer, Product, Seller } from "../types";
import {
  billService,
  billItemService,
  customerService,
  productService,
  sellerService,
} from "../services/api";
import { BillItemsTable } from "../components/BillItemsTable";
import { BillItemForm } from "../components/BillItemForm";
import { BillForm } from "../components/BillForm";
import { ConfirmModal } from "../components/ConfirmModal";
import { FiArrowLeft, FiPlus, FiEdit } from "react-icons/fi";

export const BillDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bill, setBill] = useState<Bill | null>(null);
  const [items, setItems] = useState<BillItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BillItem | null>(null);

  const [billFormOpen, setBillFormOpen] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: number | null;
    productName: string;
  }>({ isOpen: false, itemId: null, productName: "" });

  useEffect(() => {
    if (id) {
      loadData(Number(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async (billId: number) => {
    try {
      const [billData, itemsData, customersData, productsData, sellersData] =
        await Promise.all([
          billService.getById(billId),
          billItemService.getByBillId(billId),
          customerService.getAll(),
          productService.getAll(),
          sellerService.getAll(),
        ]);
      setBill(billData);
      setItems(itemsData);
      setCustomers(customersData);
      setProducts(productsData);
      setSellers(sellersData);
    } catch (error) {
      console.error("Failed to load data:", error);
      navigate("/bills");
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customerId: number) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? `${customer.name} ${customer.surname}` : "-";
  };

  const getSellerName = (sellerId: number) => {
    const seller = sellers.find((s) => s.id === sellerId);
    return seller ? `${seller.name} ${seller.surname}` : "-";
  };

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "-";
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

  const handleEditBill = () => {
    setBillFormOpen(true);
  };

  const handleSaveBill = async (billData: Omit<Bill, "id" | "guid"> | Bill) => {
    if (!bill) return;
    try {
      if ("id" in billData) {
        const updated = await billService.update(billData.id, billData);
        setBill(updated);
      }
      setBillFormOpen(false);
    } catch (error) {
      console.error("Failed to update bill:", error);
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setItemFormOpen(true);
  };

  const handleEditItem = (item: BillItem) => {
    setEditingItem(item);
    setItemFormOpen(true);
  };

  const handleDeleteClick = (itemId: number) => {
    const item = items.find((i) => i.id === itemId);
    setDeleteModal({
      isOpen: true,
      itemId,
      productName: item ? getProductName(item.productId) : "",
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.itemId === null) return;

    try {
      await billItemService.delete(deleteModal.itemId);
      setItems(items.filter((i) => i.id !== deleteModal.itemId));
      updateBillTotal(items.filter((i) => i.id !== deleteModal.itemId));
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setDeleteModal({ isOpen: false, itemId: null, productName: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, itemId: null, productName: "" });
  };

  const handleSaveItem = async (
    itemData: Omit<BillItem, "id" | "guid"> | BillItem,
  ) => {
    try {
      if ("id" in itemData) {
        const updated = await billItemService.update(itemData.id, itemData);
        const updatedItems = items.map((i) =>
          i.id === updated.id ? updated : i,
        );
        setItems(updatedItems);
        updateBillTotal(updatedItems);
      } else {
        const created = await billItemService.create(itemData);
        const updatedItems = [...items, created];
        setItems(updatedItems);
        updateBillTotal(updatedItems);
      }
      setItemFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  const updateBillTotal = async (updatedItems: BillItem[]) => {
    if (!bill) return;
    const newTotal = updatedItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
    try {
      const updated = await billService.update(bill.id, { total: newTotal });
      setBill(updated);
    } catch (error) {
      console.error("Failed to update bill total:", error);
    }
  };

  const handleCancelForm = () => {
    setItemFormOpen(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Bill not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/bills"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <FiArrowLeft />
          Back to Bills
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Bill #{bill.billNumber}
          </h1>
          <button
            onClick={handleEditBill}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiEdit />
            Edit Bill
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Date</p>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(bill.date)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Customer</p>
            <p className="mt-1 text-sm text-gray-900">
              {getCustomerName(bill.customerId)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Seller</p>
            <p className="mt-1 text-sm text-gray-900">
              {getSellerName(bill.sellerId)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {formatCurrency(bill.total)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Comment</p>
            <p className="mt-1 text-sm text-gray-900">{bill.comment || "-"}</p>
          </div>
        </div>
      </div>

      <div className="sm:flex sm:items-center mb-4">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Bill Items</h2>
          <p className="mt-1 text-sm text-gray-700">
            Manage items in this bill.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleAddItem}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiPlus />
            Add Item
          </button>
        </div>
      </div>

      <BillItemsTable
        items={items}
        products={products}
        onEdit={handleEditItem}
        onDelete={handleDeleteClick}
      />

      <BillItemForm
        isOpen={itemFormOpen}
        billId={bill.id}
        products={products}
        editingItem={editingItem}
        onSave={handleSaveItem}
        onCancel={handleCancelForm}
      />

      <BillForm
        isOpen={billFormOpen}
        customers={customers}
        sellers={sellers}
        editingBill={bill}
        onSave={handleSaveBill}
        onCancel={() => setBillFormOpen(false)}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteModal.productName}" from this bill? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};
