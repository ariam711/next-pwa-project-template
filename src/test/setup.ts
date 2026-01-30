import '@testing-library/jest-dom';

// Mock crypto.randomUUID
if (!global.crypto) {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => `test-uuid-${Math.random()}`,
    },
    writable: true,
  });
}
