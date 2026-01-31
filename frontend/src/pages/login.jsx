// import { useState } from "react";
// import { loginUser } from "../api/auth";
// import { useNavigate } from "react-router-dom";

// import { AuthContext } from "../context/authContext";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//     const { login } = useContext(AuthContext);
//       const navigate = useNavigate();
//        const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await loginUser(form);
//     login(res.data.token);
//     navigate("/");
// }
// return(
//     <div className="authContainer">
//      <form onSubmit={handleSubmit}>
//         <input name="email" placeholder="Email" onChange={handleChange} />
//         <input name="password" type="password" placeholder="Password" onChange={handleChange} />
//         <button>Login</button>
//       </form></div>
// )

// };

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">
          Notera
        </h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            type="button"
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

