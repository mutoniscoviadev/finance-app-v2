# 💰 Personal Finance App

A personal finance management app built with **HTML**, **CSS**, and **TypeScript**.

📌 Features

 🔐 uthentication— Register, Login and Logout
 💸 Transactions — Add, search, sort and filter transactions
 📊 Budgets — Create budgets per category and track spending
 🏦 Pots — Create savings pots, add money and withdraw
 🔁 Recurring Bills — Track monthly bills, mark as paid/unpaid
 📋 Overview — Dashboard showing your full financial summary
 💾 localStorage — All data is saved in the browser

🛠️ Tech Stack

| Technology   | Purpose                        |
|--------------|-------------------------------|
| HTML5        | App structure                  |
| CSS3         | Styling and layout             |
| TypeScript   | Logic and interactivity        |
| localStorage | Data persistence (no backend)  |

 📁 Project Structure

financeapp/
    ├── src/
    │   ├── main.ts            # App entry point
    │   ├── auth.ts            # Login, register, logout logic
    │   ├── data.ts            # Data models and localStorage functions
    │   ├── sidebar.ts         # Sidebar navigation component
    │   ├── overview.ts        # Overview/dashboard page
    │   ├── transactions.ts    # Transactions list page
    │   ├── addTransaction.ts  # Add transaction form page
    │   ├── budgets.ts         # Budgets page
    │   ├── pots.ts            # Pots/savings page
    │   ├── bills.ts           # Recurring bills page
    │   ├── login.ts           # Login page
    │   └── register.ts        # Register page
    ├── styles/
    │   ├── globals.css        # Global styles and design tokens
    │   ├── sidebar.css        # Sidebar styles
    │   ├── auth.css           # Login and register styles
    │   ├── overview.css       # Overview page styles
    │   ├── transactions.css   # Transactions page styles
    │   ├── budgets.css        # Budgets page styles
    │   ├── pots.css           # Pots page styles
    │   └── bills.css          # Bills page styles
    ├── dist/                  # Compiled JavaScript (auto-generated)
    ├── index.html             # Main HTML file
    ├── tsconfig.json          # TypeScript configuration
    ├── package.json           # Project dependencies
    └── README.md              # Project documentation

  🚀 Getting Started

 1. Clone or download the project

```bash
git clone <your-repo-url>
cd finance
```

 2. Install dependencies

```bash
npm install
```

 3. Start TypeScript compiler in watch mode

```bash
npm run watch
```

 4. Open the app

- Open `index.html` with **Live Server** in VS Code
- Or open `http://127.0.0.1:5500/index.html` in your browser

👤 How to Use

 Register
1. Open the app
2. Click **Sign Up**
3. Enter your name, email and password
4. Click **Create Account**

 Login
1. Enter your email and password
2. Click **Login**

 Add a Transaction
1. Click **Transactions** in the sidebar
2. Click **+ Add Transaction**
3. Fill in the form and click **Save Transaction**

 Add a Budget
1. Click **Budgets** in the sidebar
2. Click **+ Add Budget**
3. Choose a category, set a maximum amount and pick a color
4. Click **Add Budget**

 Add a Pot
1. Click **Pots** in the sidebar
2. Click **+ Add Pot**
3. Enter a name and savings target
4. Click **Add Pot**
5. Use **+ Add Money** or **Withdraw** to manage your pot

 Add a Bill
1. Click **Recurring Bills** in the sidebar
2. Click **+ Add Bill**
3. Enter the bill name, amount and due day
4. Click **Add Bill**
5. Use **Mark Paid** when you've paid the bill

💡 Notes

- All data is stored in your browser's **localStorage**
- Data will persist after closing the browser
- Use **Logout** to safely sign out — your data stays saved
- **Do not use** `localStorage.clear()` as it will delete all your data

👩‍💻 Author

**Scovia**  
Built as a personal finance tracking project using TypeScript.