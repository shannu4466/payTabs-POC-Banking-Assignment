import { useEffect, useState } from "react";
import api from "../services/api";
import "./AdminDashboard.css";
import { FaSyncAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const loadTransactions = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/transactions");
            setTransactions(res.data);
        } catch (error) {
            alert("Failed to fetch transactions. Check System 2 API.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('bankingUserSession');
        navigate('/');
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };

    return (
        <div className="admin-container">
            <header className="dashboard-header">
                <h1 className="header-title">Admin Dashboard</h1>
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Sign Out
                </button>
            </header>

            <div className="admin-grid">
                <div className="admin-card control-panel">
                    <h2 className="card-title">System Overview</h2>
                    <p className="status-text">Monitor all financial activities in real-time.</p>
                    <button
                        className="refresh-btn"
                        onClick={loadTransactions}
                        disabled={isLoading}
                    >
                        <FaSyncAlt className={isLoading ? "spin" : ""} />
                        {isLoading ? " Loading..." : " Refresh Transactions"}
                    </button>
                </div>

                <div className="admin-card transactions-table">
                    <h2 className="card-title">Transaction History ({transactions.length})</h2>

                    {isLoading && <p className="loading-message">Fetching data...</p>}

                    {!isLoading && transactions.length === 0 && (
                        <p className="no-data-message">No transaction records found in the system.</p>
                    )}

                    <div className="transaction-list">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="transaction-item">
                                <div className="tx-details">
                                    <span className="tx-card-number">{tx.cardNumber}</span>
                                    <span className={`tx-type type-${tx.type.toLowerCase()}`}>
                                        {tx.type.toUpperCase()}
                                    </span>
                                </div>
                                <div className="tx-meta">
                                    <span className="tx-amount">{formatAmount(tx.amount)}</span>
                                    <span className={`tx-status status-${tx.status.toLowerCase()}`}>
                                        {tx.status}
                                    </span>
                                </div>
                                <div className="tx-reason-date">
                                    <small className="tx-date">{new Date(tx.timestamp).toLocaleString()}</small>
                                    {tx.status === "FAILED" && <small className="tx-reason">Reason: {tx.reason}</small>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}