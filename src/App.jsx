import ErrorBoundary from "./components/ErrorBoundary";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";
import { lazy, Suspense } from "react";

const ProductDetail = lazy(() => import("./pages/ProductDetail"));
import Compare from "./pages/Compare";
import Preferences from "./pages/Preferences";
import { PinProvider } from "./context/PinContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import Login from "./pages/Login";

function App() {
  return (
    <PinProvider>
      <PreferencesProvider>
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <SearchPage />
              </ErrorBoundary>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Suspense fallback={<p>Loading product...</p>}>
                <ProductDetail />
              </Suspense>
            }
          />
          <Route path="/compare" element={<Compare />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="*"
            element={
              <main
                style={{
                  maxWidth: "1100px",
                  margin: "0 auto",
                  padding: "3rem 1.5rem",
                  textAlign: "center",
                }}
              >
                <h1 style={{ color: "#1f3d2b", marginBottom: "0.5rem" }}>
                  Page not found
                </h1>
                <p style={{ color: "#5b6b60", marginBottom: "1.5rem" }}>
                  The page you're looking for doesn't exist.
                </p>
                <Link
                  to="/"
                  style={{
                    display: "inline-block",
                    padding: "0.6rem 1.2rem",
                    border: "1px solid #1f3d2b",
                    borderRadius: "999px",
                    color: "#1f3d2b",
                    textDecoration: "none",
                  }}
                >
                  Back to home
                </Link>
              </main>
            }
          />
        </Routes>
      </PreferencesProvider>
    </PinProvider>
  );
}

export default App;
