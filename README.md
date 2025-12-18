
# Survey Bar 📊 (DEMO)

[🇨-🇹🇼 繁體中文說明 (Chinese README)](README_zh-TW.md)

> **⚠️ DEMO VERSION NOTICE**
> 
> This application is a **Proof of Concept (POC) / Demonstration**. 
> *   **No real money** is processed. The "Wallet" uses mock transactions.
> *   **Data is local**: All surveys, points, and user data are stored in your browser's `localStorage`. Clearing your cache will reset the app.
> *   **Google Forms**: The survey links provided are examples or user-submitted links.

## Introduction

**Survey Bar** is a community-driven marketplace for exchanging survey responses. The core concept is simple: **Give Feedback to Get Feedback**.

*   **Designers & Founders**: Get fast, honest feedback on your ideas.
*   **Students & Researchers**: Find participants for academic studies.
*   **Community**: Earn points by helping others, then use those points to boost your own projects.

## How It Works

### 1. Earn Points ( The Economy)
To ensure high-quality responses, the platform runs on a point system.
*   Go to the **Browse** tab.
*   Filter by interest (e.g., *Product Launch*, *Academic Research*).
*   Click **Take Survey**. You will be redirected to the survey (Google Forms, Typeform, etc.).
*   Complete the survey honestly.
*   Return to Survey Bar and click **"I have completed it"** to claim your points.
    *   *Standard Reward*: 1 Point
    *   *Urgent/Long Surveys*: Up to 3 Points

### 2. Post Your Survey
Once you have enough points, you can get respondents for your own work.
*   Click **Post Survey**.
*   Paste your survey link (Google Forms, SurveyMonkey, etc.).
*   Set your **Target Audience** (Location, Age, Language).
*   **Cost**: 
    *   10 Points (Base fee for listing)
    *   Extra points for boosting visibility or setting higher rewards.
*   Your survey immediately appears in the feed!

### 3. Boost & Analytics
*   **Boost**: Use points to pin your survey to the top of the list for faster responses.
*   **My Surveys**: Track how many people have clicked through to your survey.

### 4. Waitlist (Google Apps Script Integration)
This demo includes a working integration with Google Sheets via Google Apps Script.
*   Click **"Join Early Access"**.
*   Enter your name and email.
*   The data is sent to a real Google Sheet backend!

## Security Note (Google Apps Script)
The app uses a client-side Google Apps Script URL (`GOOGLE_SCRIPT_URL` in `constants.ts`) to submit waitlist data. 
*   **Risk**: Since this URL is exposed in the frontend code, anyone can see it and potentially send spam data to your sheet.
*   **Safety**: Users **cannot** read or delete your spreadsheet data using this URL, as it is a write-only endpoint (unless modified otherwise).
*   **Production Tip**: For a real application, you should proxy these requests through a secure backend server or implement rate-limiting/captchas within your Google Apps Script.

## Technical Setup (For Developers)

This project is built with **React**, **TypeScript**, and **Tailwind CSS**.

### Prerequisites
*   Node.js (v16+)
*   npm or yarn

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```

### Configuration

The app uses a Google Apps Script Web App URL for the waitlist functionality. This is configured in `constants.ts`.

To setup your own backend:
1.  Create a Google Sheet.
2.  Go to **Extensions > Apps Script**.
3.  Deploy a `doPost(e)` function that accepts POST requests.
4.  Update `GOOGLE_SCRIPT_URL` in `constants.ts`.

## Project Structure

*   `App.tsx`: Main application controller.
*   `components/`: UI components (Navbar, SurveyCard, Modals).
*   `services/storageService.ts`: Handles data persistence via `localStorage` (mimicking a database).
*   `translations.ts`: Localization support (English & Traditional Chinese).
*   `types.ts`: TypeScript interfaces for Users and Surveys.

---

*Built for the survey community.*
