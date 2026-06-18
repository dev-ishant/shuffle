import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Bell, ArrowLeftRight, ShoppingCart, CheckCheck,
  MapPin, Sparkles, RefreshCw, ChevronRight,
  CheckCircle2, XCircle, Clock, Check, X
} from "lucide-react"
import {
  getMyNotifications, markAsRead, markAllRead,
  acceptNotification, rejectNotification
} from "@/api/notifications"

// ── Real date+time formatter ────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr)
  // Backend stores UTC, convert to local
  return d.toLocaleString("en-IN", {
    day:    "2-digit",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

// ── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === "accepted") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" /> Accepted
    </span>
  )
  if (status === "rejected") return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-600 border border-red-200">
      <XCircle className="w-3 h-3" /> Rejected
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200">
      <Clock className="w-3 h-3" /> Pending
    </span>
  )
}

// ── Notification Card ───────────────────────────────────────────────────────
function NotifCard({ notif, onRead, onAccept, onReject }) {
  const [acting, setActing] = useState(null) // "accept" | "reject"
  const isExchange = notif.type === "exchange_offer"
  const isPending  = notif.status === "pending"
  const p = notif.payload || {}

  async function handleAccept(e) {
    e.stopPropagation()
    setActing("accept")
    await onAccept(notif.id)
    setActing(null)
  }

  async function handleReject(e) {
    e.stopPropagation()
    setActing("reject")
    await onReject(notif.id)
    setActing(null)
  }

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md
        ${notif.is_read ? "border-gray-100" : "border-l-4 border-l-[#3bb397] border-gray-100 shadow-sm"}`}
      onClick={() => !notif.is_read && isPending && onRead(notif.id)}
    >
      {/* Unread dot */}
      {!notif.is_read && (
        <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#3bb397] shadow-sm shadow-emerald-400/50" />
      )}

      <div className="p-5 flex items-start gap-4">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
          ${isExchange
            ? "bg-gradient-to-br from-pink-500 to-fuchsia-600"
            : "bg-gradient-to-br from-emerald-500 to-green-600"
          }`}>
          {isExchange
            ? <ArrowLeftRight className="w-5 h-5 text-white" />
            : <ShoppingCart className="w-5 h-5 text-white" />
          }
        </div>

        <div className="flex-1 min-w-0">
          {/* Title + status */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-sm font-black text-gray-800 leading-snug">
              {isExchange ? "Exchange Offer Received" : "Order Request Received"}
            </p>
            <StatusBadge status={notif.status} />
          </div>

          {/* From · listing · time */}
          <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500 mb-3">
            <span>From</span>
            <span className="font-bold text-gray-700">{notif.sender?.username || "a user"}</span>
            <span>·</span>
            <span className="text-[#3bb397] font-semibold">{notif.listing?.title}</span>
            <span className="ml-auto text-[10px] text-gray-400 flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {formatDate(notif.created_at)}
            </span>
          </div>

          {/* Payload details */}
          {isExchange ? (
            <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-3 space-y-1 mb-3">
              <p className="text-xs font-bold text-fuchsia-700 flex items-center gap-1">
                <ArrowLeftRight className="w-3 h-3" /> Offering: {p.offer_title}
              </p>
              {p.offer_desc && (
                <p className="text-xs text-gray-500 leading-relaxed">{p.offer_desc}</p>
              )}
              {p.message && (
                <p className="text-xs text-gray-600 italic border-t border-fuchsia-100 pt-1 mt-1">
                  "{p.message}"
                </p>
              )}
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-wrap gap-x-4 gap-y-1 mb-3">
              <span className="text-xs font-bold text-emerald-700">
                Qty: {p.quantity} · ₹{p.total}
              </span>
              <span className="text-xs font-semibold text-emerald-600 uppercase">{p.payment}</span>
              {p.address && (
                <span className="text-xs text-gray-500 flex items-center gap-1 w-full">
                  <MapPin className="w-3 h-3 shrink-0" />{p.address}
                </span>
              )}
            </div>
          )}

          {/* Accept / Reject — only shown when pending */}
          {isPending && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleAccept}
                disabled={!!acting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {acting === "accept"
                  ? <><span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Accepting…</>
                  : <><Check className="w-3.5 h-3.5" /> Accept</>
                }
              </button>
              <button
                onClick={handleReject}
                disabled={!!acting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-red-50 text-red-500 border border-red-200 hover:border-red-300 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {acting === "reject"
                  ? <><span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" /> Rejecting…</>
                  : <><X className="w-3.5 h-3.5" /> Reject</>
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AlertsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 animate-pulse">
          <div className="w-11 h-11 rounded-2xl bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded-full w-2/3" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            <div className="h-12 bg-gray-100 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AlertsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [filter, setFilter]               = useState("all")

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) { navigate("/login"); return }
    fetchNotifs()
  }, [])

  async function fetchNotifs() {
    setLoading(true); setError(null)
    try {
      setNotifications(await getMyNotifications())
    } catch {
      setError("Could not load notifications. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRead(id) {
    await markAsRead(id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
  }

  async function handleAccept(id) {
    await acceptNotification(id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, status: "accepted", is_read: true } : n))
  }

  async function handleReject(id) {
    await rejectNotification(id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, status: "rejected", is_read: true } : n))
  }

  async function handleMarkAll() {
    await markAllRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const filtered = notifications.filter((n) => {
    if (filter === "unread")   return !n.is_read
    if (filter === "exchange") return n.type === "exchange_offer"
    if (filter === "order")    return n.type === "order_request"
    if (filter === "pending")  return n.status === "pending"
    return true
  })

  const unreadCount   = notifications.filter((n) => !n.is_read).length
  const pendingCount  = notifications.filter((n) => n.status === "pending").length

  const FILTERS = [
    { id: "all",      label: "All" },
    { id: "pending",  label: `Pending${pendingCount ? ` (${pendingCount})` : ""}` },
    { id: "unread",   label: `Unread${unreadCount ? ` (${unreadCount})` : ""}` },
    { id: "exchange", label: "Exchange Offers" },
    { id: "order",    label: "Order Requests" },
  ]

  return (
    <div className="min-h-screen bg-[#f4f6f8]">

      {/* ── HERO ── */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#134e4a] overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-96 h-96 rounded-full bg-[#3bb397]/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-40px] left-[10%] w-72 h-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <Sparkles className="absolute top-6 right-12 w-5 h-5 text-[#3bb397]/50" />

        <div className="relative max-w-[800px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#3bb397]" />
            <span className="text-[#3bb397] text-xs font-bold tracking-[0.2em] uppercase">Notifications</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                My <span className="text-[#3bb397]">Alerts</span>
              </h1>
              <p className="text-gray-400 mt-1 text-sm font-medium">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                {pendingCount > 0 && ` · ${pendingCount} pending action`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchNotifs}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3bb397]/20 hover:bg-[#3bb397]/30 text-[#3bb397] text-xs font-bold border border-[#3bb397]/30 transition-all"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-10 py-6">

        {/* Filter tabs */}
        <div className="flex gap-1.5 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm mb-6 overflow-x-auto">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                ${filter === id
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <AlertsSkeleton />
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
            <p className="text-red-500 font-semibold text-sm mb-3">{error}</p>
            <button onClick={fetchNotifs} className="text-[#3bb397] text-sm font-bold hover:underline">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-5">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-black text-gray-700 mb-2">
              {filter === "all" ? "No notifications yet" : `No ${filter} notifications`}
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mb-6 leading-relaxed">
              When someone sends you an exchange offer or places an order, you'll see it here.
            </p>
            <Link
              to="/listings"
              className="flex items-center gap-2 px-6 py-3 bg-[#3bb397] text-white font-bold rounded-full hover:bg-[#2a9d82] transition-all shadow-md shadow-emerald-500/30"
            >
              Browse Listings <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((notif) => (
              <NotifCard
                key={notif.id}
                notif={notif}
                onRead={handleRead}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
