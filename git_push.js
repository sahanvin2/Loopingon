const { execSync } = require('child_process');
execSync('git add apps/web/Dockerfile', { stdio: 'inherit' });
execSync('git commit -m "fix: web Dockerfile standalone copy paths"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
