# Banking System POC — Two-Tier Architecture (Spring Boot + React)

This repository contains a complete Proof of Concept (POC) for a simplified banking system implemented in a **two-tier architecture**, consisting of:

- **System1** — Gateway Service (Spring Boot, port 8081)  
- **System2** — Core Banking Service (Spring Boot, port 8082)  
- **Banking-ui** — Frontend Application (React + Vite + TypeScript, port 5173)

The POC demonstrates secure PIN hashing, request routing, inter-service communication, transaction logging, and a functional UI for customers and administrators.

---

## Repository Structure

.
├── System1/ # Spring Boot Gateway Service
├── System2/ # Spring Boot Core Banking Service
└── Banking-ui/ # React + Vite Frontend


---

## How to Run (Quick Instructions)

### 1. Run System2 (Core Banking Service — 8082)
Import System1 and System2 in IntelliJ in two different windows, so simply:

- Open **System2** in IntelliJ  
- Run the Spring Boot main class  
- System starts on: `http://localhost:8082`

### 2. Run System1 (Gateway Service — 8081)

- Open **System1** in another IntelliJ window  
- Run the Spring Boot main class  
- System starts on: `http://localhost:8081`

### 3. Run the Frontend (React UI — 5173)

Open VS Code terminal:

```bash
cd Banking-ui
npm install
npm run dev
```

Runs on:
http://localhost:5173

Architecture Overview
         Frontend (React UI)
                 |
                 v
     System1 — Gateway Service (8081)
                 |
                 v
    System2 — Core Banking Service (8082)
                 |
             H2 In-Memory DB

Features
System2 — Core Banking

Secure PIN validation (SHA-256 hashing)

In-memory H2 database

Supports:

Balance check

Withdraw

Top-up

Full transaction log

Seeded demo card on startup

Accepts only cards with prefix 4

System1 — Gateway Service

Validates card prefix

Forwards requests to System2

Acts as a middle-layer API router

Frontend communicates only with System1

Banking UI — React Frontend

Login page

Customer dashboard (balance, top-up, withdraw, history)

Admin dashboard (view all transactions)

Pure CSS (no UI libraries)

Fully typed with TypeScript

Seed Data (System2)

System2 loads this card when the application starts:

Card Number: 4123456789012345

PIN: 1234 (hashed in the database)

Balance: 1000

API Endpoints
System1 — Gateway (http://localhost:8081
)
POST /transaction

Example body:
```
{
  "cardNumber": "4123456789012345",
  "pin": "1234",
  "amount": 100,
  "type": "topup"
}
```

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/transaction` | Forwards transaction requests (Top-up/Withdrawal) to System 2. |
| **GET** | `/transaction/balance/{cardNumber}` | Fetches the current balance for a specific card. |
| **GET** | `/transaction/transactions` | Fetches **all** transactions recorded in the system (typically used by Admin). |
| **GET** | `/transaction/transactions/{cardNumber}` | Fetches the transaction history for a specific card number (typically used by Customer). |

---

#### **System 2 — Core Banking Service (http://localhost:8082)**
This service handles the core business logic, database interaction, and secure PIN validation.

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/process` | **Handles the core logic** for Top-up and Withdrawal requests after validation. |
| **GET** | `/process/balance/{cardNumber}` | Fetches the balance directly from the database (Internal use). |
| **GET** | `/process/transactions/{cardNumber}` | Fetches the transaction history for a specific card number (Internal use). |
| **GET** | `/process/transaction` | Fetches **all** transactions (Internal use). |

---

### 2. Frontend Pages (Banking UI)

The frontend provides distinct views for **Customers** and **Administrators**.

| Page | User Role | Access Credentials | Key Functionalities |
| :--- | :--- | :--- | :--- |
| **`/login`** | **Authentication** | Customer: `cust1` / `pass`<br>Admin: `admin` / `admin` | Entry point for both user types. |
| **`/customer`** | **Customer** | Requires `cust1` / `pass` | * **View balance**<br>* **Add money** (Top-up)<br>* **Withdraw money**<br>* **View own transactions** |
| **`/admin`** | **Admin** | Requires `admin` / `admin` | * **View all transactions** recorded in System 2. |

