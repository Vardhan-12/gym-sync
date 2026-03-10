import { useState } from "react";
import { registerUser } from "../authService";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {

      await registerUser({
        name,
        email,
        password
      });

      alert("Registration successful");

      navigate("/login");

    } catch (error) {
      
      const message =
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.msg ||
    "Registration failed";

  alert(message);

    }
  }

  return (
    <div>

      <h2>Register</h2>

      <form onSubmit={handleRegister}>

        <div>
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <button type="submit">Register</button>

      </form>

    </div>
  );
}

export default Register;