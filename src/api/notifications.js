import axiosInstance from "./axiosInstance"

export const sendExchangeOffer = async (data) => {
  const res = await axiosInstance.post("/notifications/exchange-offer", data)
  return res.data
}

export const sendOrderRequest = async (data) => {
  const res = await axiosInstance.post("/notifications/order-request", data)
  return res.data
}

export const getMyNotifications = async () => {
  const res = await axiosInstance.get("/notifications/me")
  return res.data
}

export const getSentRequests = async () => {
  const res = await axiosInstance.get("/notifications/sent")
  return res.data
}

export const getUnreadCount = async () => {
  const res = await axiosInstance.get("/notifications/me/unread-count")
  return res.data.count
}

export const markAsRead = async (id) => {
  await axiosInstance.patch(`/notifications/${id}/read`)
}

export const markAllRead = async () => {
  await axiosInstance.patch("/notifications/me/read-all")
}

export const acceptNotification = async (id) => {
  await axiosInstance.patch(`/notifications/${id}/accept`)
}

export const rejectNotification = async (id) => {
  await axiosInstance.patch(`/notifications/${id}/reject`)
}
