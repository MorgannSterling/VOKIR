import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import { QueryClient, QueryClientProvider } from "react-query"; // Added React Query
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
<<<<<<< HEAD
=======
import { AuthProvider } from "./contexts/AuthContext"; // Added AuthProvider
import { Web3Provider } from "./contexts/Web3Context"; // Added Web3Provider

const queryClient = new QueryClient(); // Initializes React Query Client
>>>>>>> 48c5ce76b412ff55ccf0344def1980029ffe2fae

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Token = lazy(() => import("./pages/Token"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

<<<<<<< HEAD
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

=======
>>>>>>> 48c5ce76b412ff55ccf0344def1980029ffe2fae
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
<<<<<<< HEAD
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
=======
    <QueryClientProvider client={queryClient}> {/* Wrap app with React Query Provider */}
      <AuthProvider> {/* Added Auth Context Provider */}
        <Web3Provider> {/* Added Web3 Context Provider */}
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
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/token" element={<Token />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              <Footer role="contentinfo" />
            </div>
          </Router>
        </Web3Provider>
      </AuthProvider>
    </QueryClientProvider>
>>>>>>> 48c5ce76b412ff55ccf0344def1980029ffe2fae
  );
}

export default App;
