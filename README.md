# Kanban-Board-Application
A modern, minimal Kanban board application built with Vue.js 3, Express, and MongoDB. Features a responsive UI, smooth drag-and-drop, and custom modal overlays with blur effects.

# Features

Section Management: Create, update, and delete sections (To Do, In Progress, Done, and custom ones).

Task Management: Add, edit, delete tasks with name, description, due date, and assignee.

Drag & Drop: Reorder tasks within and across sections using vuedraggable.

REST API: Backend built with Express, Mongoose, and MongoDB for persistent storage.

CORS & JSON: Proper middleware configuration for cross-origin requests and JSON parsing.

# Tech Stack

Frontend: Vue.js 3, Vue CLI, Axios, vuedraggable

Backend: Node.js, Express, Mongoose

Database: MongoDB (via MONGODB_URI)

Styling: CSS, custom animations for modals

# Getting Started

Prerequisites

Node.js v16+ and npm

MongoDB instance (local or Atlas)

Installation

Clone the repository:

git clone (https://github.com/anurudha07/Kanban-Board-Application)
cd kanban-vue-app

Install backend dependencies and start server:

cd kanban-backend
npm install
cp .env.example .env  # configure MONGODB_URI and PORT
npm run dev

Install frontend dependencies and start dev server:

cd ../kanban-frontend
npm install
npm run serve

Open your browser at http://localhost:8080 (default Vue port).

# Directory Structure

![img1](https://github.com/user-attachments/assets/06bf45dc-08bd-4189-a53d-ca03bc4f0efe)

