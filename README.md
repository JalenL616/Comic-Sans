# Comic Scans

A web application for comic book collectors to catalog their collection by scanning barcodes. Scan comic book UPCs using your phone camera or upload cover images to automatically identify and track your comics.

## Features

- **Barcode Scanning** - Scan UPC barcodes from comic books using your phone camera
- **Cover Upload** - Upload comic cover images for automatic barcode detection
- **Phone-to-Desktop Connection** - Scan a QR code to connect your phone as a wireless barcode scanner
- **Collection Management** - Track your comics with sorting, starring favorites, and drag-to-reorder
- **User Accounts** - Sign up to sync your collection across devices
- **Import/Export** - Export your collection to CSV or import from a backup

## Architecture

The application is split into three services:

**React Client** (`/client`) - The frontend is a React 19 single-page application built with Vite and TypeScript. It handles the UI for searching comics, displaying the collection, and managing the phone-to-desktop scanning connection via WebSockets. For phone scanning, it opens a camera view that captures frames and sends them to the server for processing.

**Express Server** (`/server`) - The Node.js backend built with Express 5 and TypeScript. It serves as the central API, handling user authentication (JWT), collection CRUD operations against PostgreSQL, and real-time communication via Socket.IO for the phone scanning feature. When an image is uploaded, it forwards the image to the Python service for barcode detection, then queries the Metron API for comic metadata.

**Python Barcode Service** (`/python-service`) - A FastAPI microservice dedicated to barcode detection. It receives images from the Express server and uses OpenCV and pyzbar to locate and decode UPC barcodes. This is separated from the main server because Python's computer vision libraries (OpenCV, pyzbar) are more mature and performant than JavaScript alternatives.

## Image Processing Pipeline

When an image is submitted for barcode scanning, it goes through a multi-tier processing pipeline designed to maximize detection success while minimizing processing time:

### Preprocessing

1. The image is decoded and converted to grayscale
2. CLAHE (Contrast Limited Adaptive Histogram Equalization) is applied to create an enhanced version that handles glare and uneven lighting
3. OpenCV's BarcodeDetector attempts to locate a barcode region for potential fallback cropping (with extra padding on the right side to capture the 5-digit extension)

### Scanning Tiers

The scanner uses a tiered approach, starting with fast methods and progressively trying more expensive operations:

**Tier 1 - Raw Grayscale**: The full original image is tried at all four 90° rotations. This catches most well-lit, properly oriented barcodes and has the best chance of finding both the main UPC and the 5-digit extension together.

**Tier 2 - Enhanced Image**: The CLAHE-enhanced version is tried at all rotations. This helps with images that have glare or poor contrast.

**Tier 3 - Fixed Thresholds**: Binary thresholding at multiple fixed values (140, 160, 180) is applied to the full image at all rotations. This catches barcodes that adaptive methods miss.

**Tier 4 - Cropped Region**: If a barcode region was detected during preprocessing, the cropped area is tried. This helps when the main barcode is hard to read but can be isolated.

**Tier 5 - Angle Corrections**: Small rotations (-5°, -3°, 3°, 5°) are applied to correct for slightly tilted photos.

**Tier 6 - Deep Processing**: For small or difficult images, upscaling (3x) combined with various threshold methods is attempted. Hough line detection is used to find the dominant angle and deskew the image.

### Result Merging

Throughout all tiers, results are accumulated. If the main UPC is found in one pass but the extension in another, both are kept. The scanner returns as soon as both the main barcode and extension are found, or continues through all tiers if only partial results are obtained.

Comic book UPCs consist of a 12-digit main barcode (UPC-A) plus a 5-digit extension (EAN-5) that encodes the issue number and printing. Both are required for accurate comic identification.

## Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL 15+
- [Metron API](https://metron.cloud/) credentials (for comic metadata)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/comic-scans.git
cd comic-scans
```

### 2. Set up the database

Using Docker:
```bash
docker-compose up -d db
```

Or install PostgreSQL locally and create a database.

### 3. Configure environment variables

**Server** (`/server/.env`):
```env
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydatabase
PORT=3001
JWT_SECRET=your-secret-key
METRON_USERNAME=your-metron-username
METRON_PASSWORD=your-metron-password
PYTHON_SERVICE_URL=http://localhost:8000
```

**Client** (`/client/.env`):
```env
VITE_API_URL=http://localhost:3001
```

### 4. Install dependencies

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install

# Python Service
cd ../python-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Note:** The Python service requires `zbar` library for barcode detection:
- macOS: `brew install zbar`
- Ubuntu: `sudo apt-get install libzbar0`
- Windows: Download from [zbar.sourceforge.net](http://zbar.sourceforge.net/)

### 5. Run the services

```bash
# Terminal 1 - Python Service
cd python-service
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 2 - Server
cd server
npm run dev

# Terminal 3 - Client
cd client
npm run dev
```

Or use Docker Compose for all services:
```bash
docker-compose up
```

The app will be available at `http://localhost:5173`

## Usage

### Adding Comics

1. **Manual Search** - Enter a UPC code in the search bar
2. **Upload Image** - Click "Upload Comic Image" and select a photo of the comic cover/barcode
3. **Phone Scanner** - Click "Scan with Phone" to get a QR code, scan it with your phone to use your phone's camera as a barcode scanner

### Managing Your Collection

- **Star** comics to mark favorites (starred comics appear first)
- **Sort** by series name (A-Z or Z-A) or custom order
- **Drag and drop** to reorder in custom mode
- **Export** your collection to CSV for backup
- **Import** from a previously exported CSV

## Tech Stack

### Client
- React 19
- TypeScript
- Vite
- React Router
- Socket.IO Client
- QRCode.react

### Server
- Express 5
- TypeScript
- Socket.IO
- PostgreSQL (pg)
- JWT Authentication
- Multer (file uploads)

### Python Service
- FastAPI
- OpenCV
- pyzbar
- NumPy

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comics?search=<upc>` | Search for a comic by UPC |
| POST | `/api/upload` | Upload an image for barcode scanning |
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/collection` | Get user's collection |
| POST | `/api/collection` | Add comic to collection |
| DELETE | `/api/collection/:upc` | Remove comic from collection |
| PATCH | `/api/collection/:upc/star` | Toggle star status |
| PUT | `/api/collection/reorder` | Update sort order |
| GET | `/api/collection/export` | Export collection as CSV |
| POST | `/api/collection/import` | Import collection from CSV |

## License

MIT
