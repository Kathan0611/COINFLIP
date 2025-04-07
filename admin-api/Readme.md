# Slot Machine Backend.

This project is a backend API for managing a slot machine game. It provides endpoints for both administrative tasks (such as managing slot configurations and user logs) and game-related functionalities (like spinning for a prize and retrieving slot images). The API is built using Node.js, Express, and Sequelize with TypeScript.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Admin Routes](#admin-routes)
  - [API Routes](#api-routes)
- [File Uploads](#file-uploads)
- [Error Handling & Logging](#error-handling--logging)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Slot Configuration Management:** Create and update slot configurations, including slot counts, sections, daily limits, and winning combinations.
- **User Logs:** Retrieve and delete user log entries for spins.
- **Game Logic:** Spin functionality with multi-attempt logic, daily spin limits, and prize selection.
- **Media Management:** Upload and manage slot images associated with each configuration.
- **Robust Error Handling:** Standardized responses using helper functions for success and error responses.

## Technology Stack

- **Node.js & Express:** Core runtime and web framework.
- **TypeScript:** For type safety and better development experience.
- **Sequelize:** ORM for managing SQL databases.
- **Multer:** Middleware for handling file uploads.
- **dotenv:** Managing environment variables.
- **Body-parser & CORS:** Parsing request bodies and handling cross-origin requests.

## Project Structure

```
├── src
│   ├── config
│   │   └── database.ts            # Sequelize database configuration
│   ├── controllers
│   │   ├── admin
│   │   │   ├── slotConfigController.ts
│   │   │   └── userloggsController.ts
│   │   └── api
│   │       ├── slotController.ts
│   │       └── spinController.ts
│   ├── middlewares
│   │   ├── aclCheck.ts
│   │   ├── fileUpload.ts          # Multer file upload configuration
│   │   ├── loggingMiddleware.ts
│   │   └── validateRequest.ts
│   ├── models
│   │   ├── SlotConfig.ts
│   │   ├── SlotImage.ts
│   │   └── SpinHistory.ts
│   ├── routes
│   │   ├── admin
│   │   │   ├── slotRoutes.ts
│   │   │   └── index.ts
│   │   └── api
│   │       ├── slotRoutes.ts
│   │       └── index.ts
│   ├── services
│   │   ├── admin
│   │   │   └── slotConfigService.ts
│   │   └── api
│   │       └── slotService.ts
│   ├── constants
│   │   ├── responses.ts
│   │   ├── statusCodes.ts
│   │   └── index.ts
│   ├── validators
│   │   ├── admin
│   │   │   └── admin/slot.ts
│   │   └── api
│   │       └── slot/spinValidation.ts
│   └── index.ts                   # Entry point of the application
├── .env                         # Environment variables file
├── package.json
└── README.md
```

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/slot-machine-backend.git
   cd slot-machine-backend
   ```

2. **Install dependencies:**
   node 22.12.0

   ```bash
   npm install
   ```

## Configuration

- **Environment Variables:**  
  Create a `.env` file in the root directory with your configuration. For example:

  ```dotenv
  PORT=3001
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=your_db_user
  DB_PASS=your_db_password
  DB_NAME=your_db_name
  ```

- **File Uploads:**  
  Ensure that the following directories exist (or update the paths in your code as needed):
  - `src/assets/uploads/media`
  - `src/assets/uploads/audio`

## Database Setup

This project uses Sequelize as the ORM. Make sure your database is running and that the connection details in your `.env` file are correct.

- **Database Initialization:**  
  The application will automatically authenticate the connection during startup. For schema migrations or further configuration, refer to your Sequelize documentation or custom migration scripts if available.

## Running the Server

Start the development server with:

```bash
npm run dev
```

Or, to build and run the production server:

```bash
npm run build
npm start
```

Once running, the server will listen on the port specified in your `.env` file (default is 3001).

## API Endpoints

### Admin Routes

- **GET `/admin/config`**  
  Fetches the active slot configuration along with its images.  
  **Access:** Requires appropriate ACL permissions (`game_config`, `view`).

- **POST `/admin/config`**  
  Creates or updates the slot configuration.  
  **Access:** Requires ACL permission (`game_config`, `create`).  
  **Notes:** Supports file uploads for slot images.

- **GET `/admin/userloggs`**  
  Retrieves user spin logs with optional filtering and pagination.  
  **Access:** Requires ACL permission (`userloggs`, `view`).

- **DELETE `/admin/userloggs/:id`**  
  Deletes a specific user log entry by ID.  
  **Access:** Requires ACL permission (`userloggs`, `delete`).

### API Routes

- **POST `/api/slot/spin`**  
  Processes a spin request. Handles daily spin limits, winning logic, and prize selection.  
  **Payload:** Expects `user_name` and `user_number` in the request body.

- **GET `/api/slot/images`**  
  Retrieves slot images and the total number of slots available from the active configuration.

- **GET '/api/media'**
  Gets access to images stored in backend for slot machine.

- **GET '/api/audio'**
  Gets access to audio stored in backend for slot machine.

## File Uploads

The project uses Multer for handling file uploads. Uploaded slot images are stored in the `src/assets/uploads/media` directory. Ensure that this directory exists and has the appropriate permissions.

## Error Handling & Logging

- **Error Responses:**  
  All errors are handled using a standardized error response helper (`sendErrorResponse`) which ensures consistent response formats.

- **Logging:**  
  A custom logging middleware logs incoming requests and other relevant events. Check the `middlewares/loggingMiddleware.ts` file for further details.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Make sure to follow existing coding standards and update tests as needed.

## License

This project is licensed under the [MIT License](LICENSE).

2 validation - combination length should be equal to slot field value - any combination digit should not be greater than slot images field value

admin/slot-machine/config

game-config/slot-machine/admin/config
