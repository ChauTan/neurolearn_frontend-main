module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Tính năng mới
        'fix', // Sửa lỗi
        'docs', // Tài liệu
        'style', // Thay đổi style (không ảnh hưởng đến logic)
        'refactor', // Tái cấu trúc code
        'perf', // Cải thiện hiệu suất
        'test', // Thêm hoặc sửa test
        'chore', // Cập nhật các công cụ, cấu hình
        'ci', // Thay đổi CI
        'build', // Thay đổi liên quan đến build
        'revert', // Hoàn tác commit trước đó
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', 'sentence-case'],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
  },
};
