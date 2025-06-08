export default function AdminTestPage() {
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
      <div style={{ textAlign: "center" }}>
        <h1>Admin Test Page Works!</h1>
        <p>If you can see this, routing is working.</p>
        <p>Current time: {new Date().toLocaleString()}</p>
        <a
          href="/admin/login"
          style={{
            color: "#3b82f6",
            textDecoration: "underline",
            display: "block",
            marginTop: "1rem",
          }}
        >
          Go to Login Page
        </a>
      </div>
    </div>
  )
}
