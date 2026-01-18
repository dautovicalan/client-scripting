import type { Customer, Bill, BillItem, City, Product } from "../types";

const API_BASE_URL = "http://localhost:3000";

const getAuthToken = () => localStorage.getItem("token");

const getHeaders = (authenticated = false) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (authenticated) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<{ access_token: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    return data;
  },

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<{ id: number; email: string; name: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  },

  logout() {
    localStorage.removeItem("token");
  },

  isAuthenticated(): boolean {
    return !!getAuthToken();
  },
};

export const customerService = {
  async getAll(): Promise<Customer[]> {
    const response = await fetch(`${API_BASE_URL}/Customer`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async getById(id: number): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/Customer/${id}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  async create(customer: Omit<Customer, "id" | "guid">): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/Customer`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(customer),
    });
    return response.json();
  },

  async update(id: number, customer: Partial<Customer>): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/Customer/${id}`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(customer),
    });
    return response.json();
  },

  async delete(id: number): Promise<void> {
    await fetch(`${API_BASE_URL}/Customer/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};

export const billService = {
  async getByCustomerId(customerId: number): Promise<Bill[]> {
    const response = await fetch(
      `${API_BASE_URL}/Bill?customerId=${customerId}`,
      {
        headers: getHeaders(true),
      }
    );
    return response.json();
  },

  async create(bill: Omit<Bill, "id" | "guid">): Promise<Bill> {
    const response = await fetch(`${API_BASE_URL}/Bill`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(bill),
    });
    return response.json();
  },

  async update(id: number, bill: Partial<Bill>): Promise<Bill> {
    const response = await fetch(`${API_BASE_URL}/Bill/${id}`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(bill),
    });
    return response.json();
  },

  async delete(id: number): Promise<void> {
    await fetch(`${API_BASE_URL}/Bill/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};

export const billItemService = {
  async getByBillId(billId: number): Promise<BillItem[]> {
    const response = await fetch(`${API_BASE_URL}/Item?billId=${billId}`, {
      headers: getHeaders(true),
    });
    return response.json();
  },

  async create(item: Omit<BillItem, "id">): Promise<BillItem> {
    const response = await fetch(`${API_BASE_URL}/Item`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(item),
    });
    return response.json();
  },

  async update(id: number, item: Partial<BillItem>): Promise<BillItem> {
    const response = await fetch(`${API_BASE_URL}/Item/${id}`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(item),
    });
    return response.json();
  },

  async delete(id: number): Promise<void> {
    await fetch(`${API_BASE_URL}/Item/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};

export const cityService = {
  async getAll(): Promise<City[]> {
    const response = await fetch(`${API_BASE_URL}/City`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/Product`, {
      headers: getHeaders(true),
    });
    return response.json();
  },
};
