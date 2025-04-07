# CoreUI Free React Admin Template

## Introduction

This is the admin frontend for a web application built using the CoreUI Free React Admin Template. It provides a user interface for managing various aspects of the application, including:

* **Admin Management:** Create, edit, and manage admin users and their permissions.
* **CMS:** Manage website content through a CMS interface.
* **Game Configuration:** Configure settings related to a game, such as slot counts, images, and win combinations.
* **User Logs:** View and manage user activity logs.

## Technologies Used

* **CoreUI Free React Admin Template:** The base template for the UI.
* **React:** JavaScript library for building user interfaces.
* **Vite:** Frontend build tool for fast development.
* **Axios:** Promise-based HTTP client for making API requests.
* **React Hook Form:** Library for managing form state and validation.
* **Yup:** Schema builder for form validation.
* **React Router DOM:** Library for handling navigation.
* **Redux:** State management library.
* **Chart.js:** Library for creating charts.
* **TinyMCE:** Rich text editor.

## Installation

1. **Reactjs:** Ensure you have Reactjs installed. This project is compatible with Reactjs version 18.3 . 
2. Clone the repository:
   ```bash
   git clone https://github.com/communication-crafts/slot-machine.git
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

1. Start the development server:
   ```bash
   npm run start
   ```
   This will start the server on port 5000.

## Build

To create a production build:

```bash
npm run build
```

## Code Structure

* **src/views/dashboard:** Contains the dashboard component.
* **src/views/pages:** Contains components for various pages like admin management, CMS, and game configuration.
* **src/components:** Contains reusable UI components.
* **src/constant:** Contains constant values like API endpoints.
* **src/helpers:** Contains helper functions for API requests, storage, and common utilities.
* **src/plugin:** Contains plugins like Axios configuration.
* **src/validation:** Contains validation schemas for forms.

## Key Components

### `Slot_Config_Form.js`

This component provides a form for configuring game settings. It allows setting the number of slots, images, daily spin limits, and defining win combinations with prizes. It uses React Hook Form and Yup for form management and validation.

### `UserLoggs.js`

This component displays user activity logs. It fetches logs from the API and allows filtering, sorting, and pagination. It also provides a modal for deleting logs.

### `CombinationCard.js`

This reusable component renders a card for defining a specific win combination with its associated prizes.

### `ImageUploadCard.js`

This reusable component renders a card for uploading and previewing an image.

### `Pagination.js`

This component provides pagination controls for navigating through paginated data.

## API Integration

The frontend interacts with a backend API using Axios. The `apiRequest.js` file contains functions for making various API requests, such as:

* `adminsetconfig`: Sends a POST request to save game configuration.
* `admingetconfigcontent`: Sends a GET request to fetch game configuration.
* `admingetuserloggs`: Sends a GET request to fetch user logs.
* `admindeleteuserloggs`: Sends a DELETE request to delete a user log.

## Authentication

The frontend uses JWT (JSON Web Token) for authentication. The `axiosInstance` in `plugin/axios.js` is configured to include the authorization token in API requests.

## Routing

React Router DOM is used for handling navigation between different pages. The `routes.js` file defines the routes and their corresponding components.

## State Management

Redux is used for managing application state.

## Environment Variables

The project uses environment variables for configuration. You need to create a `.env` file in the root directory and define the following variables:

* **VITE_APP_API_ENDPOINT:** The base URL of the backend API.

## Additional Notes

* The `package.json` file lists all the dependencies used in the project.
* The `scripts` section in `package.json` defines various commands for building, linting, and formatting the code.
* The code uses ES6 syntax and features.





