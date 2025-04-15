# Lost & Found Portal - Frontend

A modern web application for reporting and managing lost and found items. Built with React.js and Material-UI.

## Features

- User Authentication (Login/Register)
- Post Lost/Found Items
- Search and Filter Items
- Item Categories
- Image Upload
- Secure Claim System
- Admin Panel
- Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
├── layouts/         # Layout components
├── context/         # React context providers
├── services/        # API services
├── utils/           # Utility functions
├── assets/          # Static assets
└── styles/          # Global styles
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app

## Dependencies

- React
- React Router
- Material-UI
- Formik & Yup
- React Query
- Axios
- React Dropzone
- React Toastify
- date-fns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
