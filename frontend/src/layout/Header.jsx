function Header() {
  return (
    <div style={{
      height: "60px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 30px",
      borderBottom: "1px solid #ddd",
      background: "#fff"
    }}>
      
      <h2>GymSync</h2>

      <div style={{display:"flex", gap:"25px"}}>
        <span>About</span>
        <span>Feedback</span>
        <span>🔔</span>
      </div>

    </div>
  );
}

export default Header;