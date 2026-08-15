import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaHotel, FaStar, FaCheckCircle, FaTimesCircle, FaArrowRight } from "react-icons/fa";
import { initiateStayPayment } from "./initiateStayPayment";
import "./StayOwnersPlan.css";

const API = process.env.REACT_APP_API_URL;

// Logged-in owner's phone (last 10 digits), or "" if not logged in
const getOwnerPhone = () => {
  try {
    const digits = (localStorage.getItem("phoneNumber") || "").replace(/\D/g, "");
    return digits.length >= 10 ? digits.slice(-10) : "";
  } catch {
    return "";
  }
};

// Build the benefit list shown on each plan card
const buildBenefits = (p) => {
  const list = [
    { ic: "🏠", text: p.maxListings ? `${p.maxListings} property listing${p.maxListings > 1 ? "s" : ""}` : "Unlimited listings" },
    { ic: "📅", text: p.durationDays ? `Valid for ${p.durationDays} days` : "No expiry" },
  ];
  if (p.featured) list.push({ ic: "⭐", text: "Featured placement" });
  if (p.featured || p.popular) list.push({ ic: "🚀", text: "Priority visibility" });
  return list;
};

const StayOwnersPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sub, setSub] = useState(null);
  const [subActive, setSubActive] = useState(false);
  const [paying, setPaying] = useState("");
  const [banner, setBanner] = useState(null); // {type, text}

  const phone = getOwnerPhone();

  // PayU redirect status (?status=success|failure) — kept for direct landings
  useEffect(() => {
    const status = new URLSearchParams(location.search).get("status");
    if (status === "success") setBanner({ type: "success", text: "Payment successful — your stay plan is now active." });
    else if (status === "failure") setBanner({ type: "failure", text: "Payment failed or was cancelled. Please try again." });
  }, [location.search]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/stay-plans`);
      setPlans(res.data?.plans || []);
    } catch {
      /* keep empty */
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    if (!phone) return;
    try {
      const res = await axios.get(`${API}/stay-subscription/${phone}`);
      setSub(res.data?.subscription || null);
      setSubActive(!!res.data?.active);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buy = async (plan) => {
    if (!phone) {
      setBanner({ type: "failure", text: "Please log in to buy a plan." });
      return;
    }
    try {
      setPaying(plan._id);
      await initiateStayPayment({
        phoneNumber: phone,
        planId: plan._id,
        planName: plan.name,
        amount: plan.price,
        maxListings: plan.maxListings,
        durationDays: plan.durationDays,
        featured: plan.featured,
      });
      // initiateStayPayment redirects to PayU; nothing runs after this.
    } catch (err) {
      setPaying("");
      setBanner({ type: "failure", text: err?.message || "Could not start payment. Please try again." });
    }
  };

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  // Only ONE plan is highlighted: the first plan flagged popular by admin
  const recommendedId = (plans.find((p) => p.popular) || {})._id;

  return (
    <div className="sop-wrap">
      {/* ambient glow */}
      <span className="sop-blob sop-blob--1" />
      <span className="sop-blob sop-blob--2" />
      <span className="sop-blob sop-blob--3" />

      <div className="sop-shell">
        {/* Sticky glassy header */}
        <div className="sop-header">
          <button className="sop-back" onClick={() => navigate(-1)} aria-label="Back">
            <FaArrowLeft />
          </button>
          <div className="sop-htext">
            <h2 className="sop-title"><FaHotel /> Stay Owners Plan</h2>
            <p className="sop-subtitle">Choose the best plan to promote your property</p>
          </div>
        </div>

        <div className="sop-body">
          {banner && (
            <motion.div
              className={`sop-banner ${banner.type === "success" ? "sop-banner--ok" : "sop-banner--err"}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {banner.type === "success" ? <FaCheckCircle /> : <FaTimesCircle />} {banner.text}
            </motion.div>
          )}

          {/* Current subscription */}
          {subActive && sub && (
            <motion.div className="sop-sub" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="sop-sub-label">Your active plan</div>
              <div className="sop-sub-name">{sub.planName || "Stay Plan"}</div>
              <div className="sop-sub-meta">
                {sub.maxListings ? `${sub.maxListings} listing(s)` : "Unlimited listings"}
                {sub.featured ? " · Featured" : ""}
                {sub.expiresAt ? ` · Valid till ${fmtDate(sub.expiresAt)}` : " · No expiry"}
              </div>
            </motion.div>
          )}

          <p className="sop-lead">Choose a plan to list and feature your Place To Stay property.</p>

          {loading ? (
            <p className="sop-empty">Loading plans…</p>
          ) : plans.length === 0 ? (
            <p className="sop-empty">No plans available right now.</p>
          ) : (
            plans.map((p, i) => {
              const isRec = p._id === recommendedId;
              const benefits = buildBenefits(p);
              return (
                <motion.div
                  key={p._id}
                  className={`sop-card${isRec ? " is-popular" : ""}`}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0, scale: isRec ? 1.015 : 1 }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
                  whileHover={{ scale: isRec ? 1.035 : 1.02, y: -4 }}
                >
                  {isRec && (
                    <div className="sop-ribbon"><FaStar /> MOST POPULAR</div>
                  )}

                  <div className="sop-card-top">
                    <div>
                      <span className="sop-badge">{p.name}</span>
                      {p.description && <p className="sop-desc">{p.description}</p>}
                    </div>
                    <div className="sop-price-wrap">
                      <div className="sop-price">₹{Number(p.price).toLocaleString("en-IN")}</div>
                      <span className="sop-price-unit">{p.durationDays ? `for ${p.durationDays} days` : "one-time"}</span>
                    </div>
                  </div>

                  <div className="sop-benefits">
                    {benefits.map((b, bi) => (
                      <div className="sop-benefit" key={bi}>
                        <span className="sop-benefit-ic">{b.ic}</span>
                        <span style={{ flex: 1 }}>{b.text}</span>
                        <FaCheckCircle className="sop-check" />
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className="sop-cta"
                    onClick={() => buy(p)}
                    disabled={paying === p._id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {paying === p._id ? "Redirecting to PayU…" : (<>{isRec ? "Upgrade Now" : "Choose Plan"} <FaArrowRight /></>)}
                  </motion.button>
                </motion.div>
              );
            })
          )}

          {!phone && <p className="sop-login">Please log in to purchase a plan.</p>}
        </div>
      </div>
    </div>
  );
};

export default StayOwnersPlan;
