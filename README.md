# TinderDev 🚀

This is a Node.js backend project built using **Express.js**.  
It uses **Nodemon** to automatically restart the server during development.

---

## 🛠️ Project Setup Instructions

### 1️⃣ Initialize the Project

Initialize the project using npm:

```bash
npm init
```
This command creates a package.json file which is used to manage:

Project configuration

Dependencies

Scripts

2️⃣ Install Express

Install Express to create the backend server:
``` bash
npm i express
```
3️⃣ Install Nodemon

Install Nodemon globally:
```bash
npm install -g nodemon
```
🔁 Why Nodemon?

Before Nodemon
If you make any changes in the code, you must restart the server manually every time:
🔁 Why Nodemon?

node src/app.js
After Installing Nodemon
You only need to run the command once:
```bash
nodemon src/app.js
```
Nodemon will automatically restart the server whenever any file changes.

4️⃣ Update package.json Scripts

Add the following scripts inside the package.json file:
``` bash
"scripts": {
  "start": "node src/app.js",
  "dev": "nodemon src/app.js"
}```

5️⃣ Run the Server

Run the server in development mode:
``` bash
npm run dev
```
Run the server in production mode:
``` bash
npm start
```
✅ Summary

```bash
npm init
 ```→ initializes the project and creates package.json

``` bash
npm i express
``` → installs Express.js

```bash
npm install -g nodemon
``` → installs Nodemon globally

```bash
npm run dev
 ```→ runs the server with auto-reload

```bash
npm start
``` → runs the server normally
