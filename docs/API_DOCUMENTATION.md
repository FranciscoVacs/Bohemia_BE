# Bohemia API Documentation

## Overview

This documentation provides the specifications for the Bohemia Backend REST API.
It includes details on authentication, available endpoints, and usage guidelines.

## Installation & Setup

To run this backend application locally, carefully follow these steps:

1. **Install dependencies:**
   Ensure you have Node.js and `pnpm` (or `npm`) installed.
   ```bash
   pnpm install
   ```
2. **Environment Variables:**
   Create a `.env` file based on your `.env.example` or required configuration (including database credentials, JWT secrets, MercadoPago tokens, and Cloudinary keys).
3. **Start the Development Server:**
   This will compile the TypeScript code and start the server using `tsc-watch`.
   ```bash
   pnpm start:dev
   ```

## Authentication

The API uses **Bearer Tokens (JWT)** for authentication.
For protected routes, include the token in the `Authorization` header:

```http
Authorization: Bearer YOUR_TOKEN_HERE
```

Roles:
- **User**: Standard authenticated user.
- **Admin**: User with administrative privileges (required for certain endpoints).

---

## 1. Authentication & Users

### Register User
Creates a new user account.
- **Endpoint:** `POST /users/register`
- **Auth:** None

### Login User
Authenticates a user and returns a JWT token.
- **Endpoint:** `POST /users/login`
- **Auth:** None

### Get Current User Profile
Returns the profile of the currently authenticated user.
- **Endpoint:** `GET /users/me`
- **Auth:** Required (Any)

### Get Current User Purchases
Returns a list of purchases made by the current user.
- **Endpoint:** `GET /users/me/purchases`
- **Auth:** Required (Any)

### Get Current User Purchase Tickets
Returns the tickets associated with a specific purchase for the current user.
- **Endpoint:** `GET /users/me/purchases/:id/tickets`
- **Auth:** Required (Any)

### Admin User Management
Endpoints reserved for administrators to manage users.
- `GET /users` - Get all users
- `POST /users` - Create a new user manually
- `GET /users/:id` - Get a specific user by ID
- `PATCH /users/:id` - Update user details
- `DELETE /users/:id` - Delete a user
- **Auth:** Required (Admin)

---

## 2. Events

### Get Future Events
Returns a list of all upcoming published events.
- **Endpoint:** `GET /events/future`
- **Auth:** None

### Get Event by ID
Returns details of a specific event.
- **Endpoint:** `GET /events/:id`
- **Auth:** None

### Get Ticket Types for Event
Returns available ticket types and pricing for a specific event.
- **Endpoint:** `GET /events/:id/ticketTypes`
- **Auth:** None

### Admin Event Management
Endpoints for event creation and management. Support for multipart forms for image uploads.
- `GET /events/admin` - Get all events including hidden ones with metrics calculated.
- `GET /events/admin/:id` - Get full event details for administration.
- `GET /events/:eventId/stats` - Get check-in and sales statistics for an event.
- `POST /events/crear` - Create a new event (Supports file upload via `uploader`).
- `PATCH /events/:id` - Update an event (Supports file upload via `uploader`).
- `PATCH /events/:id/publish` - Publish or unpublish an event.
- `PATCH /events/:id/gallery-status` - Update gallery status.
- `DELETE /events/:id` - Delete an event.
- **Auth:** Required (Admin)

---

## 3. Purchases & Tickets

### Create Payment Preference (MercadoPago)
Generates a payment preference ID to initialize the checkout flow.
- **Endpoint:** `POST /purchases/create_preference`
- **Auth:** Required (Any)

### Create Purchase
Records a completed or pending purchase in the local database.
- **Endpoint:** `POST /purchases/`
- **Auth:** Required (Any)

### Verify Purchase
Forces a verification of a specific payment ID with the payment gateway.
- **Endpoint:** `GET /purchases/verify/:paymentId`
- **Auth:** Required (Any)

### Get Purchase Tickets
Retrieves the ticket information for a specific purchase.
- **Endpoint:** `GET /purchases/:id`
- **Auth:** Required (Any)

### Download PDF Ticket
Generates and returns a downloadable PDF file for a specific ticket.
- **Endpoint:** `GET /purchases/:purchaseId/ticket/:ticketId`
- **Auth:** Required (Any)

### Payment Webhook
Endpoint called by MercadoPago to notify about payment status changes.
- **Endpoint:** `POST /purchases/payments/webhook`
- **Auth:** None

### Admin Purchase Management
- `GET /purchases/` - Get all purchases.
- `PATCH /purchases/:id` - Update a purchase.
- `DELETE /purchases/:id` - Delete a purchase.
- **Auth:** Required (Admin)

---

## Best Practices & Error Handling

- **Validation:** All payloads are validated using schemas. Invalid inputs will return a `400 Bad Request` with the specific validation error.
- **Uploads:** Endpoints marked with "Supports file upload" must be sent as `multipart/form-data`.
- **Authorization Errors:** Missing tokens will return `401 Unauthorized`. Trying to access an admin route with a normal user token will return `403 Forbidden`.
