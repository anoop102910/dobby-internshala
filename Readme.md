I’m building a Google Drive-like application where users can create folders, upload images efficiently.

Tech Stack:
Cloudinary → For image uploads
MongoDB → For storing images and user data
Data Models:

User Model:
username
email
password

Root Folder Model:
name
size
ownerId (Reference to the user who created the folder)
itemsCount (number of items in the folder)

Folder Model:
name
size
folderId? (Reference to parent folder)
ownerId (Reference to the user who created the folder)
itemsCount (number of items in the folder)

Image Model (Images):
imageUrl
size
type (jpg, png, etc.)
folderId (Reference to the folder it belongs to)
ownerId (Reference to the user who created the image)

Functionality:
✅ Users can create new folders
✅ Inside a folder, users can upload images
✅ ShadCN Dialog is used for folder creation (similar to the UI in the provided screenshot)
✅ Clicking "New Folder" opens a modal where users enter a folder name, and on submit, a new folder is created using frontend params (folder name + folder ID)

API Endpoints:
📂 /folders (Auth Required)
→ Returns all root folders for the authenticated user

📂 /folders/:folderId (Auth Required)
→ Returns all folders and images inside the given folder

🔹 Create Folder
🔹 Add Image to Folder
🔹 Delete Folder
🔹 Delete Image

