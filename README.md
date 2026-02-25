# Bookworm API (Node.js Backend)

Backend REST API for Bookworm Mobile Application.

## Features

-   User Authentication (Register / Login)
-   JWT Authentication
-   CRUD Books
-   RESTful API
-   Middleware

## Tech Stack

-   Node.js
-   Express.js
-   MongoDB

## Installation

``` bash
git clone https://github.com/zachtix/bookworm-api-rn.git
cd bookworm-api-rn
npm install
npm run dev
```

## Environment Variables (.env)

    PORT=5000
    MONGO_URI=your_database_url
    
    JWT_SECRET=jwt_secret_key
    
    CLOUDINARY_CLOUD_NAME=cloudinary_name
    CLOUDINARY_API_KEY=cloudinary_apikey
    CLOUDINARY_API_SECRET=cloudinary_apisecret
    
    API_URL=url_api_fot_cronjob

## Example Endpoints

  Method  | Endpoint        | Description
  --------| ----------------| ----------------
  GET     | /api/books      | Get all books
  GET     | /api/books/:id  | Get book by ID
  POST    | /api/books      | Create book
  PUT     | /api/books/:id  | Update book
  DELETE  | /api/books/:id  | Delete book
