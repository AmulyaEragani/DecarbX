# DecarbX — Environmental Intelligence Platform

DecarbX is an environmental intelligence platform designed to help organizations monitor carbon emissions, analyze environmental performance, track sustainability goals, and explore opportunities for emissions reduction.

The platform combines a React and TypeScript frontend with a Python FastAPI backend to provide a centralized interface for sustainability data, analytics, compliance, and reporting.

## ✨ Features

- **Environmental Dashboard** — Monitor key performance indicators and sustainability metrics.
- **Emissions Management** — Organize and track Scope 1, Scope 2, and Scope 3 emissions.
- **Carbon Analytics** — Explore environmental performance and identify anomalies.
- **Carbon Finance** — View financial perspectives related to sustainability initiatives.
- **Scenario Analysis** — Explore emissions-reduction scenarios and compare potential outcomes.
- **Product Sustainability** — Support product carbon footprint (PCF) and life cycle assessment (LCA) workflows.
- **Supplier Management** — Manage supplier assessments, scorecards, and action plans.
- **Compliance and Audit** — Access compliance-related information and audit trails.
- **Reduction Targets** — Track sustainability targets and recommendations.
- **Reports and Evidence** — Access reporting features and supporting sustainability information.
- **Data Management** — Work with activities, projects, emission factors, and data uploads.

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Python
- FastAPI
- SQLite

## 📁 Project Structure

```text
DecarbX/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── seed.py
│   ├── requirements.txt
│   ├── routers/
│   └── services/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following:

- Python 3
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/AmulyaEragani/DecarbX.git
cd DecarbX
```

### 2. Set Up the Backend

Open a terminal in the project root and run:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```bash
python -m pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

If the application starts successfully, the API is typically available at:

- API: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs

### 3. Set Up the Frontend

Open a second terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal to access the frontend.

Keep both the backend and frontend terminals running while using the application.

## 🔐 Security

- Do not commit API keys, passwords, access tokens, or `.env` files.
- Keep private credentials in environment variables.
- Do not commit local databases containing private or sensitive information.

## 🎯 Project Objective

DecarbX aims to bring sustainability monitoring and carbon management workflows into one platform, helping users understand environmental performance and make more informed decisions about emissions reduction.

## 👩‍💻 Author

**Amulya Eragani**

GitHub: [@AmulyaEragani](https://github.com/AmulyaEragani)

## 📄 License

No license has been specified yet. All rights remain with the respective rights holders unless a license is added.
