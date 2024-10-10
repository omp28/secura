# Anonymous File Storage Web App

This web app allows users to securely store, manage, and share files using only a 12-digit string for login. No personal information is required, ensuring complete anonymity.

## Features

### 1. User Authentication (12-Digit String)

- Users log in with a unique 12-digit string.
- No email or personal information is collected.
- CAPTCHA and rate limiting prevent brute-force attacks.

### 2. Data Encryption and Compression

- All files are encrypted (AES-256) before storage.
- Files are compressed (ZIP/GZIP) to save space.
- Secure cloud storage for encrypted files.

### 3. Anonymous File Storage & Retrieval

- Files are mapped to the user’s 12-digit string.
- After login, users can view a list of file titles.

### 4. File Preview and Download

- Users can preview supported file types (e.g., PDFs, images).
- Download decrypted and decompressed files securely.

### 5. File Sharing (Public/Private Links)

- Public links: Share files with anyone via a random link.
- Private links: Require additional decryption or string for access.
- Optional: Set expiration times or limits on shared links.

### 6. Security Considerations

- Encryption keys derived from the 12-digit string (not stored).
- Rate limiting to protect against brute-force attacks.
- Users are responsible for their string (no recovery options).

### 7. Tech Stack Suggestions

- **Frontend**: React, Vue.js, or Angular.
- **Backend**: Node.js (Express) or Python (Flask/Django).
- **Database**: NoSQL (MongoDB).
- **File Storage**: AWS S3, Google Cloud Storage.

### 8. User Experience

- Simple login with the 12-digit string.
- Drag-and-drop file upload, easy previews, and downloads.
- Intuitive file sharing and management interface.

### 9. Privacy and Legal Considerations

- No personal data stored.
- Users manage their access keys.
- Ensure compliance with GDPR and data protection laws.
