function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto w-100">
      <div className="container text-center">
        <h5 className="fw-bold mb-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Shop<span className="text-primary">EZ</span>
        </h5>
        <p className="mb-0 opacity-50 small">© {new Date().getFullYear()} ShopEZ. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
