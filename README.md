# Basic_POS_Project
# Basic POS Sales Tracker

A simple and user-friendly POS (Point of Sale) web application built with **React + Vite**.  
This project helps store owners record sales, manage inventory, and view sales analytics through a modern dashboard.

---
## Team Members

1. Kaung Myat Thu -u6712065@au.edu -KaungMyatThu30 Kaung Myat Thu
2. Thant Sin Win  -u6712095@au.edu -thantsinwin8917
3. Htin Aung Lynn -u6726116@au.edu -Lynn198456
---
## Features

### Page 1: Dashboard 
The Dashboard gives an overview of sales performance:

- **Total Sales (All Time / by Period)**
- **Period Filters**
  - Daily
  - Weekly
  - Monthly
- **Sales Trends (Line Chart)**: visualizes sales changes by date
- **Sales by Category (Doughnut/Pie Chart)**: shows category contribution
- **Top 5 Selling Products**: ranking based on quantity sold
---
### Dashboard Screenshot

![Dashboard Screenshot](images/dashboard1.png)
![Dashboard Screenshot](images/dashboard2.png)

---
### Page 2: Sales Journal 
Sales Journal is used to record sales and update inventory in real-time:

- **Record Sale**
  - Select product from list
  - Enter quantity and date
  - Total auto-calculated in **Thai Baht (฿)**
- **Inventory Reduction**
  - When a sale is recorded, product stock decreases automatically
- **Extra Spending Category (Add New Item)**
  - Add custom item name, category, and price
  - Item is saved to the item list (runtime storage)
  - **No transaction is recorded** for extra items
- **Transaction History**
  - View all recorded sales in a table
---
### Sale Journal Screenshot
![SaleJournal Screenshot](images/salejournal1.png)
![SaleJournal Screenshot](images/salejournal2.png)
![SaleJournal Screenshot](images/salejournal3.png)

---
## Deploy Link
https://thantsinwin8917.github.io/Basic_POS_Deploy/
basic_pos
 

## Technology Stack

- **React** (Vite)
- **React Router DOM** (Routing)
- **LocalStorage** (Runtime product & transaction storage)
- **Custom SVG Charts** (Line + Doughnut)
- **JavaScript (ES6+)**

---
## Prerequisites

- Node.js (14+ recommended)
- npm 
---
##  Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/KaungMyatThu30/Basic_POS_Project.git
cd basic_pos_project
Install dependencies:

npm install

Run the app
npm run dev


Open:

http://localhost:5173

Build for production
npm run build


Preview build:

npm run preview

Data Configuration
Product Catalog File (pos_item.json)

Place your JSON file here:

src/data/pos_item.json

Example import:

import productData from "../data/pos_item.json";

Runtime Storage (LocalStorage)

This project uses LocalStorage for saving runtime changes:

Products & Inventory

Key: pos_products_runtime

Stock reduces when recording sale

Extra items are stored here too

Transactions

Key: pos_transactions

This means you can refresh the page and still keep inventory + transactions.

Project Structure
BASIC_POS_PROJECT
├── basic_pos/
|   ├── public/
|   ├── src/
|   │   ├── components/
|   │   │   └── Sidebar.jsx
|   │   ├── data/
|   │   │   └── pos_item.json
|   |   └── useTransactions.js
|   │   ├── pages/
|   │   │   ├── Dashboard.jsx
|   │   │   └── SalesJournal.jsx
|   │   └── App.css
|   ├── package.json
|   └── vite.config.js
├──images
├──package-lock.json
└──README.md
Application Specifications

Dashboard

Calculates sales totals from transactions

Supports daily/weekly/monthly filtering

Charts update dynamically based on filter

Sales Journal

Prevents sales if stock is not enough

Updates inventory immediately after sale

Extra Spending adds item only (no transaction)

Scripts

npm run dev — Start development server

npm run build — Build for production

npm run preview — Preview build

npm run lint — Run ESLint

License

This project is developed as part of a University course project by the team members listed above.

Built by Kaung Myat Thu ,Thant Sin Win , Htin Aung Lynn


If you want, I can also:
- add a **Live Demo link section** (GitHub Pages)
- add **Features checklist**
- write a short “How to use” guide for teacher (step-by-step)
::contentReference[oaicite:0]{index=0}
