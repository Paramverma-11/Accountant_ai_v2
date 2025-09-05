# Accountant.ai

Accountant.ai is a modern, AI-powered accounting assistant designed to simplify personal and small business finance management. It leverages the power of Google's Gemini AI to allow users to add transactions using natural voice commands and by scanning invoices or receipts.

![Accountant.ai Screenshot](https://storage.googleapis.com/pr-prd-filestore-f99a/github/readme-screenshot.png)

All data is stored securely and privately in your browser's local storage. Your financial information never leaves your computer.

## ✨ Key Features

- **AI-Powered Voice Commands**: Add multiple transactions at once using natural language (e.g., "I bought groceries for ₹1250 and paid my ₹800 internet bill").
- **Smart Receipt & Invoice Scanning**: Upload an image of a receipt or a complex B2B invoice, and the AI will automatically extract each line item, customer details, and GST information, creating individual ledger entries.
- **Multi-Account Management**: Create separate "books" for different accounts (e.g., Personal, Business, Travel) with support for over 150 world currencies.
- **Detailed GST Tracking**: Automatically parses IGST, CGST, and SGST from invoices and applies the correct tax breakdown to each transaction.
- **Savings Tracker**: Differentiate between expenses and savings to easily monitor your financial goals.
- **Comprehensive Dashboard**: Get an at-a-glance summary of your total income, expenses, savings, and available balance.
- **Full Edit & Delete Capability**: Easily edit or remove any transaction directly from the ledger.
- **Data Export**: Download your transaction history for any account book as a CSV file.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI**: Google Gemini API (`@google/genai`)
- **Persistence**: Browser Local Storage

## 🚀 Getting Started

This is a static web application that can be run with any simple HTTP server.

### Prerequisites

You need an API key for the Google Gemini API. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running Locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/YOUR_USERNAME/accountant-ai.git
    cd accountant-ai
    ```
2.  Serve the `index.html` file using a local web server. A simple one can be run with Python:
    ```bash
    python -m http.server
    ```
3.  **IMPORTANT**: The application is configured to read the Gemini API key from a `process.env.API_KEY` variable. This variable is not available in a simple static file server environment. To run the app locally for testing, you must temporarily modify the `services/geminiService.ts` file:
    
    Find this line:
    ```typescript
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    ```
    And replace `process.env.API_KEY` with your actual API key in quotes:
    ```typescript
    const ai = new GoogleGenAI({ apiKey: "YOUR_GEMINI_API_KEY_HERE" });
    ```
    **Remember to revert this change before committing your code!**

## ⚠️ Security Warning: API Key Management

This project is designed as a client-side-only application. As such, the Gemini API key is included directly in the JavaScript that runs in the user's browser.

**This is not secure for a public-facing production application.** Exposing your API key on the client side can lead to its misuse by third parties, potentially incurring costs on your Google AI account.

For a real-world deployment, you should implement a backend proxy. The frontend application would make requests to your backend, and your backend server would securely store the API key and make the actual calls to the Gemini API.

This project is intended as a demonstration and a template. **Do not deploy it to a public URL with your personal API key hardcoded.**

## 部署 (Deployment)

This application is a static site and can be deployed to any static hosting provider like GitHub Pages, Vercel, or Netlify. However, due to the API key security issue mentioned above, you must configure your hosting provider to inject the `API_KEY` as an environment variable at build time.
