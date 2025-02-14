import React, { lazy, Suspense, useEffect, useState, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ThemeSwitcher from "./components/ThemeSwitcher";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Token = lazy(() => import("./pages/Token"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Authentication Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : { isAuthenticated: false, role: "guest", token: null };
  });

  useEffect(() => {
    // Auto-login if token is stored
    if (user.token) {
      fetch("https://api.example.com/auth/validate-token", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      })
        .then(res => res.json())
        .then(data => {
          if (!data.valid) logout();
        })
        .catch(() => logout());
    }
  }, []);

  const login = (role = "user", token) => {
    const newUser = { isAuthenticated: true, role, token };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser({ isAuthenticated: false, role: "guest", token: null });
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route Wrapper
function PrivateRoute({ element, allowedRoles }) {
  const { user } = useAuth();
  return user.isAuthenticated && allowedRoles.includes(user.role) ? element : <Navigate to="/" />;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    fetch("https://error-logging-service.com/log", {
      method: "POST",
      body: JSON.stringify({ error, errorInfo }),
      headers: { "Content-Type": "application/json" },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-10">
          <h1>Something went wrong!</h1>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const pageTitles = {
      "/": "Home - My React App",
      "/about": "About Us - My React App",
      "/token": "Token Details - My React App",
      "/contact": "Contact Us - My React App",
      "/dashboard": "Dashboard - My React App",
      "/admin": "Admin Panel - My React App",
    };
    document.title = pageTitles[location.pathname] || "My React App";
  }, [location]);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
          <Navbar role="navigation" />
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          <div className="flex-grow" role="main">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary>
                    <Routes location={location} key={location.pathname}>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/token" element={<Token />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} allowedRoles={["user", "admin"]} />} />
                      <Route path="/admin" element={<PrivateRoute element={<AdminPanel />} allowedRoles={["admin"]} />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
          <Footer role="contentinfo" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
