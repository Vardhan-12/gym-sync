import { useState, useContext } from "react";
import { loginUser } from "../authService";
import { AuthContext } from "../authContext";
import { useNavigate } from "react-router-dom";

function Login() {

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

async function handleLogin(e) {
  e.preventDefault();

  try {
    const data = await loginUser({
      email,
      password
    });

    console.log("LOGIN RESPONSE:", data);

    // check token
    const token = data.accessToken;

    if (!token) {
      alert("Token missing from login response");
      return;
    }

    // store token
    localStorage.setItem("token", token);

    // store user
    setUser(data.user);

    console.log("TOKEN SAVED:", localStorage.getItem("token"));

    navigate("/");

  } catch (error) {
    console.log(error);
    alert("Invalid email or password");
  }
}

  return (
    <div>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>

      </form>

    </div>
  );
}

export default Login;