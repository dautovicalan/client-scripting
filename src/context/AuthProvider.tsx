import { useReducer, type ReactNode } from "react";
import type { User } from "../types";
import { authService } from "../services/api";
import { AuthContext } from "./AuthContext";

// Auth state type
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Action types
type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" };

// Initial state
const getInitialState = (): AuthState => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: !!token,
  };
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, null, getInitialState);

  const login = async (email: string, password: string) => {
    await authService.login(email, password);
    const userData: User = {
      id: 0,
      email: email,
      name: email.split("@")[0],
      password: "",
    };
    localStorage.setItem("user", JSON.stringify(userData));
    dispatch({ type: "LOGIN", payload: userData });
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
