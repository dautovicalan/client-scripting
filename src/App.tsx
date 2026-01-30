import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Customers } from "./pages/Customers";
import { CustomerDetail } from "./pages/CustomerDetail";
import { Bills } from "./pages/Bills";
import { BillDetail } from "./pages/BillDetail";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Customers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/customer/new"
              element={
                <ProtectedRoute>
                  <CustomerDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/:id"
              element={
                <ProtectedRoute>
                  <CustomerDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/bills" element={<Bills />} />
            <Route
              path="/bills/:id"
              element={
                <ProtectedRoute>
                  <BillDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
