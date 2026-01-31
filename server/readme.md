A real-time collaborative drawing application where multiple users can draw on a shared canvas and see updates instantly across tabs or devices using Socket.IO.

🚀 Features

✏️ Real-time drawing sync across users

👥 Multi-user collaboration

↩️ Undo functionality (per user)

📡 WebSocket-based communication

⚡ Fast and lightweight canvas rendering

🌐 Cross-tab synchronization

🛠️ Tech Stack
Frontend

HTML5 Canvas

JavaScript

Socket.IO Client

Backend

Node.js

Express.js

Socket.IO

📂 Project Structure
project-folder/
│
├── server.js
├── package.json
├── index.html
└── README.md

▶️ How to Run Locally
1️⃣ Clone the repository
git clone https://github.com/yourusername/drawing-app.git
cd drawing-app

2️⃣ Install dependencies
npm install

3️⃣ Start the server
node server.js


Server runs on:

http://localhost:5000

4️⃣ Open the app

Open index.html in your browser.
Open it in multiple tabs to test collaboration.

🧠 How It Works

User draws on canvas

Stroke data is sent to server via Socket.IO

Server broadcasts stroke to all connected users

All canvases update in real time

Undo works by:

Removing the last stroke of that user

Broadcasting updated history to all users

📌 Use Cases

Collaborative whiteboards

Online teaching tools

Brainstorming sessions

Multiplayer drawing games

🔮 Future Improvements

🎨 Color picker & brush sizes

🧩 Drawing rooms (multiple boards)

💾 Database persistence (MongoDB)

🔐 Authentication system

📱 Mobile-friendly UI