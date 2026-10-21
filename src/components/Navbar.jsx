import { Link, NavLink } from "react-router-dom";
import { usePin } from "../context/PinContext";
import "./Navbar.css";

function linkClass({ isActive }) {
  return `navbar__link ${isActive ? "navbar__link--active" : ""}`;
}

function Navbar() {
  const { pinnedCodes } = usePin();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          NutriScan<span className="navbar__dot">.</span>
        </Link>

        <nav className="navbar__links" aria-label="Main navigation">
          <NavLink to="/" end className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/compare" className={linkClass}>
            Compare
            {pinnedCodes.length > 0 && (
              <span className="navbar__badge">{pinnedCodes.length}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;