# Library Manager

**Library Manager** is a web application, in progress, designed to help users organize and manage their media collections, including books and anime. The app connects to a backend API to handle data management, providing an intuitive and responsive interface for cataloging and tracking your media items.

## Key Features

- **Media Management**: Add books and anime to your library with detailed information such as title, description, status (e.g., To Read, Reading, Completed), progress tracking, and ratings.
- **Custom Lists**: Create custom lists categorized as Books or Anime to organize your collection according to your preferences. Only items matching the category of the list can be added.
- **Recommendations**: A dedicated recommendations page to explore suggestions based on your interests (feature in progress).
- **Dark Mode**: Supports dark mode for a comfortable viewing experience in low-light environments.
- **Filtering and Sorting**: Easily find and organize media items using various filters and sorting options.
- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on media items and custom lists with interactive dialogs and confirmation prompts.
- **Responsive Design**: The app is designed to be fully responsive, providing a seamless user experience across all devices, from desktops to mobile phones.

## Technology Stack

- **Frontend**:
  - **React** with **TypeScript** for building the user interface.
  - **Material-UI** for UI components and styling.
  - **React Router** for navigation.
  - **Axios** for making API requests.

## API Integration

This frontend application connects to a backend API for data management. For details on the API, you can check the API repository [here](https://github.com/ZeMQueiroz/library-manager-api).

## Getting Started

Follow these steps to get started with the Library Manager application:

### Prerequisites

- Node.js and npm installed.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ZeMQueiroz/library-manager-web.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd library-manager-web
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Start the Development Server**:
   ```bash
   npm start
   ```
5. **Access the App**:
   • Open your browser and go to http://localhost:3000 to start using the app.
