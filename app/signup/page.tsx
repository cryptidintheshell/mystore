"use client";

import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRef, useState } from "react"
import Image from "next/image"
import styles from "./styles.module.css"
import { createUser } from "@/lib/actions";

export default function Signup() {
  // form variables
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isViewPassword, setIsViewPassword] = useState(false);
  const passwordField = useRef();

  const handleViewPassword = () => setIsViewPassword(!isViewPassword);
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "username") setUsername(value);
    else if (name === "password") setPassword(value);
  }

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createUser(email, password, username);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={` ${styles.background_gradient} w-full h-screen flex justify-center items-center bg-zinc-50 p-4`}>

      <div className="flex flex-col md:flex-row gap-10 bg-white p-8 w-fit h-fit md:h-[600px] rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden min-w-150 md:block relative flex-1 rounded-xl overflow-hidden bg-zinc-100 border border-slate-100">
          <Image 
            src="/photos/image.jpg" 
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="store owner" 
            fill 
            className="object-cover"
            priority
          />
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col justify-center flex-1 gap-6 py-4 min-w-100">
          <div className="space-y-1">
            <p className="text-slate-600">
              Manage your store efficiently with
              <span className="font-bold text-green-700"> MyStore</span>
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900">Create an account</h1>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 select-none">Email address</label>
              <input 
                value={email}
                onChange={handleTextChange} 
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" 
                type="email" 
                name="email"
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 select-none">Username</label>
              <input 
                value={username}
                onChange={handleTextChange}
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" 
                type="text" 
                name="username"
                placeholder="your_username"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 select-none">Password</label>
              <div className="relative flex items-center">
                <input 
                  value={password}
                  ref={passwordField} 
                  onChange={handleTextChange}
                  className="w-full border border-slate-300 rounded-xl p-3 pr-11 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" 
                  type={isViewPassword ? "text" : "password"} 
                  name="password"
                  required
                />
                <button 
                  type="button"
                  onClick={handleViewPassword} 
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {isViewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className={`bg-green-600 text-white w-full font-semibold rounded-xl p-3 mt-2 hover:bg-green-700 active:scale-[0.98] shadow-lg shadow-green-200 transition-all cursor-pointer ${loading ? "opacity-50 cursor-not-allowed" : ""}`} 
            type="submit"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
          <div className="flex justify-between">
            <Link href="/login" className="px-5 py-1 text-green-700 hover:underline hover:cursor-pointer">Login here</Link>
            <Link href="/forgot-password" className="px-5 py-1 text-green-700 hover:underline hover:cursor-pointer">Forgot password</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
