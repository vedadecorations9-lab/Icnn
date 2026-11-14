import { execSync } from 'node:child_process';

// Only attempt convex deploy if a valid secret deploy key is explicitly provided
const deployKey = process.env.CONVEX_DEPLOY_KEY;

if (deployKey) {
  console.log('⚡ [Convex] CONVEX_DEPLOY_KEY detected! Deploying database functions and auto-injecting deployment URL...');
  try {
    // Official Convex CI deploy pattern:
    // It deploys functions & schema to Convex Cloud, automatically retrieves the deployment URL,
    // injects VITE_CONVEX_URL into the environment, and runs vite build.
    execSync('npx convex deploy --cmd "npx vite build"', { stdio: 'inherit' });
    console.log('✅ [Convex] Successfully deployed backend and built frontend bundle!');
    process.exit(0);
  } catch (err) {
    console.warn('⚠️ [Convex] Deployment with --cmd encountered an issue, falling back to direct build:', err.message);
  }
} else {
  console.log('ℹ️ [Convex] No CONVEX_DEPLOY_KEY set in environment, building frontend directly.');
}

console.log('📦 [Vite] Building frontend bundle...');
execSync('npx vite build', { stdio: 'inherit' });

