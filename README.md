# SimplePay - Transfer with just a scan

SimlePay is a simple web application where users can make trasfers from their already existing bank accounts to whoever they choose with just a scan of the QR code of the receiver.


## Features
- **User Authentication**
- **Account linking/unlinking**
- **Realtime Account balance information**
- **QR Encoding and Scanning**
- **Account Credetials Validation**
- **Perforing Transfers**

## Installation

### Prerequisites
- Node.js (v20.x or higher)
- PostreSQL v16
- npm

### Clone the repository
```bash
git clone https://github.com/babaolu/SimplePay.git
cd SimplePay
```

### Backend (API)
Set up the backend in the `api` directory:

```bash
cd api
npm install
```

### Frontend (web)
Set up the frontend in the `web` directory:

```bash
cd ../web
npm install
```

## Usage
### Running the Application
1. Start the frontend:

```bash
cd frontend
npm run dev
```

2. Start the backend API:

```bash
cd ../api
npm run dev
```

> **Note**: Make sure to set your firebase and Mono credentials in you environment variable, or in the respective `.env` files of your frontend and backend before running.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.
