import axiosInstance from "./axiosInstance"

// Register a new user
export const registerUser = async (name, email, password) => {
  const response = await axiosInstance.post("/auth/register", {
    name,
    email,
    password,
  })
  return response.data
}

// Login user and store token
export const loginUser = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password,
  })

  // Store token in localStorage
  const token = response.data.access_token
  localStorage.setItem("access_token", token)

  return response.data
}

// Get current logged in user
export const getMe = async () => {
  const response = await axiosInstance.get("/auth/me")
  return response.data
}

// Logout - just remove token
export const logoutUser = () => {
  localStorage.removeItem("access_token")
}