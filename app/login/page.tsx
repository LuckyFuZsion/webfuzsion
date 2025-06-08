export default function LoginPage() {
  return (
    <div style={{ padding: "20px", backgroundColor: "#1a1a1a", color: "white", minHeight: "100vh" }}>
      <h1>Admin Login</h1>
      <p>Enter your admin credentials to access the dashboard.</p>
      <p>Time: {new Date().toLocaleString()}</p>

      <form action="/api/admin/auth" method="POST" style={{ marginTop: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Username:</label>
          <input
            type="text"
            name="username"
            required
            style={{
              padding: "8px",
              width: "200px",
              backgroundColor: "#333",
              color: "white",
              border: "1px solid #555",
              borderRadius: "4px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
          <input
            type="password"
            name="password"
            required
            style={{
              padding: "8px",
              width: "200px",
              backgroundColor: "#333",
              color: "white",
              border: "1px solid #555",
              borderRadius: "4px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
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

      <div style={{ marginTop: "20px" }}>
        <a href="/test-basic" style={{ color: "#3b82f6" }}>
          Back to Test
        </a>
        {" | "}
        <a href="/login-debug" style={{ color: "#3b82f6" }}>
          Debug Login
        </a>
      </div>
    </div>
  )
}
