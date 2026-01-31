import axios from "axios";
import type { Customer, Bill, BillItem, City, Product, Seller } from "../types";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authService = {
  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: { access_token: string } }> {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.access_token);
    return data;
  },

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ id: number; email: string; name: string }> {
    const { data } = await api.post("/auth/register", {
      email,
      password,
      name,
    });
    return data;
  },

  logout() {
    localStorage.removeItem("token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const { data } = await api.get("/Customer");
    return data;
  },

  async getById(id: number): Promise<Customer> {
    const { data } = await api.get(`/Customer/${id}`);
    return data;
  },

  async create(customer: Omit<Customer, "id" | "guid">): Promise<Customer> {
    const { data } = await api.post("/Customer", customer);
    return data;
  },

  async update(id: number, customer: Partial<Customer>): Promise<Customer> {
    const { data } = await api.patch(`/Customer/${id}`, customer);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Customer/${id}`);
  },
};

export const billService = {
  async getAll(): Promise<Bill[]> {
    const { data } = await api.get("/Bill");
    return data;
  },

  async getById(id: number): Promise<Bill> {
    const { data } = await api.get(`/Bill/${id}`);
    return data;
  },

  async getByCustomerId(customerId: number): Promise<Bill[]> {
    const { data } = await api.get("/Bill", {
      params: { customerId },
    });
    return data;
  },

  async create(bill: Omit<Bill, "id" | "guid">): Promise<Bill> {
    const { data } = await api.post("/Bill", bill);
    return data;
  },

  async update(id: number, bill: Partial<Bill>): Promise<Bill> {
    const { data } = await api.patch(`/Bill/${id}`, bill);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Bill/${id}`);
  },
};

export const billItemService = {
  async getByBillId(billId: number): Promise<BillItem[]> {
    const { data } = await api.get("/Item", {
      params: { billId },
    });
    return data;
  },

  async create(item: Omit<BillItem, "id">): Promise<BillItem> {
    const { data } = await api.post("/Item", item);
    return data;
  },

  async update(id: number, item: Partial<BillItem>): Promise<BillItem> {
    const { data } = await api.patch(`/Item/${id}`, item);
    return data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Item/${id}`);
  },
};

export const cityService = {
  async getAll(): Promise<City[]> {
    const { data } = await api.get("/City");
    return data;
  },
};

export const productService = {
  async getAll(): Promise<Product[]> {
    const { data } = await api.get("/Product");
    return data;
  },
};

export const sellerService = {
  async getAll(): Promise<Seller[]> {
    const { data } = await api.get("/Seller");
    return data;
  },
};
