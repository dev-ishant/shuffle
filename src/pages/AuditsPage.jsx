import { useState, useEffect, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ClipboardList, ArrowLeftRight, ShoppingCart, Plus, Trash2,
  CheckCircle2, XCircle, Clock, Sparkles, RefreshCw,
  Package, Activity, TrendingUp, Filter, Search,
  ChevronRight, AlertCircle
} from "lucide-react"
import { getAuditActivity, getAuditTransactions } from "@/api/audits"

// ── Date formatter ───────────────────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  })
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)   return "just now"
  if (mins  < 60)  return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  if (days  < 30)  return `${days}d ago`
  return formatDate(dateStr)
}

// ── Action config (icon, color, label) ──────────────────────────────────────
const ACTION_CONFIG = {
  listing_created: {
    icon:    Plus,
    color:   "from-sky-500 to-blue-600",
    badge:   "bg-sky-50 text-sky-700 border-sky-200",
    dot:     "bg-sky-400",
    label:   "Listing Created",
  },
  listing_deleted: {
    icon:    Trash2,
    color:   "from-red-400 to-rose-600",
    badge:   "bg-red-50 text-red-600 border-red-200",
    dot:     "bg-red-400",
    label:   "Listing Deleted",
  },
  offer_sent: {
    icon:    ArrowLeftRight,
    color:   "from-violet-500 to-purple-600",
    badge:   "bg-violet-50 text-violet-700 border-violet-200",
    dot:     "bg-violet-400",
    label:   "Offer Sent",
  },
  offer_accepted: {
    icon:    CheckCircle2,
    color:   "from-emerald-500 to-green-600",
    badge:   "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot:     "bg-emerald-400",
    label:   "Offer Accepted",
  },
  offer_rejected: {
    icon:    XCircle,
    color:   "from-red-400 to-rose-500",
    badge:   "bg-red-50 text-red-600 border-red-200",
    dot:     "bg-red-400",
    label:   "Offer Rejected",
  },
  order_sent: {
    icon:    ShoppingCart,
    color:   "from-amber-500 to-orange-500",
    badge:   "bg-amber-50 text-amber-700 border-amber-200",
    dot:     "bg-amber-400",
    label:   "Order Placed",
  },
  order_accepted: {
    icon:    CheckCircle2,
    color:   "from-emerald-500 to-teal-600",
    badge:   "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot:     "bg-emerald-400",
    label:   "Order Accepted",
  },
  order_rejected: {
    icon:    XCircle,
    color:   "from-red-400 to-rose-500",
    badge:   "bg-red-50 text-red-600 border-red-200",
    dot:     "bg-red-400",
    label:   "Order Rejected",
  },
}

function getConfig(action) {
  return ACTION_CONFIG[action] || {
    icon:  ClipboardList,
    color: "from-gray-400 to-gray-600",
    badge: "bg-gray-50 text-gray-600 border-gray-200",
    dot:   "bg-gray-400",
    label: action,
  }
}

// ── Transaction Card ─────────────────────────────────────────────────────────
function TransactionCard({ entry }) {
  const cfg = getConfig(entry.action)
  const Icon = cfg.icon
  const m = entry.meta || {}

  const isAccepted = entry.action.includes("accepted")
  const isOffer    = entry.action.includes("offer")
  const isOrder    = entry.action.includes("order")

  const counterpart = m.buyer_username || m.seller_username || "—"
  const role = m.buyer_username
    ? "Seller"   // we have a buyer, so we're the seller
    : m.seller_username
    ? "Buyer"    // we have a seller, so we're the buyer
    : "—"

  const payload = m.payload || {}

  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden
      ${isAccepted ? "border-emerald-100" : "border-red-100"}`}>
      {/* Accent stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${cfg.color}`} />

      <div className="p-5 pl-6 flex items-start gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cfg.color} flex items-center justify-center shadow-md shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-black text-gray-800">{cfg.label}</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${cfg.badge}`}>
              {cfg.label}
            </span>
            {/* Role pill */}
            <span className={`ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
              role === "Seller"
                ? "bg-teal-50 text-teal-700 border-teal-200"
                : "bg-indigo-50 text-indigo-700 border-indigo-200"
            }`}>
              You as {role}
            </span>
          </div>

          {/* Listing title */}
          {entry.listing && (
            <p className="text-[#3bb397] text-xs font-bold mb-1 truncate">{entry.listing.title}</p>
          )}
          {m.listing_title && !entry.listing && (
            <p className="text-gray-500 text-xs font-semibold mb-1 truncate">{m.listing_title}</p>
          )}

          {/* Counterpart */}
          <p className="text-xs text-gray-500 mb-3">
            {role === "Seller" ? "Buyer: " : "Seller: "}
            <span className="font-bold text-gray-700">{counterpart}</span>
            <span className="ml-2 text-[10px] text-gray-400">{timeAgo(entry.created_at)}</span>
          </p>

          {/* Payload details */}
          {isOffer && payload.offer_title && (
            <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-violet-700 flex items-center gap-1">
                <ArrowLeftRight className="w-3 h-3" /> Offering: {payload.offer_title}
              </span>
            </div>
          )}
          {isOrder && (payload.quantity || payload.total) && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-wrap gap-3">
              {payload.quantity && (
                <span className="text-xs font-bold text-emerald-700">Qty: {payload.quantity}</span>
              )}
              {payload.total && (
                <span className="text-xs font-bold text-emerald-700">₹{payload.total}</span>
              )}
              {payload.payment && (
                <span className="text-xs font-semibold text-emerald-600 uppercase">{payload.payment}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Activity Timeline Item ───────────────────────────────────────────────────
function ActivityItem({ entry, isLast }) {
  const cfg = getConfig(entry.action)
  const Icon = cfg.icon
  const m = entry.meta || {}

  return (
    <div className="flex gap-4">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${cfg.color} flex items-center justify-center shadow-sm`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {!isLast && <div className="w-0.5 flex-1 mt-2 bg-gray-100 min-h-[24px]" />}
      </div>

      {/* Content */}
      <div className={`flex-1 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-sm transition-shadow ${isLast ? "" : "mb-4"}`}>
        <div className="flex flex-wrap items-start gap-2 mb-1">
          <span className="text-sm font-black text-gray-800">{cfg.label}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border ${cfg.badge}`}>
            {entry.action.replace(/_/g, " ")}
          </span>
          <span className="ml-auto text-[10px] text-gray-400 shrink-0">{timeAgo(entry.created_at)}</span>
        </div>

        {/* Listing reference */}
        {(entry.listing?.title || m.listing_title || m.title) && (
          <p className="text-xs text-[#3bb397] font-semibold mb-1 truncate">
            {entry.listing?.title || m.listing_title || m.title}
          </p>
        )}

        {/* Meta details */}
        <p className="text-xs text-gray-400">{formatDate(entry.created_at)}</p>

        {(m.seller_username || m.buyer_username || m.offer_title) && (
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {m.offer_title    && <span><span className="font-bold text-gray-700">Offering:</span> {m.offer_title}</span>}
            {m.buyer_username && <span><span className="font-bold text-gray-700">Buyer:</span> {m.buyer_username}</span>}
            {m.seller_username && <span><span className="font-bold text-gray-700">Seller:</span> {m.seller_username}</span>}
            {m.quantity       && <span><span className="font-bold text-gray-700">Qty:</span> {m.quantity}</span>}
            {m.total          && <span><span className="font-bold text-gray-700">Total:</span> ₹{m.total}</span>}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function AuditSkeleton({ count = 4, timeline = false }) {
  return (
    <div className={timeline ? "space-y-4" : "space-y-3"}>
      {[...Array(count)].map((_, i) => (
        timeline ? (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-9 h-9 rounded-2xl bg-gray-200 animate-pulse" />
              {i < count - 1 && <div className="w-0.5 flex-1 bg-gray-100 mt-2 min-h-[24px]" />}
            </div>
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-4 animate-pulse mb-4">
              <div className="h-4 bg-gray-200 rounded-full w-2/5 mb-2" />
              <div className="h-3 bg-gray-100 rounded-full w-3/5 mb-1" />
              <div className="h-3 bg-gray-100 rounded-full w-1/3" />
            </div>
          </div>
        ) : (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 animate-pulse overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded-full w-2/5" />
              <div className="h-3 bg-gray-100 rounded-full w-3/5" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          </div>
        )
      ))}
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bg, border }) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-transform`}>
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center border ${border}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xl font-black text-gray-800">{value}</p>
        <p className="text-xs font-semibold text-gray-500">{label}</p>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AuditsPage() {
  const navigate = useNavigate()
  const [tab, setTab]                       = useState("transactions")
  const [transactions, setTransactions]     = useState([])
  const [activity,     setActivity]         = useState([])
  const [loading, setLoading]               = useState(true)
  const [error, setError]                   = useState(null)
  const [search, setSearch]                 = useState("")
  const [actionFilter, setActionFilter]     = useState("all")

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) { navigate("/login"); return }
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true); setError(null)
    try {
      const [tx, act] = await Promise.all([
        getAuditTransactions(),
        getAuditActivity(),
      ])
      setTransactions(tx)
      setActivity(act)
    } catch {
      setError("Could not load audit data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const accepted   = transactions.filter(e => e.action.includes("accepted")).length
    const listingAct = activity.filter(e => e.action.includes("listing")).length
    const offers     = activity.filter(e => e.action === "offer_sent").length
    const orders     = activity.filter(e => e.action === "order_sent").length
    return { accepted, listingAct, offers, orders }
  }, [transactions, activity])

  // ── Filtered lists ─────────────────────────────────────────────────────────
  const filteredTx = useMemo(() => {
    let list = transactions
    if (actionFilter !== "all") list = list.filter(e => e.action === actionFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(e =>
        (e.listing?.title || e.meta?.listing_title || e.meta?.title || "").toLowerCase().includes(q) ||
        (e.meta?.buyer_username || "").toLowerCase().includes(q) ||
        (e.meta?.seller_username || "").toLowerCase().includes(q)
      )
    }
    return list
  }, [transactions, actionFilter, search])

  const filteredAct = useMemo(() => {
    let list = activity
    if (actionFilter !== "all") list = list.filter(e => e.action === actionFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(e =>
        (e.listing?.title || e.meta?.listing_title || e.meta?.title || "").toLowerCase().includes(q) ||
        (e.meta?.buyer_username || "").toLowerCase().includes(q) ||
        (e.meta?.seller_username || "").toLowerCase().includes(q) ||
        e.action.replace(/_/g, " ").includes(q)
      )
    }
    return list
  }, [activity, actionFilter, search])

  const TX_FILTERS = [
    { id: "all",            label: "All Transactions" },
    { id: "order_accepted", label: "Orders Accepted" },
    { id: "order_rejected", label: "Orders Rejected" },
    { id: "offer_accepted", label: "Offers Accepted" },
    { id: "offer_rejected", label: "Offers Rejected" },
  ]

  const ACT_FILTERS = [
    { id: "all",             label: "All" },
    { id: "listing_created", label: "Created" },
    { id: "listing_deleted", label: "Deleted" },
    { id: "offer_sent",      label: "Offer Sent" },
    { id: "offer_accepted",  label: "Accepted" },
    { id: "offer_rejected",  label: "Rejected" },
    { id: "order_sent",      label: "Order Sent" },
    { id: "order_accepted",  label: "Order Accepted" },
    { id: "order_rejected",  label: "Order Rejected" },
  ]

  const activeFilters = tab === "transactions" ? TX_FILTERS : ACT_FILTERS

  return (
    <div className="min-h-screen bg-[#f4f6f8]">

      {/* ── HERO ── */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f2a3a] overflow-hidden">
        <div className="absolute top-[-60px] right-[-60px] w-96 h-96 rounded-full bg-[#3bb397]/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-40px] left-[10%] w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-[20%] right-[30%] w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
        <Sparkles className="absolute top-6 right-12 w-5 h-5 text-[#3bb397]/50" />
        <Sparkles className="absolute bottom-10 left-10 w-4 h-4 text-white/20" />

        <div className="relative max-w-[960px] mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#3bb397]" />
            <span className="text-[#3bb397] text-xs font-bold tracking-[0.2em] uppercase">Full Audit Trail</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                My <span className="text-[#3bb397]">Audits</span>
              </h1>
              <p className="text-gray-400 mt-1 text-sm font-medium">
                Complete history of all your transactions and activity
              </p>
            </div>
            <button
              onClick={fetchAll}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-medium self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {/* Stats row */}
          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
              <StatCard icon={TrendingUp}      label="Completed Deals"   value={stats.accepted}   color="text-[#3bb397]"  bg="bg-white/5"  border="border-white/10" />
              <StatCard icon={ArrowLeftRight}  label="Offers Sent"       value={stats.offers}     color="text-violet-400" bg="bg-white/5"  border="border-white/10" />
              <StatCard icon={ShoppingCart}    label="Orders Placed"     value={stats.orders}     color="text-amber-400"  bg="bg-white/5"  border="border-white/10" />
              <StatCard icon={Package}         label="Listing Actions"   value={stats.listingAct} color="text-sky-400"    bg="bg-white/5"  border="border-white/10" />
            </div>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-10 py-6">

        {/* Tab toggle */}
        <div className="flex items-center gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-5 w-fit">
          <button
            onClick={() => { setTab("transactions"); setActionFilter("all") }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === "transactions" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Transactions
          </button>
          <button
            onClick={() => { setTab("activity"); setActionFilter("all") }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === "activity" ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Activity className="w-4 h-4" /> Activity Log
          </button>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by listing title or username…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#3bb397] focus:ring-2 focus:ring-[#3bb397]/20 bg-white transition-all"
            />
          </div>

          {/* Action filter scrollable pills */}
          <div className="flex gap-1.5 bg-white rounded-xl p-1.5 border border-gray-100 shadow-sm overflow-x-auto shrink-0">
            <Filter className="w-4 h-4 text-gray-400 shrink-0 self-center ml-1 mr-0.5" />
            {activeFilters.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActionFilter(id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  actionFilter === id
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <AuditSkeleton count={5} timeline={tab === "activity"} />
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-500 font-semibold text-sm mb-3">{error}</p>
            <button onClick={fetchAll} className="text-[#3bb397] text-sm font-bold hover:underline">Try again</button>
          </div>
        ) : (
          <>
            {/* ── TRANSACTIONS TAB ── */}
            {tab === "transactions" && (
              filteredTx.length === 0 ? (
                <EmptyAudit
                  icon={TrendingUp}
                  title={actionFilter === "all" ? "No transactions yet" : `No ${actionFilter.replace(/_/g," ")} entries`}
                  desc="Completed deals (accepted/rejected orders and exchange offers) will show up here."
                  linkTo="/listings"
                  linkLabel="Browse Listings"
                />
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 font-semibold mb-3">{filteredTx.length} transaction{filteredTx.length !== 1 ? "s" : ""}</p>
                  {filteredTx.map((entry) => (
                    <TransactionCard key={entry.id} entry={entry} />
                  ))}
                </div>
              )
            )}

            {/* ── ACTIVITY LOG TAB ── */}
            {tab === "activity" && (
              filteredAct.length === 0 ? (
                <EmptyAudit
                  icon={Activity}
                  title={actionFilter === "all" ? "No activity yet" : `No "${actionFilter.replace(/_/g," ")}" entries`}
                  desc="Every action you take — creating listings, sending offers, accepting orders — will appear here."
                  linkTo="/create-listing"
                  linkLabel="Create a Listing"
                />
              ) : (
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-4">{filteredAct.length} event{filteredAct.length !== 1 ? "s" : ""}</p>
                  {filteredAct.map((entry, idx) => (
                    <ActivityItem key={entry.id} entry={entry} isLast={idx === filteredAct.length - 1} />
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyAudit({ icon: Icon, title, desc, linkTo, linkLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
      <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-lg font-black text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs mb-6 leading-relaxed">{desc}</p>
      <Link
        to={linkTo}
        className="flex items-center gap-2 px-6 py-3 bg-[#3bb397] text-white font-bold rounded-full hover:bg-[#2a9d82] transition-all shadow-md shadow-emerald-500/30"
      >
        {linkLabel} <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
