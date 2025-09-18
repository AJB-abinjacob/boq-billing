# BOQ Billing Application

A comprehensive, enterprise-grade Bill of Quantities (BOQ) billing solution built with the MERN stack.

![BOQ Billing App](https://via.placeholder.com/800x400?text=BOQ+Billing+Application)

## 🚀 Features

- **Multi-tenant Architecture**: Support for multiple companies with isolated data
- **Dynamic Billing Templates**: Customizable fields with drag-and-drop reordering
- **Nested Categories**: Unlimited category nesting for organized product management
- **Real-time Autosave**: Never lose work with automatic draft saving
- **Export Options**: Generate professional PDFs, Excel sheets, and CSV exports
- **Customizable Branding**: Company logos, colors, and PDF layout configuration
- **Status Tracking**: Monitor bill status from draft to payment completion
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Advanced Search**: Global search with filters across all entities

## 🛠️ Technology Stack

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Local storage (configurable for cloud storage)
- **Authentication**: JWT (planned for future implementation)
- **PDF Generation**: PDFKit
- **Excel/CSV Export**: ExcelJS, csv-writer

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- MongoDB (v4.x or higher)
- Git

## 🔧 Installation

### Clone the Repository

```powershell
git clone https://github.com/yourusername/boq-billing.git
cd boq-billing
```

### Backend Setup

```powershell
cd backend
npm install
```

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/boq-billing
NODE_ENV=development
```

Start the backend server:

```powershell
npm run dev
```

### Frontend Setup

```powershell
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```powershell
npm start
```

## 📁 Project Structure

```
boq-billing/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── app.js            # Express app
│   └── server.js         # Entry point
│
├── frontend/
│   ├── public/           # Static files
│   ├── src/
│   │   ├── assets/       # Images, fonts, etc.
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context
│   │   ├── hooks/        # Custom hooks
│   │   ├── layouts/      # Page layouts
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # Redux store
│   │   ├── styles/       # Global styles
│   │   ├── utils/        # Utility functions
│   │   ├── App.js        # Main component
│   │   └── index.js      # Entry point
│   └── package.json
│
└── README.md             # Project documentation
```

## 🚀 Development Workflow

### Backend Development

1. Create/modify Mongoose models in `backend/models/`
2. Implement controllers in `backend/controllers/`
3. Define routes in `backend/routes/`
4. Register routes in `app.js`

### Frontend Development

1. Create/modify components in `frontend/src/components/`
2. Implement pages in `frontend/src/pages/`
3. Add routes in `frontend/src/App.js`
4. Connect to API using services in `frontend/src/services/`

## 📝 API Documentation

### Authentication API (Future Implementation)

| Method | Endpoint             | Description |
| ------ | -------------------- | ----------- |
| POST   | `/api/auth/login`  | User login  |
| POST   | `/api/auth/logout` | User logout |

### Companies API

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| GET    | `/api/companies`        | Get all companies   |
| GET    | `/api/companies/:id`    | Get company by ID   |
| POST   | `/api/companies`        | Create new company  |
| PUT    | `/api/companies/:id`    | Update company      |
| DELETE | `/api/companies/:id`    | Delete company      |
| POST   | `/api/companies/upload` | Upload company logo |

### Categories API

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | `/api/categories`     | Get all categories  |
| GET    | `/api/categories/:id` | Get category by ID  |
| POST   | `/api/categories`     | Create new category |
| PUT    | `/api/categories/:id` | Update category     |
| DELETE | `/api/categories/:id` | Delete category     |

### Products API

| Method | Endpoint              | Description        |
| ------ | --------------------- | ------------------ |
| GET    | `/api/products`     | Get all products   |
| GET    | `/api/products/:id` | Get product by ID  |
| POST   | `/api/products`     | Create new product |
| PUT    | `/api/products/:id` | Update product     |
| DELETE | `/api/products/:id` | Delete product     |

### Bills API

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| GET    | `/api/bills`              | Get all bills           |
| GET    | `/api/bills/:id`          | Get bill by ID          |
| POST   | `/api/bills`              | Create new bill         |
| PUT    | `/api/bills/:id`          | Update bill             |
| DELETE | `/api/bills/:id`          | Delete bill             |
| POST   | `/api/bills/:id/finalize` | Finalize draft bill     |
| GET    | `/api/bills/:id/pdf`      | Generate PDF for bill   |
| GET    | `/api/bills/:id/excel`    | Generate Excel for bill |

## 🔒 Security Considerations

- Input validation using Joi/Yup
- Data sanitization to prevent NoSQL injection
- Rate limiting for API endpoints
- CORS configuration
- Future: JWT authentication with refresh tokens

## 🚀 Deployment

### Backend Deployment

```powershell
cd backend
npm run build
```

### Frontend Deployment

```powershell
cd frontend
npm run build
```

The frontend build artifacts will be stored in the `frontend/build` directory, which can be deployed to any static hosting service.

## 📈 Future Enhancements

- User authentication and authorization
- Multi-tenant SaaS architecture
- Cloud storage integration
- Advanced analytics dashboard
- Mobile application
- Email notifications
- Payment gateway integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc.
