# Fuel EU Maritime Compliance Dashboard

This is a full-stack developer assignment to build a minimal, yet well-structured, implementation of a "Fuel EU Maritime" compliance platform. The project includes a React frontend and a Node.js backend, both built using a Hexagonal (Ports & Adapters) Architecture.

## Overview

The application provides a dashboard for managing and analyzing maritime fuel compliance data. It allows users to:
* View all vessel routes and their emissions data.
* Set a "baseline" route for comparison.
* Compare all other routes against the baseline in a table and chart.
* Manage a "Compliance Balance" (CB) by banking surplus or applying it to deficits.
* Create "pools" of vessels to share compliance balances.

### Tech Stack

* **Frontend:** React, TypeScript, TailwindCSS, Vite
* **Backend:** Node.js, TypeScript, Express
* **Database:** In-Memory (or MongoDB / PostgreSQL)
* **Architecture:** Hexagonal (Ports & Adapters)

---

## 🏛️ Architecture

This project uses a **Hexagonal (Ports & Adapters) Architecture** to ensure a clean separation of concerns.

The goal is to isolate the "core" application logic (the `domain` and `application` layers) from all external technologies and frameworks.

* **Core (Inside):**
    * **`domain`**: Contains the business models and interfaces (e.g., the `Route` type). It has no external dependencies.
    * **`application`**: Contains the "use cases" or services (e.g., `RouteService`, `ComplianceService`). It depends only on the `domain` and `ports`.

* **Adapters (Outside):**
    * **`ports`**: These are the interfaces that define how the application communicates with the outside world (e.g., `RouteRepository`).
    * **`adapters`**: These are the concrete implementations of the ports.
        * **Inbound (Driving):** Adapters that *drive* the application, such as `http/routeController.ts` (for handling API requests).
        * **Outbound (Driven):** Adapters that are *driven by* the application, such as `outbound/InMemoryRouteRepository.ts` (for handling data storage).

This separation allows us to swap out external parts (like changing from In-Memory to a real database) without touching any of the core business logic.

---

## 🚀 Setup & Run Instructions

You will need two terminals running simultaneously to run this project.

### 1. Backend (Marinefleet-backend)

1.  **Navigate to the backend folder:**
    ```bash
    cd Marinefleet-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the server:**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3001`.

### 2. Frontend (Marinefleet-frontend)

1.  **Navigate to the frontend folder:**
    ```bash
    cd Marinefleet-frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the dev server:**
    ```bash
    npm run dev
    ```
    The app will open on `http://localhost:5173` (or a similar port).

---

## 🧪 How to Execute Tests

*(This section is a placeholder as per the assignment. We would add testing instructions here.)*

```bash
# To run backend tests:
cd Marinefleet-backend
npm test

# To run frontend tests:
cd Marinefleet-frontend
npm test
