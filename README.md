Overview

Notera is a full-stack notes management application that enables authenticated users to securely create, edit, delete, and manage their personal notes through a responsive web interface. The project follows production-level engineering practices including structured logging, unit testing, global exception handling, and continuous code quality analysis.

Tech Stack
Frontend

React.js

JavaScript

Responsive UI

Backend

Node.js

Express.js

RESTful APIs

Database

MySQL

Testing & Code Quality

Mocha / Chai (Backend Unit Testing)

Jest (Frontend Testing)

SonarQube (Static Code Analysis)

Tools

Git (Version Control)

Pino Logger (Structured Logging)

Key Features
Authentication & Authorization

Secure user registration and login

Protected routes for authenticated users

User-specific data access

Notes Management

Create notes

Update notes

Delete notes

View notes in dashboard

Rich text editing support

Logging & Monitoring

Centralized application logging using Pino Logger

HTTP request/response logging

Error and activity tracking

Exception Handling

Global error-handling middleware

Structured and meaningful error responses

Testing

Backend unit testing using Mocha/Chai

Frontend testing using Jest

Code Quality

Continuous code quality inspection using SonarQube

Detection of bugs, vulnerabilities, and maintainability issues

Application Screens

Sign Up / Login

Notes Dashboard

Note Editor

User Profile


Installation & Setup
Backend Setup
cd backend
npm install
npm start
Frontend Setup
cd frontend
npm install
npm start
Development Workflow

Feature-based branching strategy

Pull request based code review

Merge to develop after approval

Stable release merged into main



