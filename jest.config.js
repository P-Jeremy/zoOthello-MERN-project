process.env.MONGO_CONFIG_URL = 'mongodb://root:rootpassword@localhost:27017'

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-transform-css'
  },
  transformIgnorePatterns: [
    '<rootDir>/(node_modules)/?!(react-toastify/dist/ReactToastify)+(css)$'
  ]
}
