import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container py-5" style={{ minHeight: "80vh", fontFamily: "'Outfit', sans-serif" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-5">

              <div className="text-center mb-4">
                <div
                  className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mx-auto mb-3 shadow"
                  style={{ width: "80px", height: "80px", fontSize: "2.5rem", fontWeight: "bold" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="fw-bold mb-1">My Profile</h2>
                <p className="text-muted">View your account details and history</p>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-secondary mb-1">Full Name</label>
                <div className="fs-5 fw-medium text-dark bg-light p-3 rounded-3">{user.name}</div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-secondary mb-1">Email Address</label>
                <div className="fs-5 fw-medium text-dark bg-light p-3 rounded-3">{user.email}</div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-secondary mb-1">Account Type</label>
                <div className="fs-5 fw-medium text-dark bg-light p-3 rounded-3 text-capitalize">{user.userType}</div>
              </div>

              <hr className="my-5" />

              <div className="text-center">
                <p className="text-muted mb-3">Want to check your past purchases?</p>
                <Link to="/orders" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-medium shadow-sm">
                  View Recent Orders
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
