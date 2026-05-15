const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token")
  const headers = { ...options.headers }
  if (token) headers["Authorization"] = `Bearer ${token}`
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json"
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || "Something went wrong")
  }
  return res.json()
}

export async function getListings(params = {}) {
  const query = new URLSearchParams()
  if (params.search) query.set("search", params.search)
  if (params.category) query.set("category", params.category)
  if (params.listing_type) query.set("listing_type", params.listing_type)
  if (params.page) query.set("page", params.page)
  if (params.limit) query.set("limit", params.limit)
  const qs = query.toString()
  return request(`/listings${qs ? `?${qs}` : ""}`)
}

export async function getListing(id) {
  return request(`/listings/${id}`)
}

export async function createListing(data) {
  const body = data instanceof FormData ? data : JSON.stringify(data)
  return request("/listings", {
    method: "POST",
    body,
  })
}

export async function updateListing(id, data) {
  const body = data instanceof FormData ? data : JSON.stringify(data)
  return request(`/listings/${id}`, {
    method: "PUT",
    body,
  })
}

export async function deleteListing(id) {
  return request(`/listings/${id}`, { method: "DELETE" })
}

export async function getUserListings() {
  return request("/listings/my")
}

export async function getProfile() {
  return request("/auth/profile")
}
