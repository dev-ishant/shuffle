import axiosInstance from "./axiosInstance"

// Full audit trail (all actions)
export const getAuditTrail = async () => {
  const res = await axiosInstance.get("/audits/")
  return res.data
}

// Only completed deals (accepted/rejected transactions)
export const getAuditTransactions = async () => {
  const res = await axiosInstance.get("/audits/transactions")
  return res.data
}

// Full activity log
export const getAuditActivity = async () => {
  const res = await axiosInstance.get("/audits/activity")
  return res.data
}
