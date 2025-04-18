"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !username || !email || !tel || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("https://antony-massage-backend-production.up.railway.app/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          role: "user",
          tel
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-20">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[200%] md:max-w-md max-w-xs">
        <h1 className="text-3xl font-bold text-center mb-2">
          <span className="text-red-600">Dek</span>
          <span className="text-orange-500">Som</span>
          <span className="text-blue-500">Boon</span>
          <span className="block text-black text-xl font-bold">Massage</span>
        </h1>

        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-3">Register</h2>

        {error && <p className="text-red-600 text-center mb-3">{error}</p>}

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-600 mb-2">Telephone</label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-600 mb-2">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
            required
          />
        </div>

        <button
          onClick={handleRegister}
          className="hover:cursor-pointer w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-red-700 transition"
        >
          Register
        </button>

        <div className="mt-3 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-red-600 hover:underline font-medium">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
