module.exports = {
  // Chạy ESLint trên các file JavaScript và TypeScript
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // Chạy Prettier trên các file khác
  '**/*.{json,css,scss,md}': ['prettier --write'],

  // Không chạy lệnh nào trên những file bị ignore bởi .gitignore
  '**/*.{png,jpg,jpeg,gif,svg,ico}': [],
};
