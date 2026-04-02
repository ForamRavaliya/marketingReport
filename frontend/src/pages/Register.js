import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const register = async () => {
   try {
     await axios.post(
       "http://localhost:5000/api/auth/client-register",
       { name: "XYZ",email, password }
     );

     alert("Registered successfully ✅");
     navigate("/");

   } catch(err) {
     console.log(err);
         alert(err.response?.data?.msg || "Register failed ❌");
       }
 };

  return (
    <div style={{ padding: 40 }}>
      <h2>Register</h2>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      /><br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      /><br/><br/>

      <button onClick={register}>Register</button>
    </div>
  );
}