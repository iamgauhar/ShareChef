# 🍳 ShareChef (v1.1)
Collaborative AI-Powered Cooking Experience

ShareChef is a real-time NEXT.JS application that allows groups of friends to brainstorm meals together. Users contribute ingredients in a live lobby, an AI generates unique recipes based on those inputs, and the group votes on the winner in real-time.

# 🚀 Key Features
Authenticated Hosting & Dashboard
Google OAuth 2.0: Secure login for room creators using NextAuth.js.

Personal Kitchen History: A private dashboard for logged-in users to manage past rooms.

Data Control: Full CRUD capabilities allowing creators to delete expired or test rooms from MongoDB.

Secured Collaborative Rooms
Password Protection: Every room is encrypted with a unique password set by the host.

Anonymous Guest Access: Friends can join via Room ID and Password without needing an account.

Direct Link Gatekeeper: Shared URLs are protected by a password-entry screen.

Real-Time Interaction & AI
Live Lobby: Instant ingredient syncing across all clients using Pusher.

AI Chef (Llama 3.3): Generates 3 distinct recipes with instructions and prep times via the Groq SDK.

Interactive Voting: Real-time leaderboard that highlights the crowd favorite as votes come in.

# 🛠️ Tech Stack
Frontend: Next.js 15 (App Router), Tailwind CSS, Lucide React.

Backend: Node.js, Next.js API Routes.

Database: MongoDB Atlas with Mongoose.

Real-time: Pusher Channels.

AI: Llama 3.3 (via Groq Cloud).

Auth: NextAuth.js (Auth.js).

# 📦 Installation & Setup
Clone the repository

Bash
git clone https://github.com/iamgauhar/sharechef.git
cd sharechef
Install dependencies

Bash
npm install
Environment Variables
### 🔑 Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Database & AI
MONGODB_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_key

# Pusher (Real-time)
NEXT_PUBLIC_PUSHER_KEY=your_key
PUSHER_APP_ID=your_id
PUSHER_SECRET=your_secret
PUSHER_CLUSTER=your_cluster

# Authentication
NEXTAUTH_SECRET=your_node_generated_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
```
# Bash
```npm run dev```
🏗️ Architecture Overview
The application follows a modern serverless architecture using Next.js. To ensure high data consistency during rapid real-time updates (like voting), the backend utilizes the Mongoose for structured data modeling.

🌐 Deployment
The project is optimized for deployment on Netlify with custom domain.
Current Live Version: https://sharechef.iamgauhar.in.

Developed by Gauhar Software Engineer | MERN Stack Developer
