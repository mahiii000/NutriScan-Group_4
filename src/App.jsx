import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Compare from "./pages/Compare";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
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
  );
}

export default App;