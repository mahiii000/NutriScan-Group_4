import { Link, NavLink } from "react-router-dom";
import { usePin } from "../context/PinContext";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

function linkClass({ isActive }) {
  return `navbar__link ${isActive ? "navbar__link--active" : ""}`;
}

function Navbar() {
  const { pinnedCodes } = usePin();
  const { user, logout } = useAuth();

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

          <NavLink to="/preferences" className={linkClass}>
            Preferences
          </NavLink>

          {user ? (
            <>
              <span className="navbar__user">Hi, {user.name}</span>
              <button className="navbar__logout" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
