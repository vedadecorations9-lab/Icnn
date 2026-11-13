import { execSync } from 'node:child_process';

const hasDeployKey = Boolean(process.env.CONVEX_DEPLOY_KEY || process.env.CONVEX_DEPLOYMENT);

if (hasDeployKey) {
  console.log('⚡ [Convex] Deploying database functions and schema to Convex Cloud...');
  try {
    execSync('npx convex deploy', { stdio: 'inherit' });
    console.log('✅ [Convex] Database functions deployed successfully!');
  } catch (err) {
    console.error('❌ [Convex] Deployment failed:', err.message);
    process.exit(1);
  }
} else {
  console.log('ℹ️ [Convex] No CONVEX_DEPLOY_KEY set in local environment, skipping cloud backend deployment.');
}

console.log('📦 [Vite] Building frontend bundle...');
execSync('npx vite build', { stdio: 'inherit' });
