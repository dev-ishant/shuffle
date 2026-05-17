import axiosInstance from "./axiosInstance"

// Get all listings
export const getListings = async () => {
  const response = await axiosInstance.get("/listings")
  return response.data
}

// Get single listing by ID
export const getListingById = async (id) => {
  const response = await axiosInstance.get(`/listings/${id}`)
  return response.data
}

// Create a new listing with images
export const createListing = async (formData) => {
  const response = await axiosInstance.post("/listings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

// Delete a listing
export const deleteListing = async (id) => {
  const response = await axiosInstance.delete(`/listings/${id}`)
  return response.data
}

// Get current logged-in user's profile
export const getProfile = async () => {
  const response = await axiosInstance.get("/auth/me")
  return response.data
}

// Get listings belonging to the current logged-in user
export const getUserListings = async () => {
  const response = await axiosInstance.get("/listings/me/listings")
  return response.data
}