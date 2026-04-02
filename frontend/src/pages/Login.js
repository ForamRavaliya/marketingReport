import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/client-login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login success ✅");
      navigate("/dashboard");

    } catch (err) {
      alert("Invalid login ❌");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f0f2f5"
    }}>

      <div style={{
        width: 350,
        padding: 30,
        borderRadius: 15,
        background: "#fff",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}>

        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={login} style={btnStyle}>
          Login
        </button>

        <p style={{ textAlign: "center", marginTop: 10 }}>
          New user? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 8,
  border: "1px solid #ccc"
};

const btnStyle = {
  width: "100%",
  padding: 10,
  marginTop: 15,
  background: "black",
  color: "white",
  borderRadius: 8
};