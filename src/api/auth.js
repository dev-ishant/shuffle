import axiosInstance from "./axiosInstance"

// Register a new user
export const registerUser = async (username, email, password) => {
  const response = await axiosInstance.post("/auth/register", {
    username,
    email,
    password,
  })
  return response.data
}

// Login user and store token
export const loginUser = async (email, password) => {
  const formData = new URLSearchParams()
  formData.append("username", email)
  formData.append("password", password)

  const response = await axiosInstance.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  const token = response.data.access_token
  localStorage.setItem("access_token", token)

  return response.data
}

// Get current logged in user
export const getMe = async () => {
  const response = await axiosInstance.get("/auth/me")
  return response.data
}

// Update current user profile (username)
export const updateMe = async (username) => {
  const response = await axiosInstance.put("/auth/me", { username })
  return response.data
}

// Logout - just remove token
export const logoutUser = () => {
  localStorage.removeItem("access_token")
}