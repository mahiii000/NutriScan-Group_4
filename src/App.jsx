
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPage";
import ProductDetail from "./pages/ProductDetail";
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
          <Route path="/" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/login" element={<Login />} />

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
      </PreferencesProvider>
    </PinProvider>
  );
}

export default App;
