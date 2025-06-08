export default function SimpleAdminPage() {
  return (
    <div style={{ padding: "20px", backgroundColor: "#1a1a1a", color: "white", minHeight: "100vh" }}>
      <h1>Simple Admin Page</h1>
      <p>If you can see this, the admin page is working!</p>
      <p>Time: {new Date().toLocaleString()}</p>

      <div style={{ marginTop: "20px" }}>
        <a href="/test-basic" style={{ color: "#3b82f6" }}>
          Back to Test
        </a>
      </div>
    </div>
  )
}
