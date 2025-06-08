export default function SimpleLoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "2rem",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "400px",
          border: "1px solid #444",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Simple Admin Login</h1>

        <form method="POST" action="/api/admin/auth">
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Username</label>
            <input
              type="text"
              name="username"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#333",
                color: "white",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Password</label>
            <input
              type="password"
              name="password"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "4px",
                border: "1px solid #555",
                backgroundColor: "#333",
                color: "white",
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#888" }}>
          <p>This is a server-side rendered page</p>
          <a href="/admin/test" style={{ color: "#3b82f6" }}>
            Test Page
          </a>
        </div>
      </div>
    </div>
  )
}
