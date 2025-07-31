# Mipripity Web Frontend

A property polling website for Mipripity, allowing users to vote on property preferences.

## Table of Contents

- [Project Overview](#project-overview)
- [Local Development](#local-development)
- [GitHub Repository Setup](#github-repository-setup)
- [Netlify Deployment](#netlify-deployment)
- [Additional Configuration](#additional-configuration)

## Project Overview

This is the frontend portion of the Mipripity web application, built with:

- React.js for UI components
- React Router for navigation
- Styled Components for styling
- Webpack for bundling

## Local Development

To run the project locally:

1. Install dependencies:
   ```
   cd src/frontend
   npm install
   ```

2. Start the development server:
   ```
   npm run client
   ```
   This will start the webpack dev server at http://localhost:8080

3. Build for production:
   ```
   npm run build:frontend
   ```
   This will create optimized production files in the `dist` directory.

## GitHub Repository Setup

To push your project to GitHub:

1. Create a new repository on GitHub.

2. Initialize git in your project folder (if not already done):
   ```
   cd src/frontend
   git init
   ```

3. Add all files to git:
   ```
   git add .
   ```

4. Commit the files:
   ```
   git commit -m "Initial commit"
   ```

5. Add your GitHub repository as remote:
   ```
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```

6. Push to GitHub:
   ```
   git push -u origin main
   ```
   (or `master` depending on your default branch name)

## Netlify Deployment

To deploy the frontend on Netlify:

### Option 1: Deploy via GitHub

1. Sign up or log in to [Netlify](https://www.netlify.com/).

2. Click "New site from Git" and select your GitHub repository.

3. Configure the build settings:
   - Build command: `npm run build:frontend`
   - Publish directory: `dist`
   - Base directory: `src/frontend`

4. Click "Deploy site" and wait for the build to complete.

### Option 2: Manual Deploy

1. Build your project locally:
   ```
   cd src/frontend
   npm run build:frontend
   ```

2. Drag and drop the `dist` folder onto Netlify's manual deploy area.

## Additional Configuration

The project includes several configuration files for Netlify:

- **netlify.toml**: Contains build settings and redirect rules
- **public/_redirects**: Ensures proper routing for the SPA

### Environment Variables

If your app requires environment variables, you can set them in the Netlify UI:

1. Go to Site settings > Build & deploy > Environment
2. Add the variables you need for your application

### Custom Domain

To set up a custom domain:

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS settings

---

For any issues or questions, please open an issue in the GitHub repository.