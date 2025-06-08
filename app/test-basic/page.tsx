export default function TestPage() {
  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <h1>Basic Test Page</h1>
      <p>If you can see this, Next.js routing is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>

      <div style={{ marginTop: "20px" }}>
        <h2>Test Links:</h2>
        <ul>
          <li>
            <a href="/login" style={{ color: "#3b82f6" }}>
              Go to Login
            </a>
          </li>
          <li>
            <a href="/admin" style={{ color: "#3b82f6" }}>
              Go to Admin (will redirect to login)
            </a>
          </li>
          <li>
            <a href="/admin/simple" style={{ color: "#3b82f6" }}>
              Go to Simple Admin (no auth required)
            </a>
          </li>
        </ul>
      </div>

      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#e0e0e0", borderRadius: "5px" }}>
        <h3>Debug Info:</h3>
        <p>If any of the above links show a blank page, check the browser console for errors.</p>
        <p>Press F12 → Console tab to see any JavaScript errors.</p>
      </div>
    </div>
  )
}
