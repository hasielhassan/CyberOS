---
description: Deploy CyberOS to GitHub Pages
---

# Deploying CyberOS

The project is configured to deploy to GitHub Pages using the `gh-pages` package.

## Prerequisites
- Ensure you are logged into GitHub and have push access to the repository.
- Ensure the repository is connected to a GitHub remote.

## Deployment Steps

1.  **Run the Deploy Script**:
    This command will automatically build the project (using `npm run build`) and push the `dist` folder to the `gh-pages` branch.
    ```bash
    npm run deploy
    ```

2.  **Verify Deployment**:
    - Go to your GitHub repository settings -> Pages.
    - Ensure the source is set to the `gh-pages` branch.
    - Visit the deployed URL (e.g., `https://your-username.github.io/CyberOS/` or your custom domain).

## Troubleshooting
- **404 Errors**: Ensure `vite.config.ts` has the correct `base` path.
    - If using a custom domain (e.g., `www.hasielhassan.com`), set `base: '/'`.
    - If using GitHub Pages default (e.g., `username.github.io/repo`), set `base: '/repo-name/'`.
- **Build Failures**: Check the console output for TypeScript or Vite errors during the `predeploy` step.
