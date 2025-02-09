# macOS Screenshot Auto-Upload Guide for New Users

This guide will help you set up an **automatic screenshot upload system** on macOS using the shortcut **Command + Shift + =**. Once set up, pressing this shortcut will take a screenshot, upload it to `https://your.chibi.domain.com/api/upload`, and copy the image URL to your clipboard.

## Features
✅ **Global shortcut (Command + Shift + =) to take & upload screenshots**  
✅ **Automatic upload to `https://your.chibi.domain.com/api/upload`**  
✅ **Copy the uploaded image URL to the clipboard**  
✅ **macOS notifications for success or failure**

---

## 📌 Step 1: Create the Screenshot Upload Script

1. Open **Terminal** (`⌘ + Space`, type "Terminal", press `Enter`).
2. Run:
   ```bash
   nano ~/screenshot_upload.sh
   ```
3. **Paste the following script**:
   ```bash
   #!/bin/bash
   
   # Configuration
   API_KEY="YOUR_API_KEY_HERE" #Put the api key from `Dashboard -> Credentials -> API Key` here
   UPLOAD_URL="https://your.chibi.domain.com/api/upload" #Please change `your.chibi.domain.com` to your domain for your instance
   SCREENSHOT_PATH="$HOME/Desktop/screenshot_$(date +%Y-%m-%d_%H-%M-%S).png"
   
   # Take Screenshot (Interactive Mode)
   screencapture -i "$SCREENSHOT_PATH"
   
   # Upload Screenshot
   response=$(curl -s -F "file=@$SCREENSHOT_PATH" -H "x-api-key: $API_KEY" "$UPLOAD_URL")
   
   # Check if upload was successful
   if echo "$response" | grep -q "url"; then
       url=$(echo "$response" | jq -r '.url')
       echo "$url" | pbcopy
       osascript -e "display notification \"Upload successful! URL copied to clipboard.\" with title \"Screenshot Upload\""
   else
       osascript -e "display notification \"Upload failed!\" with title \"Screenshot Upload\""
       echo "Upload failed: $response"
   fi
   
   # Optional: Delete the screenshot after upload
   rm "$SCREENSHOT_PATH"
   ```
   
3a. **Please MAKE SURE TO CHANGE `your.chibi.domain.com` to your actual domain for your chibisafe instance!**
4. **Save and exit**:
    - Press `CTRL + X`, then `Y`, then `Enter`.
5. **Make it executable**:
   ```bash
   chmod +x ~/screenshot_upload.sh
   ```

---

## 📌 Step 2: Create an Automator Quick Action

1. **Open Automator** (`⌘ + Space`, type "Automator", press `Enter`).
2. Click **"New Document"** → **Select "Quick Action"** → Click **"Choose"**.
3. In **"Workflow receives current"**, select `no input` in `any application`.
4. In **the left panel**, search for **"Run Shell Script"**, then **drag it into the workflow**.
5. In the **Run Shell Script** box:
    - Change **Shell** to `/bin/bash`.
    - Paste this command:
      ```bash
      ~/screenshot_upload.sh
      ```
6. **Save the Automator Quick Action**:
    - Click **File → Save**.
    - Name it **"Screenshot Uploader"**.

---

## 📌 Step 3: Assign a Global Shortcut (`⌘ + ⇧ + =`)

1. Open **System Settings** → **Keyboard** → **Keyboard Shortcuts**.
2. Select **"Services"** on the left.
3. Scroll down to **"General"**, and find **"Screenshot Uploader"**.
4. Click **"Add Shortcut"**, and press **⌘ + ⇧ + =**.

✅ Now, `⌘ + ⇧ + =` will **capture a screenshot and upload it** automatically.

---

## 📌 Step 4: Ensure Full Disk Access (Optional)

1. Go to **System Settings → Privacy & Security → Full Disk Access**.
2. Click **"+"**, then add:
    - **Automator**
    - **Terminal**
    - **Screenshot Uploader (if visible)**

---

## 🚀 Usage
Now, whenever you press `⌘ + ⇧ + =`, macOS will:
✅ **Capture a screenshot interactively**.  
✅ **Upload it automatically** to `https://your.chibi.domain.com/api/upload`.  
✅ **Copy the uploaded image URL** to your clipboard.  
✅ **Show a success/failure notification**.  
✅ **Work globally in any app**.

This setup ensures a **seamless screenshot upload process**! 🚀

**Please MAKE SURE TO CHANGE `your.chibi.domain.com` to your actual domain for your chibisafe instance!**

