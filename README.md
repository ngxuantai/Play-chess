## Pre-requisites

- Node.js
- Google OAuth 2.0 credentials

## Get started

1. Clone the repository

   ```bash
   git clone https://github.com/ngxuantai/Play-chess.git
   cd Play-chess
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create Release key SHA-1 key, config Google Developer Console

   ```bash
   cd android/app
   keytool -genkey -v -keystore my_release_key.keystore -alias my_key_alias -keyalg RSA -keysize 2048 -validity 10000
   ```

   - Fill in some information as required.

   - Generate the SHA-1 key:

   ```bash
   keytool -list -v -keystore my_release_key.keystore -alias my_key_alias
   ```

   - Enter the password you provided above.

   - Create an OAuth client ID.
   - Set the Application type to Android, use the SHA-1 key from the step above, and for the Package name, enter com.anonymous.playchess to complete the application creation process.

4. Environment Variables

   - Duplicate the file `.env.example` and rename to `.env`
   - Update the values of the environment variables.

5. Start the app

   ```bash
   npx expo run:android
   ```
