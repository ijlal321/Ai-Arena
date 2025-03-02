# AI Arena - Startup Guide


## Watch Demo
[Watch the demo here](https://youtu.be/SnLImAM_5Ho)

## Full Pitch
[View the full pitch here](https://drive.google.com/file/d/1SuyG8EaARDe1j8zZL1A7Lq5PYFVQgUpp/view?usp=sharing)


## Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) and npm
- [pnpm](https://pnpm.io/installation)
- [Hardhat](https://hardhat.org/)

## Getting Started
Follow these steps to set up and run the project:

### Step 1: Setup Hardhat Environment
1. Open a terminal and navigate to the Hardhat project directory:
   ```sh
   cd my-hardhat-project
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Install Hardhat (if not already installed):
   ```sh
   npm install --save-dev hardhat
   ```
4. Start the Hardhat node:
   ```sh
   npx hardhat node
   ```

### Step 2: Setup AI Arena
1. Open a **new terminal** and navigate to the AI Arena directory:
   ```sh
   cd ai-arena-challenge
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Start the development server:
   ```sh
   pnpm run dev
   ```

### Step 3: Setup Eliza
1. Open another **new terminal** and navigate to the Eliza directory:
   ```sh
   cd eliza
   ```
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Build the project:
   ```sh
   pnpm build
   ```
4. Set up env
# EVM
EVM_PRIVATE_KEY=""
EVM_PROVIDER_URL="http://127.0.0.1:8545" hardhat local server

GROQ_API_KEY= ""  // our example models are set up with groq, but you can use any provider you want.



### Step 4: Start the Application
Run the following command to start the application with selected characters:
```sh
pnpm start --characters="characters/dark_santa.character.json,characters/quadra_blaze.character.json"
```

### Step 5: Open in Browser
Once everything is running, open your browser and go to:
```
http://localhost:8080
```

Your AI Arena environment should now be up and running!

