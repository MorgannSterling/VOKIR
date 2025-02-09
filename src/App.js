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
const Dashboard = lazy(() => import("./pages/Dashboard")); // New Authenticated Route
const NotFound = lazy(() => import("./pages/NotFound"));

// Authentication Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("auth") === "true");

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("auth", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route Wrapper
function PrivateRoute({ element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" />;
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
                      <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
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
