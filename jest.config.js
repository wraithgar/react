module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  cacheDirectory: '.test',
  collectCoverage: true,
  collectCoverageFrom: ['src/*.js', 'src/*.ts', 'src/*.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/test-matchers.js']
};
