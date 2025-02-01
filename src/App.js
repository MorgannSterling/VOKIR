import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Lazy loading pages for performance optimization
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Token = lazy(() => import("./pages/Token"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

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

    // Log error to an external monitoring service
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
  return (
    <Router>
      <Helmet>
        <title>My React App</title>
        <meta name="description" content="A modern React app with optimized performance and accessibility." />
      </Helmet>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Navbar role="navigation" />
        <div className="flex-grow" role="main">
          <Suspense fallback={<LoadingSpinner />}>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/token" element={<Token />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </div>
        <Footer role="contentinfo" />
      </div>
    </Router>
  );
}

export default App;
