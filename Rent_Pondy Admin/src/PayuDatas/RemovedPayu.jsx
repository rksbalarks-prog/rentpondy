import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

// Lists every PayU payment row that was soft-deleted from the
// Payment Paid Failed / Pay Now / Pay Later pages. Records can be
// restored back into their original status table from here.
const RemovedPayu = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneFilter, setPhoneFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const tableRef = useRef();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/payu-removed`
      );
      setPayments(res.data.data || []);
    } catch (error) {
      console.error("Error fetching removed payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    if (!id) return;
    if (!window.confirm("Restore this payment back to its original page?")) return;
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/payu-payment/${id}/restore`
      );
      setPayments((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error restoring payment:", error);
      alert("Failed to restore payment. Please try again.");
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesPhone = (payment.phone || "").includes(phoneFilter);
    const matchesStatus = statusFilter
      ? payment.payustatususer === statusFilter
      : true;
    const removedTs = payment.removedAt
      ? new Date(payment.removedAt)
      : new Date(payment.createdAt);
    const isAfterStart = startDate ? removedTs >= new Date(startDate) : true;
    const isBeforeEnd = endDate ? removedTs <= new Date(endDate) : true;
    return matchesPhone && matchesStatus && isAfterStart && isBeforeEnd;
  });

  const handlePrint = () => {
    const printContent = tableRef.current.innerHTML;
    const printWindow = window.open("", "", "width=1200,height=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h3>Removed Payu Payments</h3>
          <table>${printContent}</table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container mt-4">
      <div
        style={{
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          padding: "20px",
          backgroundColor: "#fff",
        }}
        className="d-flex flex-row gap-2 align-items-center flex-wrap"
      >
        <input
          type="text"
          placeholder="Filter by phone"
          value={phoneFilter}
          onChange={(e) => setPhoneFilter(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pay now">pay now</option>
          <option value="pay later">pay later</option>
          <option value="paid">paid</option>
          <option value="pay failed">pay failed</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          style={{ background: "orange", color: "#fff" }}
          onClick={() => {
            setStartDate("");
            setEndDate("");
            setStatusFilter("");
            setPhoneFilter("");
          }}
        >
          Reset
        </button>
      </div>

      <button
        className="btn btn-secondary mb-3 mt-3"
        style={{ background: "tomato", color: "#fff" }}
        onClick={handlePrint}
      >
        Print
      </button>

      <h2 className="mb-4 text-center">Removed Payu — RP Property Account</h2>

      {loading ? (
        <p>Loading...</p>
      ) : filteredPayments.length === 0 ? (
        <p>No removed payments.</p>
      ) : (
        <div className="table-responsive" ref={tableRef}>
          <table className="table table-bordered table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Transaction ID</th>
                <th>PayU User Status</th>
                <th>Amount</th>
                <th>Name</th>
                <th>Rent ID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Plan Name</th>
                <th>Created At</th>
                <th>Removed At</th>
                <th className="no-print">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr key={payment._id}>
                  <td>{index + 1}</td>
                  <td>{payment.txnid}</td>
                  <td>{payment.payustatususer || "-"}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.firstname}</td>
                  <td>{payment.rentId}</td>
                  <td>{payment.email}</td>
                  <td>{payment.phone}</td>
                  <td>{payment.planName || "-"}</td>
                  <td>
                    {payment.createdAt
                      ? new Date(payment.createdAt).toLocaleString()
                      : "-"}
                  </td>
                  <td>
                    {payment.removedAt
                      ? new Date(payment.removedAt).toLocaleString()
                      : "-"}
                  </td>
                  <td className="no-print">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleRestore(payment._id)}
                      title="Restore this payment"
                    >
                      ↩ Restore
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RemovedPayu;
