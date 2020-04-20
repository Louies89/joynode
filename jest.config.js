module.exports = {
    roots: ['<rootDir>'],
    verbose: true,
    moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
    testPathIgnorePatterns: ['./node_modules/'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
  };