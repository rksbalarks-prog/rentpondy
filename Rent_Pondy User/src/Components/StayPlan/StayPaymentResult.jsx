import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Shown after a PayU stay-plan payment. Indicates success/failure, then
// automatically returns the user to the app home page.
const StayPaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const ok = params.get("status") === "success";
  const amount = params.get("amount");
  const planName = params.get("planName");

  // Auto-redirect to home after a short delay so the user reads the result
  useEffect(() => {
    const t = setTimeout(() => navigate("/", { replace: true }), 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#eceef3", padding: "20px" }}>
      <div style={{ maxWidth: 420, width: "100%", background: "#fff", borderRadius: 18, padding: "34px 24px", textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
        <div style={{ fontSize: 64, color: ok ? "#15803d" : "#dc2626", lineHeight: 1 }}>
          {ok ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>
        <h2 style={{ margin: "16px 0 6px", color: "#1f2937", fontWeight: 800 }}>
          {ok ? "Payment Successful" : "Payment Failed"}
        </h2>
        <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
          {ok
            ? `Your ${planName ? planName + " " : ""}stay plan is now active${amount ? ` (₹${amount})` : ""}.`
            : "Your payment was not completed. No amount is charged for a failed transaction."}
        </p>
        <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 18 }}>Taking you to the home page…</p>
        <button
          onClick={() => navigate("/", { replace: true })}
          style={{ marginTop: 14, padding: "11px 22px", border: "none", borderRadius: 10, background: "linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
        >
          Go to Home now
        </button>
      </div>
    </div>
  );
};

export default StayPaymentResult;
