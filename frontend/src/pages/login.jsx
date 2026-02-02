import { useState } from "react";
import { loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext";
import React,  { useContext } from "react";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
    const { login } = useContext(AuthContext);
      const navigate = useNavigate();
       const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);
    login(res.data.token);
    navigate("/");
}
return(
    <div className="authContainer">
     <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button>Login</button>
      </form></div>
)

};

