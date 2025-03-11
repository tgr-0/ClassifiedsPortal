# Classified Portal

A modern web application for posting and browsing classified advertisements. Built with Node.js, Express, MongoDB, and EJS.

## Features

- User authentication (register, login, logout)
- Create, edit, and delete classified listings
- Upload multiple images for listings
- Search listings by keyword and category
- Responsive design
- Flash messages for user feedback
- Form validation
- Image preview before upload

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd classified-portal
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/classifiedPortal
SESSION_SECRET=your-secret-key
PORT=3000
```

4. Create required directories:
```bash
mkdir -p public/uploads
```

5. Start the application:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
classified-portal/
├── src/
│   ├── models/
│   │   ├── User.js
│   │   └── Listing.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── users.js
│   │   └── listings.js
│   └── views/
│       ├── layout.ejs
│       ├── home.ejs
│       └── users/
│           ├── login.ejs
│           └── register.ejs
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── uploads/
├── app.js
├── package.json
└── README.md
```

## Usage

1. Register a new account or login with existing credentials
2. Browse listings on the home page
3. Use the search bar to find specific listings
4. Create new listings by clicking "Post Ad"
5. Manage your listings from your profile page

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Bootstrap for the UI components
- Font Awesome for icons
- Express.js team
- MongoDB team 