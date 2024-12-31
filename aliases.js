const fs = require('fs');
const path = require('path');

// Đọc package.json
const packageJsonPath = path.resolve('package.json');
const packageJson = require(packageJsonPath);

// Đọc alias từ package.json
const aliases = packageJson._moduleAliases || {};

// Chuyển đổi alias sang định dạng paths
const paths = {};
Object.keys(aliases).forEach((key) => {
  const aliasPath = aliases[key];
  paths[key + '/*'] = [aliasPath + '/*'];
});

// Tạo nội dung jsconfig.json/tsconfig.json
const config = {
  compilerOptions: {
    baseUrl: ".",
    paths,
  },
};

// Ghi file jsconfig.json
const configPath = path.resolve('jsconfig.json');
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log(`Aliases have been synced to ${configPath}`);
