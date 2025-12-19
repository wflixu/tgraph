#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking node_modules structure...\n');

// Check root node_modules
const rootNodeModules = path.join(process.cwd(), 'node_modules');
if (fs.existsSync(rootNodeModules)) {
  const rootStats = fs.statSync(rootNodeModules);
  console.log(`✅ Root node_modules exists (${rootStats.size} bytes)`);
} else {
  console.log('❌ Root node_modules not found');
}

// Check workspace packages
const packagesDir = path.join(process.cwd(), 'packages');
if (fs.existsSync(packagesDir)) {
  const packages = fs.readdirSync(packagesDir)
    .filter(item => {
      const itemPath = path.join(packagesDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

  let totalSubNodeModules = 0;
  const subNodeModulesInfo = [];

  packages.forEach(pkg => {
    const pkgNodeModules = path.join(packagesDir, pkg, 'node_modules');
    if (fs.existsSync(pkgNodeModules)) {
      const stats = fs.statSync(pkgNodeModules);
      const items = fs.readdirSync(pkgNodeModules).length;
      totalSubNodeModules++;
      subNodeModulesInfo.push({
        package: pkg,
        size: stats.size,
        items: items
      });
    }
  });

  if (totalSubNodeModules > 0) {
    console.log(`\n📦 ${totalSubNodeModules} packages have local node_modules:`);
    subNodeModulesInfo.forEach(info => {
      console.log(`  - ${info.package}: ${info.items} items (${Math.round(info.size / 1024)}KB)`);
    });
    console.log('\n💡 This is normal for tools like TypeScript, ESLint, Vitest, etc.');
  } else {
    console.log('\n✅ No local node_modules found in packages (all hoisted to root)');
  }
}

console.log('\n🎯 Configuration summary:');
console.log('- hoist=true: Enable dependency hoisting');
console.log('- shamefully-hoist=true: Hoist dev dependencies');
console.log('- prefer-workspace-packages=true: Prefer workspace packages');
console.log('- nohoist-patterns: Specific packages kept local to avoid conflicts');