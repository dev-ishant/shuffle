import { useState } from "react"
import { loginUser, registerUser } from "@/api/auth"
import { useNavigate } from "react-router-dom"

// Custom SVG Icons for Socials
const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
)

const GoogleIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
)

function SocialButton({ icon: Icon }) {
  return (
    <button className="w-10 h-10 rounded-full border border-gray-200/50 bg-white/40 flex items-center justify-center text-gray-600 hover:bg-white hover:text-[#2a9d82] hover:shadow-md transition-all">
      <Icon />
    </button>
  )
}

function LoginPage() {
  const [isLogin, setIsLogin] = useState(false)
  const navigate = useNavigate()

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginFieldErrors, setLoginFieldErrors] = useState({})

  // Register form state
  const [registerUsername, setRegisterUsername] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [registerFieldErrors, setRegisterFieldErrors] = useState({})

  // ── Validation helpers ──────────────────────────────────────────────
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateLoginField = (field, value) => {
    let error = ""
    if (field === "email") {
      if (!value.trim()) error = "Email is required."
      else if (!isValidEmail(value)) error = "Enter a valid email address."
    }
    if (field === "password" && !value) error = "Password is required."
    return error
  }

  const validateLogin = () => {
    const errors = {}
    const e = validateLoginField("email", loginEmail)
    if (e) errors.email = e
    const p = validateLoginField("password", loginPassword)
    if (p) errors.password = p
    setLoginFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateRegisterField = (field, value) => {
    let error = ""
    if (field === "username") {
      if (!value.trim()) error = "Username is required."
      else if (!/^[a-zA-Z]/.test(value.trim())) error = "Username must start with a letter."
      else if (value.trim().length < 3) error = "Username must be at least 3 characters."
      else if (!/^[a-zA-Z][a-zA-Z0-9_]+$/.test(value.trim())) error = "Only letters, numbers, and underscores allowed."
    }
    if (field === "email") {
      if (!value.trim()) error = "Email is required."
      else if (!isValidEmail(value)) error = "Enter a valid email address."
    }
    if (field === "password") {
      if (!value) error = "Password is required."
      else if (value.length < 6) error = "Password must be at least 6 characters."
    }
    return error
  }

  const validateRegister = () => {
    const errors = {}
    const u = validateRegisterField("username", registerUsername)
    if (u) errors.username = u
    const e = validateRegisterField("email", registerEmail)
    if (e) errors.email = e
    const p = validateRegisterField("password", registerPassword)
    if (p) errors.password = p
    setRegisterFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Login
  const handleLogin = async () => {
    setLoginError("")
    if (!validateLogin()) return
    setLoginLoading(true)
    try {
      await loginUser(loginEmail, loginPassword)
      navigate("/")
    } catch (error) {
      setLoginError(error.response?.data?.detail || "Login failed. Check your credentials.")
    } finally {
      setLoginLoading(false)
    }
  }

  // Handle Register
  const handleRegister = async () => {
    setRegisterError("")
    if (!validateRegister()) return
    setRegisterLoading(true)
    try {
      await registerUser(registerUsername, registerEmail, registerPassword)
      setIsLogin(true)
      setLoginEmail(registerEmail)
    } catch (error) {
      setRegisterError(error.response?.data?.detail || "Registration failed. Try again.")
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[#e8eaf0]">

      {/* Background Shapes */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#5ac7ae] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#2a9d82] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 pointer-events-none" />

      {/* Main Card */}
      <div className="relative w-full max-w-4xl h-[650px] md:h-[600px] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row">

        {/* Sign In Form */}
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full flex flex-col justify-center px-8 md:px-12 py-8 transition-all duration-700 ease-in-out
          ${isLogin ? "opacity-100 z-10 translate-x-0" : "opacity-0 z-0 pointer-events-none -translate-x-8 md:-translate-x-12"}`}>
          <div className="flex flex-col items-center text-center w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold text-[#1f826a] mb-6">Sign in</h2>

            <div className="flex gap-4 mb-6">
              <SocialButton icon={FacebookIcon} />
              <SocialButton icon={GoogleIcon} />
              <SocialButton icon={LinkedInIcon} />
            </div>

            <p className="text-xs text-gray-500 mb-6 font-medium">or use your account</p>

            {/* Error message */}
            {loginError && (
              <p className="text-red-500 text-xs mb-4 bg-red-50 px-4 py-2 rounded-xl w-full text-left">
                ⚠️ {loginError}
              </p>
            )}

            <div className="flex flex-col gap-3 w-full">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); setLoginFieldErrors((p) => ({ ...p, email: "" })) }}
                  onBlur={() => setLoginFieldErrors((p) => ({ ...p, email: validateLoginField("email", loginEmail) }))}
                  className={`w-full bg-white/60 border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ac7ae] focus:bg-white transition-all shadow-sm placeholder:text-gray-400 font-medium ${
                    loginFieldErrors.email ? "border-red-400 ring-1 ring-red-300" : "border-white/80"
                  }`}
                />
                {loginFieldErrors.email && <p className="text-red-500 text-xs mt-1 ml-1">{loginFieldErrors.email}</p>}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginFieldErrors((p) => ({ ...p, password: "" })) }}
                  onBlur={() => setLoginFieldErrors((p) => ({ ...p, password: validateLoginField("password", loginPassword) }))}
                  className={`w-full bg-white/60 border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ac7ae] focus:bg-white transition-all shadow-sm placeholder:text-gray-400 font-medium ${
                    loginFieldErrors.password ? "border-red-400 ring-1 ring-red-300" : "border-white/80"
                  }`}
                />
                {loginFieldErrors.password && <p className="text-red-500 text-xs mt-1 ml-1">{loginFieldErrors.password}</p>}
              </div>

              <p className="text-xs text-gray-500 text-left cursor-pointer hover:text-[#2a9d82] hover:underline mt-1 font-medium">
                Forgot your password?
              </p>

              <button
                onClick={handleLogin}
                disabled={loginLoading}
                className="mt-4 w-full bg-gradient-to-r from-[#3bb397] to-[#2a9d82] hover:from-[#2a9d82] hover:to-[#1f826a] text-white font-bold rounded-2xl py-3.5 shadow-lg shadow-[#3bb397]/30 transition-all hover:scale-[1.02] active:scale-[0.98] tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loginLoading ? "Signing in..." : "SIGN IN"}
              </button>

              <p className="md:hidden text-center text-sm text-gray-600 mt-4 font-medium">
                Don't have an account?{" "}
                <button onClick={() => setIsLogin(false)} className="text-[#2a9d82] font-bold hover:underline">
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className={`absolute top-0 right-0 w-full md:w-1/2 h-full flex flex-col justify-center px-8 md:px-12 py-8 transition-all duration-700 ease-in-out
          ${!isLogin ? "opacity-100 z-10 translate-x-0" : "opacity-0 z-0 pointer-events-none translate-x-8 md:translate-x-12"}`}>
          <div className="flex flex-col items-center text-center w-full max-w-sm mx-auto">
            <h2 className="text-3xl font-bold text-[#1f826a] mb-6">Create Account</h2>

            <div className="flex gap-4 mb-6">
              <SocialButton icon={FacebookIcon} />
              <SocialButton icon={GoogleIcon} />
              <SocialButton icon={LinkedInIcon} />
            </div>

            <p className="text-xs text-gray-500 mb-6 font-medium">or use your email for registration</p>

            {/* Error message */}
            {registerError && (
              <p className="text-red-500 text-xs mb-4 bg-red-50 px-4 py-2 rounded-xl w-full text-left">
                ⚠️ {registerError}
              </p>
            )}

            <div className="flex flex-col gap-3 w-full">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={registerUsername}
                  onChange={(e) => { setRegisterUsername(e.target.value); setRegisterFieldErrors((p) => ({ ...p, username: "" })) }}
                  onBlur={() => setRegisterFieldErrors((p) => ({ ...p, username: validateRegisterField("username", registerUsername) }))}
                  className={`w-full bg-white/60 border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ac7ae] focus:bg-white transition-all shadow-sm placeholder:text-gray-400 font-medium ${
                    registerFieldErrors.username ? "border-red-400 ring-1 ring-red-300" : "border-white/80"
                  }`}
                />
                {registerFieldErrors.username && <p className="text-red-500 text-xs mt-1 ml-1">{registerFieldErrors.username}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => { setRegisterEmail(e.target.value); setRegisterFieldErrors((p) => ({ ...p, email: "" })) }}
                  onBlur={() => setRegisterFieldErrors((p) => ({ ...p, email: validateRegisterField("email", registerEmail) }))}
                  className={`w-full bg-white/60 border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ac7ae] focus:bg-white transition-all shadow-sm placeholder:text-gray-400 font-medium ${
                    registerFieldErrors.email ? "border-red-400 ring-1 ring-red-300" : "border-white/80"
                  }`}
                />
                {registerFieldErrors.email && <p className="text-red-500 text-xs mt-1 ml-1">{registerFieldErrors.email}</p>}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  value={registerPassword}
                  onChange={(e) => { setRegisterPassword(e.target.value); setRegisterFieldErrors((p) => ({ ...p, password: "" })) }}
                  onBlur={() => setRegisterFieldErrors((p) => ({ ...p, password: validateRegisterField("password", registerPassword) }))}
                  className={`w-full bg-white/60 border rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#5ac7ae] focus:bg-white transition-all shadow-sm placeholder:text-gray-400 font-medium ${
                    registerFieldErrors.password ? "border-red-400 ring-1 ring-red-300" : "border-white/80"
                  }`}
                />
                {registerFieldErrors.password && <p className="text-red-500 text-xs mt-1 ml-1">{registerFieldErrors.password}</p>}
              </div>

              <button
                onClick={handleRegister}
                disabled={registerLoading}
                className="mt-4 w-full bg-gradient-to-r from-[#3bb397] to-[#2a9d82] hover:from-[#2a9d82] hover:to-[#1f826a] text-white font-bold rounded-2xl py-3.5 shadow-lg shadow-[#3bb397]/30 transition-all hover:scale-[1.02] active:scale-[0.98] tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {registerLoading ? "Creating account..." : "SIGN UP"}
              </button>

              <p className="md:hidden text-center text-sm text-gray-600 mt-4 font-medium">
                Already have an account?{" "}
                <button onClick={() => setIsLogin(true)} className="text-[#2a9d82] font-bold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Sliding Overlay */}
        <div className={`hidden md:block absolute top-0 left-0 w-1/2 h-full z-20 transition-transform duration-700 ease-in-out ${isLogin ? "translate-x-full" : "translate-x-0"}`}>
          <div className="relative w-full h-full bg-gradient-to-br from-[#3bb397]/90 to-[#2a9d82]/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center text-white border-x border-white/20 shadow-[0_0_40px_rgba(59,179,151,0.4)] overflow-hidden">

            <div className="absolute top-[-50px] left-[-50px] w-56 h-56 bg-white/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-[-50px] right-[-50px] w-56 h-56 bg-white/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8 shadow-xl backdrop-blur-md border border-white/30">
                <span className="text-white text-4xl font-black">S</span>
              </div>

              <div className="h-[220px] flex flex-col items-center justify-start">
                <h2 className="text-4xl font-bold mb-6 drop-shadow-md tracking-tight">
                  {isLogin ? "Hello, Friend!" : "Welcome Back!"}
                </h2>
                <p className="text-white/90 mb-10 leading-relaxed max-w-[260px] drop-shadow-sm font-medium text-sm">
                  {isLogin
                    ? "Enter your personal details and start your journey with us"
                    : "To keep connected with us please login with your personal info"}
                </p>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="border-2 border-white/70 hover:bg-white hover:text-[#2a9d82] rounded-full px-14 py-3.5 font-bold tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  {isLogin ? "SIGN UP" : "SIGN IN"}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage