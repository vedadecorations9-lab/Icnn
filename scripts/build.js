import { execSync } from 'node:child_process';

// Only attempt convex deploy if a valid secret deploy key is explicitly provided
const deployKey = process.env.CONVEX_DEPLOY_KEY;

if (deployKey) {
  console.log('⚡ [Convex] Deploying database functions and schema to Convex Cloud...');
  try {
    execSync('npx convex deploy', { stdio: 'inherit' });
    console.log('✅ [Convex] Database functions deployed successfully!');
  } catch (err) {
    console.warn('⚠️ [Convex] Cloud deploy encountered an issue, proceeding with frontend build:', err.message);
  }
} else {
  console.log('ℹ️ [Convex] No CONVEX_DEPLOY_KEY set in environment, building frontend directly.');
}

console.log('📦 [Vite] Building frontend bundle...');
execSync('npx vite build', { stdio: 'inherit' });

