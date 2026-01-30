import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiDatabase, FiUsers, FiFileText, FiLogIn, FiLogOut, FiUserPlus, FiUser, FiMenu, FiX } from "react-icons/fi";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/"
                className="flex items-center gap-2 px-2 py-2 text-gray-900 font-semibold text-lg"
              >
                <FiDatabase className="text-blue-600" />
                Customer DB
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700"
                >
                  <FiUsers />
                  Customers
                </Link>
                <Link
                  to="/bills"
                  className="inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700"
                >
                  <FiFileText />
                  Bills
                </Link>
              </div>
            </div>
            {/* Desktop auth buttons */}
            <div className="hidden sm:flex sm:items-center">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    <FiUser />
                    {user?.name || user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiLogIn />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiUserPlus />
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="py-2 space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                <FiUsers className="text-gray-500" />
                Customers
              </Link>
              <Link
                to="/bills"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                <FiFileText className="text-gray-500" />
                Bills
              </Link>
            </div>
            <div className="py-3 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="px-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FiUser />
                    {user?.name || user?.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <FiLogIn />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <FiUserPlus />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};
