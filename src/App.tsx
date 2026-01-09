import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Customers } from './pages/Customers';
import { CustomerDetail } from './pages/CustomerDetail';
import { Login } from './pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Customers />} />
            <Route path="/login" element={<Login />} />
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
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
