# ShopSphere Frontend

ShopSphere is a modern e-commerce frontend built with React and Vite.
It provides a complete shopping experience for customers along with
role-based administration features for managing products, categories,
and orders.

## Overview

The ShopSphere frontend communicates with a FastAPI backend through
REST APIs and provides separate experiences for:

- Customers
- Administrators

The application includes authentication, product browsing, cart
management, address management, order placement, order tracking, and
administrative store management.

## Features

### Customer Features

- User registration
- User login and logout
- JWT-based authentication
- Product listing
- Product search
- Product sorting
- Product details
- Add products to cart
- Update cart quantities
- Remove products from cart
- Cart item count in navbar
- Address management
- Default address selection
- Order placement
- Order history
- Order details
- Order status tracking
- Order cancellation for eligible orders
- Payment information display
- Responsive design

### Admin Features

- Admin dashboard
- Product management
- Create products
- Edit products
- Delete products
- Activate/deactivate products
- Category management
- Create categories
- Edit categories
- Delete categories
- Order management
- Update order status
- Order statistics
- Protected admin routes

## Technology Stack

### Frontend

- React
- React Router
- Vite
- JavaScript
- HTML5
- CSS3

### Backend Integration

- FastAPI
- REST APIs
- JWT Authentication
- PostgreSQL

## Application Flow

```text
Guest
  │
  ├── Home
  ├── Products
  ├── Login
  └── Register
         │
         ▼
     Authenticate
         │
         ▼
Customer
  │
  ├── Products
  ├── Product Details
  ├── Cart
  ├── Address
  ├── Place Order
  ├── Order Details
  └── My Orders

Admin
  │
  ├── Admin Dashboard
  ├── Product Management
  ├── Category Management
  └── Order Management