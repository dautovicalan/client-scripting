import { useState, useEffect, useMemo } from "react";
import type { Customer, City, SortState } from "../types";
import { customerService, cityService } from "../services/api";
import { CustomerTable } from "../components/CustomerTable";
import { SearchBar } from "../components/SearchBar";
import { Pagination } from "../components/Pagination";
import { ConfirmModal } from "../components/ConfirmModal";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortState, setSortState] = useState<SortState>({
    field: null,
    direction: "asc",
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    customerId: number | null;
    customerName: string;
  }>({ isOpen: false, customerId: null, customerName: "" });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [customersData, citiesData] = await Promise.all([
        customerService.getAll(),
        cityService.getAll(),
      ]);
      setCustomers(customersData);
      setCities(citiesData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof Customer) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDeleteClick = (id: number) => {
    const customer = customers.find((c) => c.id === id);
    setDeleteModal({
      isOpen: true,
      customerId: id,
      customerName: customer ? `${customer.name} ${customer.surname}` : "",
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteModal.customerId === null) return;

    try {
      await customerService.delete(deleteModal.customerId);
      setCustomers(customers.filter((c) => c.id !== deleteModal.customerId));
    } catch (error) {
      console.error("Failed to delete customer:", error);
    } finally {
      setDeleteModal({ isOpen: false, customerId: null, customerName: "" });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, customerId: null, customerName: "" });
  };

  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.surname.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.telephone.toLowerCase().includes(query) ||
          cities
            .find((c) => c.id === customer.cityId)
            ?.name.toLowerCase()
            .includes(query),
      );
    }

    if (sortState.field) {
      result.sort((a, b) => {
        const aVal = a[sortState.field!];
        const bVal = b[sortState.field!];

        if (aVal === null) return 1;
        if (bVal === null) return -1;

        if (sortState.field === "cityId") {
          const aCityName = cities.find((c) => c.id === aVal)?.name || "";
          const bCityName = cities.find((c) => c.id === bVal)?.name || "";
          return sortState.direction === "asc"
            ? aCityName.localeCompare(bCityName)
            : bCityName.localeCompare(aCityName);
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
  }, [customers, cities, searchQuery, sortState]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCustomers.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  }, [filteredAndSortedCustomers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(
    filteredAndSortedCustomers.length / itemsPerPage,
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all customers including their name, email, phone and city.
          </p>
        </div>
        {isAuthenticated && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/customer/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Customer
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search by name, email, phone, or city..."
        />

        <CustomerTable
          customers={paginatedCustomers}
          cities={cities}
          sortState={sortState}
          onSort={handleSort}
          onDelete={isAuthenticated ? handleDeleteClick : undefined}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedCustomers.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Customer"
        message={`Are you sure you want to delete ${deleteModal.customerName}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};
