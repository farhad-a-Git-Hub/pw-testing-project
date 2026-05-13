/**
 * TEST CONFIGURATION TEMPLATE
 * ---------------------------
 * ACTION PLAN:
 * 1. This file is kept in the project to define environment-specific variables.
 * 2. For local runs, replace placeholders with correct credentials.
 * 3. DO NOT commit real passwords to version control.
 * 4. Use the Terminal commands listed at the bottom to run from CLI.
 */


const processENV = process.env.TEST_ENV;
const env = processENV || 'qa';
console.log(`\n Running tests in environment: ${env.toUpperCase()}`);

// Default Configuration (Local/Dev)
const config = {
    apiUrl: 'http://localhost:3000',
    userEmail: 'PLACEHOLDER_EMAIL',
    userPassword: 'PLACEHOLDER_PASSWORD'
};

// Environment Switcher
if (env === 'qa') {
    config.apiUrl = 'http://localhost:3000';
    config.userEmail = 'admin@juice-sh.op'; // Publicly known Juice Shop demo account
    config.userPassword = 'admin123';
}

if (env === 'uat') {
    config.apiUrl = 'https://juice-shop-uat.herokuapp.com'; // Example UAT URL
    config.userEmail = 'uat-user@juice-sh.op';
    config.userPassword = 'uat-password-123';
}

export { config };

/**
 * EXECUTION COMMANDS:
 * 
 * Mac/Linux: 
 * TEST_ENV=qa npx playwright test
 * 
 * Windows (Command Prompt): 
 * set TEST_ENV=qa && npx playwright test
 * 
 * Windows (PowerShell): 
 * $env:TEST_ENV="qa"; npx playwright test
 */