/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import api from "../services/api";
import "./CustomerDashboard.css";
import { FaSignOutAlt, FaMoneyBillWave, FaExchangeAlt, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const cardNumber = "4123456789012345";
    const pin = "1234";

    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const formatAmount = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [balanceRes, transactionsRes] = await Promise.all([
                api.get(`/balance/${cardNumber}`),
                api.get(`/transactions/${cardNumber}`)
            ]);
            setBalance(balanceRes.data);
            setTransactions(transactionsRes.data);
        } catch (error) {
            setMessage("Failed to load data. Check backend APIs.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleTransaction = async (type) => {
        if (amount <= 0) {
            setMessage("Amount must be greater than zero.");
            return;
        }

        try {
            const res = await api.post("/transaction", {
                cardNumber,
                pin,
                amount,
                type,
            });
            setMessage(res.data === "SUCCESS" ? "Transaction successful!" : `${res.data}`);
        } catch (error) {
            setMessage("Transaction failed due to system error.");
        }
        setAmount(0);
        loadData();
    };

    const handleLogout = () => {
        localStorage.removeItem('bankingUserSession');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <header className="customer-header">
                <h1 className="header-title">Customer Portal</h1>
                <button className="logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </button>
            </header>

            <div className="dashboard-grid">
                <div className="dashboard-card balance-card">
                    <h2 className="card-title"><FaWallet /> Current Balance</h2>
                    <p className="balance-box">
                        {isLoading ? "Loading..." : formatAmount(balance)}
                    </p>
                </div>

                <div className="dashboard-card transaction-form">
                    <h3 className="card-title"><FaExchangeAlt /> New Transaction</h3>

                    <div className="message-box">
                        {message && <p className={message.includes("successful") ? "message-success" : "message-failure"}>{message}</p>}
                    </div>

                    <div className="form-group">
                        <input
                            type="number"
                            className="input-box"
                            placeholder="Enter amount"
                            value={amount || ''}
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                        <button
                            className="btn btn-topup"
                            onClick={() => handleTransaction("topup")}
                            disabled={isLoading || amount <= 0}
                        >
                            Top-Up
                        </button>
                        <button
                            className="btn btn-withdraw"
                            onClick={() => handleTransaction("withdraw")}
                            disabled={isLoading || amount <= 0}
                        >
                            Withdraw
                        </button>
                    </div>
                </div>

                <div className="dashboard-card history-card">
                    <h3 className="card-title"><FaMoneyBillWave /> Transaction History</h3>

                    {isLoading && <p className="history-loading">Loading history...</p>}
                    {!isLoading && transactions.length === 0 && <p className="history-loading">No transactions recorded.</p>}

                    <div className="transaction-list">
                        {transactions.map((tx) => (
                            <div key={tx.id} className={`transaction-item tx-${tx.status.toLowerCase()}`}>
                                <div className="tx-info">
                                    <strong className={`tx-type-label type-${tx.type.toLowerCase()}`}>{tx.type.toUpperCase()}</strong>
                                    <span className="tx-date">{new Date(tx.timestamp).toLocaleDateString()}</span>
                                </div>
                                <div className="tx-status-amount">
                                    <span className="tx-amount">{formatAmount(tx.amount)}</span>
                                    <small className={`tx-status status-${tx.status.toLowerCase()}`}>{tx.status}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}