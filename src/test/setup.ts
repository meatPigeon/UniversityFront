import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // Need this for matchers like toBeInTheDocument

// cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
