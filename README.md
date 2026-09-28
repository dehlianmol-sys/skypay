# Skypay 

Act as an Expert Full-Stack Architect. I have 20 credits and I need to execute a major upgrade safely. 



### REPOSITORIES & CONTEXT:

1. Base Working Repository: https://github.com/dehlianmol-sys/vivrapay.git

   (CRITICAL: DO NOT break its core backend, APIs, or database. Ignore any broken or conflicting edits made previously by Bolt AI. Keep the core working logic of this repo intact.)

2. Reference Repository: https://github.com/dehlianmol-sys/buddy-connect-hub.git

   (Use this ONLY for UI placement, file structure layout, and matching the custom domain routing).



### CRITICAL RULES (MUST FOLLOW):

1. DO NOT change the existing working backend structure of `vivrapay`. 

2. DO NOT delete existing Super Admin/Admin functionalities. 

3. DO NOT output all code at once. Understand the requirements below, and execute them STEP-BY-STEP. Wait for my approval after providing the code for each step.



### THE REQUIREMENTS:



#### STEP 1: UI Fixes & Landing Page Placement

- Logo Bug: The logo is visible in the Admin Panel but missing on the User side (Login/Register/Landing). Fix the asset paths so it shows everywhere correctly. Tell me exactly where to place the image.

- Landing Page & APK Flow: Ensure the existing Landing Page (APK download page) is properly placed and routed for the custom domain (hkwallet.site). Do not create a new design; just use the correct existing layout and fix its placement so it matches the modern structure of buddy-connect-hub.



#### STEP 2: User Profile Updates (Avatar & Referrals)

- Avatar Lock Fix: Currently, avatars randomize every time a user refreshes or logs in. Fix this. When a user registers, assign them ONE avatar and save it to their DB profile permanently. It should only be changeable from the Admin panel.

- User Referral Links: Generate a unique referral code/link for EVERY user upon registration (currently missing). Display this link in their profile so they can share it. (Route: Users coming from this link must go to Register -> Download APK -> Login).



#### STEP 3: The New "Agent Dashboard" System

- Login Popup: When an Agent logs into the app, show a popup letting them choose: "Continue as Normal User" OR "Go to Agent Dashboard".

- Agent Dashboard Features: 

  * A separate dashboard UI for Agents.

  * They can see a list of users who joined via their referral link.

  * They can see the deposit status (Success/Failed) of their referred users.

  * Add a Calendar/Filter view (like the Super Admin has) so the Agent can see "Today's Deposits" and "Total Deposits" from their downline.

- Commission Auto-Credit Logic: When a referred user deposits money, and the Super Admin approves/marks it as 'Success', automatically calculate the Agent's commission (based on the percentage set by Admin) and credit it to the Agent's app wallet balance.

- Offline Settlement (Admin Side): Add a feature in the Super Admin panel to manually deduct an Agent's wallet balance (this represents the Admin paying the Agent in physical cash/offline).



### YOUR INSTRUCTION:

Do not write all the code right now. 

First, acknowledge these requirements and provide the EXACT SQL queries needed to support Step 2 and Step 3 (Avatars, Referrals, Agent Commission, Agent Wallet). Make sure SQL uses `ALTER TABLE` and `CREATE TABLE IF NOT EXISTS` (No `DROP TABLE` or `TRUNCATE`).

Then, tell me you are ready to give the code for STEP 1.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ac9c3cac-e4e3-40e7-8fab-7ae15b636d39).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
