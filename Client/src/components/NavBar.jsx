import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("search") || "");
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 py-3 sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-4" to="/" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <span className="text-primary">Shop</span>EZ
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Centered Search Bar */}
          <div className="mx-auto" style={{ width: "100%", maxWidth: "500px" }}>
            <form className="d-flex w-100 my-2 my-lg-0" onSubmit={handleSearch}>
              <input
                className="form-control rounded-pill px-4 bg-light border-0 shadow-sm w-100"
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <ul className="navbar-nav ms-auto align-items-center gap-4">
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium position-relative" to="/cart">
                Cart
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm" style={{ fontSize: "0.65rem" }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium" to="/orders">Orders</Link>
            </li>

            <li className="nav-item ms-lg-3 d-flex align-items-center gap-3">
              {!user ? (
                <Link className="btn btn-primary rounded-pill px-4 fw-medium shadow-sm" to="/login">
                  Login
                </Link>
              ) : (
                <>
                  {user.userType === 'admin' && (
                    <Link to="/admin" className="btn btn-outline-dark rounded-pill px-3 py-1 fw-medium shadow-sm btn-sm me-2">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <div
                      className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center shadow-sm"
                      style={{ width: "42px", height: "42px", fontWeight: "bold", fontSize: "1.2rem", cursor: "pointer" }}
                      title={user.name}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </Link>
                  <button onClick={logout} className="btn btn-outline-danger rounded-pill px-3 py-1 fw-medium shadow-sm btn-sm">
                    Logout
                  </button>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;