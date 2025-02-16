# Cloud Drive

A cloud drive application built with Bun, React, and MongoDB.  It is a simple cloud drive application that allows you to upload, download, and share images

# Installation

To install the project using Bun, follow these steps:

1. Ensure you have [Bun](https://bun.sh/) installed on your machine.
2. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
3. Install the dependencies:
   ```bash
   bun install
   ```

4. Create a `.env` file in the root directory and add the following variables:
   ```bash
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION_TIME=your_jwt_expiration_time
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLOUDINARY_FOLDER=your_cloudinary_folder
   FILE_UPLOAD_LIMIT=10
   ```


Replace the values with your specific settings.
