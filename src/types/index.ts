export interface Customer {
  id: number;
  guid: string;
  name: string;
  surname: string;
  email: string;
  telephone: string;
  cityId: number | null;
}

export interface City {
  id: number;
  name: string;
  postalCode: string;
}

export interface Bill {
  id: number;
  guid: string;
  date: string;
  billNumber: string;
  customerId: number;
  sellerId: number;
  creditCardId: number | null;
  comment: string;
  total: number;
}

export interface BillItem {
  id: number;
  guid?: string;
  billId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  subCategoryId: number;
}

export interface Seller {
  id: number;
  guid: string;
  name: string;
  surname: string;
  permanentEmployee: boolean;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: keyof Customer | null;
  direction: SortDirection;
}

export interface BillSortState {
  field: keyof Bill | null;
  direction: SortDirection;
}

export interface BillItemSortState {
  field: keyof BillItem | null;
  direction: SortDirection;
}
