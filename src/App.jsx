import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";
import ProductDetail from "./pages/ProductDetail";
import Compare from "./pages/Compare";
import { PinProvider } from "./context/PinContext";

function App() {
  return (
    <PinProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route
          path="*"
          element={
            <main>
              <h1>Page not found</h1>
              <Link to="/">Back to home</Link>
            </main>
          }
        />
      </Routes>
    </PinProvider>
  );
}

export default App;