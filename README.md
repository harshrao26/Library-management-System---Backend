```markdown
# Library Management System - Backend

This project is a **Library Management System** built with **Node.js**, **Express**, and **MongoDB**, featuring **role-based authentication** to manage user permissions. It supports Admin, Librarian, and Member roles with distinct permissions for managing books, users, and borrowing operations.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Usage](#usage)
6. [API Endpoints](#api-endpoints)
7. [Postman Collection](#postman-collection)
8. [Validation](#validation)
9. [License](#license)

---

## Features

### Role-based Permissions
- **Admin:**
  - Manage users (create, update, delete).
  - Add, update, delete books.
  - View all books.
  - Record borrowing and returning of books.
- **Librarian:**
  - View all books.
  - Record borrowing and returning of books.
- **Member:**
  - View available books.
  - Borrow and return books (own records only).

### Authentication
- Registration with email confirmation (Admin approval required).
- Password generation based on user details.
- Login with JWT-based authentication and token expiration.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **ORM/ODM:** Mongoose

---

## Prerequisites

Before you start, ensure you have the following:

- **Node.js** (v14+)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/harshrao26/Library-management-System---Backend.git
   cd Library-management-System---Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

4. Start the server in development mode:
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000`.

---

## Usage

- Use tools like **Postman** or **cURL** to test the API.
- Postman collection for API testing is available [here](#postman-collection).

---

## API Endpoints

### Authentication
- **POST** `/api/auth/register`: Register a new user (Admin approval required).
- **POST** `/api/auth/login`: Login and get a JWT token.

### User Management (Admin only)
- **POST** `/api/users`: Create a new user.
- **PUT** `/api/users/:id`: Update user details.
- **DELETE** `/api/users/:id`: Delete a user.

### Book Management
- **POST** `/api/books`: Add a book (Admin only).
- **PUT** `/api/books/:id`: Update a book (Admin only).
- **DELETE** `/api/books/:id`: Delete a book (Admin only).
- **GET** `/api/books`: View all books (Admin, Librarian, Member).

### Borrowing Operations
- **POST** `/api/borrow`: Borrow a book (Member only, check availability).
- **POST** `/api/return`: Return a book (Member only).
- **POST** `/api/record`: Record borrowing/returning (Librarian only).

---

## Postman Collection

Download the [Postman Collection](#) to test all API endpoints.

---

## Validation

- **Joi** is used for validating request payloads to ensure the correctness of incoming data.

---

## Key Functionalities

- **JWT Authentication:** Secure routes using token-based authentication.
- **Role-based Middleware:** Grant permissions based on user roles.
- **Mongoose Models:**
  - **User:** Manages user information and roles.
  - **Book:** Handles book inventory.
  - **BorrowedBook:** Tracks borrowing and returning records.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

Developed by [Harsh Rao](mailto:harshurao26@gmail.com).
```

