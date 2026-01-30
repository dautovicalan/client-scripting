import { useState, useEffect, useMemo } from "react";
import type { Bill, Customer, Seller, BillSortState } from "../types";
import { billService, customerService, sellerService } from "../services/api";
import { BillTable } from "../components/BillTable";
import { BillForm } from "../components/BillForm";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Bills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortState, setSortState] = useState<BillSortState>({
    field: null,
    direction: "asc",
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    billId: number | null;
    billNumber: string;
  }>({ isOpen: false, billId: null, billNumber: "" });
  const [billFormOpen, setBillFormOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [billsData, customersData, sellersData] = await Promise.all([
        billService.getAll(),
        customerService.getAll(),
        sellerService.getAll(),
      ]);
      setBills(billsData);
      setCustomers(customersData);
      setSellers(sellersData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof Bill) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteClick = (id: number) => {
    const bill = bills.find((b) => b.id === id);
    setDeleteModal({
      isOpen: true,
      billId: id,
      billNumber: bill ? bill.billNumber : "",
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.billId === null) return;

    try {
      await billService.delete(deleteModal.billId);
      setBills(bills.filter((b) => b.id !== deleteModal.billId));
    } catch (error) {
      console.error("Failed to delete bill:", error);
    } finally {
      setDeleteModal({ isOpen: false, billId: null, billNumber: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, billId: null, billNumber: "" });
  };

  const handleCreateBill = async (billData: Omit<Bill, "id" | "guid">) => {
    try {
      const newBill = await billService.create(billData);
      setBills([...bills, newBill]);
      setBillFormOpen(false);
      navigate(`/bills/${newBill.id}`);
    } catch (error) {
      console.error("Failed to create bill:", error);
    }
  };

  const filteredAndSortedBills = useMemo(() => {
    let result = [...bills];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((bill) => {
        const customer = customers.find((c) => c.id === bill.customerId);
        const customerName = customer
          ? `${customer.name} ${customer.surname}`.toLowerCase()
          : "";
        return (
          bill.billNumber.toLowerCase().includes(query) ||
          customerName.includes(query) ||
          bill.comment?.toLowerCase().includes(query)
        );
      });
    }

    if (sortState.field) {
      result.sort((a, b) => {
        const aVal = a[sortState.field!];
        const bVal = b[sortState.field!];

        if (aVal === null) return 1;
        if (bVal === null) return -1;

        if (sortState.field === "customerId") {
          const aCustomer = customers.find((c) => c.id === aVal);
          const bCustomer = customers.find((c) => c.id === bVal);
          const aName = aCustomer
            ? `${aCustomer.name} ${aCustomer.surname}`
            : "";
          const bName = bCustomer
            ? `${bCustomer.name} ${bCustomer.surname}`
            : "";
          return sortState.direction === "asc"
            ? aName.localeCompare(bName)
            : bName.localeCompare(aName);
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortState.direction === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortState.direction === "asc"
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      });
    }

    return result;
  }, [bills, customers, searchQuery, sortState]);

  const paginatedBills = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedBills.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedBills, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedBills.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Bills</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all bills including bill number, date, customer, and
            total.
          </p>
        </div>
        {isAuthenticated && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setBillFormOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Bill
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search by bill number, customer, or comment..."
        />

        <BillTable
          bills={paginatedBills}
          customers={customers}
          sortState={sortState}
          onSort={handleSort}
          onDelete={isAuthenticated ? handleDeleteClick : undefined}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedBills.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Bill"
        message={`Are you sure you want to delete bill ${deleteModal.billNumber}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <BillForm
        isOpen={billFormOpen}
        customers={customers}
        sellers={sellers}
        onSave={handleCreateBill}
        onCancel={() => setBillFormOpen(false)}
      />
    </div>
  );
};
