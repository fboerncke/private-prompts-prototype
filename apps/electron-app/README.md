
# Self-Signing and Building the Private Prompts App for Mac OS

(this document may be outdated)

This guide explains how to create and use a self-signed certificate to build and sign the Private Prompts app. It is designed for developers, including novices, who need to run and distribute the app without an Apple Developer ID.

---

## Step 1: Create a Self-Signed Certificate

1. Open **Terminal** and run the following command to create a self-signed certificate and private key:
   ```bash
   openssl req -x509 -newkey rsa:4096 -keyout selfsign.key -out selfsign.crt -days 365 -nodes
   ```
   - Fill in the requested information:
     - **Country Name**: e.g., `US`
     - **State or Province Name**: e.g., `California`
     - **Locality Name**: e.g., `San Francisco`
     - **Organization Name**: e.g., `Private Prompts`
     - **Common Name**: e.g., `privateprompts.local`
   - This generates two files:
     - `selfsign.key`: The private key.
     - `selfsign.crt`: The certificate.

2. Combine the certificate and private key into a `.p12` file:
   ```bash
   openssl pkcs12 -export -out selfsign.p12 -inkey selfsign.key -in selfsign.crt
   ```
   - You’ll be prompted to set a password for the `.p12` file. Make sure to remember it.

---

## Step 2: Import the Certificate into macOS Keychain

1. Open **Keychain Access**:
   - Go to **Applications → Utilities → Keychain Access**.

2. Import the `.p12` file:
   - Click **File → Import Items...**.
   - Select `selfsign.p12` and click **Open**.å
   - Enter the password you set during the `.p12` creation.

3. Trust the Certificate:
   - Locate the certificate in the **"Login"** keychain.
   - Right-click the certificate and select **Get Info**.
   - Expand the **Trust** section.
   - Set **When using this certificate** to **Always Trust**.
   - Close the window and enter your macOS password to save changes.

---

## Step 3: Configure the Build Process

1. Place the `.p12` file in a secure location (outside the project folder), e.g.,:
   ```plaintext
   ~/.certificates/private-prompts/selfsign.p12
   ```

2. Add the following environment variables to your terminal before building:
   ```bash
   export CSC_LINK=~/.certificates/private-prompts/selfsign.p12
   export CSC_KEY_PASSWORD="your-password"
   ```

   Replace `your-password` with the password you set during `.p12` creation.

3. Ensure your `electron-builder.json` has the following configuration to skip unnecessary notarization:
   ```json
   {
     "mac": {
       "target": [
         "dmg",
         "zip"
       ],
       "icon": "../../assets/icons/private-prompts-logo-orange-bubble-512.png",
       "hardenedRuntime": false,
       "gatekeeperAssess": false,
       "identity": null
     }
   }
   ```

---

## Step 4: Build the App

1. Run the following command to build the macOS app:
   ```bash
   npm run build:mac
   ```

2. Locate the built app in the `dist/` directory, e.g.,:
   ```plaintext
   dist/arm64/mac-arm64/Private Prompts.app
   ```

---

## Step 5: Distribute and Run the App

1. To distribute the app, package it as a `.dmg` or `.zip`:
   - The `.dmg` file can be shared with other macOS users.

2. If Gatekeeper blocks the app when running it:
   - Right-click the app in Finder.
   - Select **Open**, and confirm the security warning.

3. Alternatively, the user can remove Gatekeeper’s quarantine attribute:
   ```bash
   xattr -rd com.apple.quarantine /path/to/Private\ Prompts.app
   ```

---

## Security Best Practices

- **Do not commit the `selfsign.key`, `selfsign.crt`, or `selfsign.p12` files to Git.**
  - Add the following to `.gitignore`:
    ```plaintext
    *.crt
    *.key
    *.p12
    ```
- Store the `.p12` file securely and only share it via secure channels if needed.

---

## Troubleshooting

### **MAC verification failed during PKCS12 import**
- Ensure the correct password is used when importing the `.p12` file.
- Recreate the `.p12` file using:
  ```bash
  openssl pkcs12 -export -out selfsign.p12 -inkey selfsign.key -in selfsign.crt
  ```

### **The App Is Blocked by Gatekeeper**
- Ensure you’ve set `"identity": null` in the `electron-builder.json` file.
- Follow the steps in [Step 5](#step-5-distribute-and-run-the-app) to bypass Gatekeeper.

---

This guide ensures any developer can self-sign and build the app without relying on a paid Apple Developer ID. If you encounter any issues, feel free to ask for help! 😊
