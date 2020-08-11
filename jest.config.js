process.env.MONGO_CONFIG_URL = 'mongodb://root:rootpassword@localhost:27017'

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.+\\.(css|styl|less|sass|scss)$': 'jest-transform-css'
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules'
  },
  transformIgnorePatterns: [
    '<rootDir>/(node_modules)/?!(react-toastify/dist/ReactToastify)+(css)$'
  ]
}
