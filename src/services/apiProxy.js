import {
  mockFetchMessages,
  mockLoginUser
} from './mockApi';

// Use mock data in development
const useMocks = process.env.NODE_ENV === 'development';

export const fetchMessages = useMocks ? mockFetchMessages : realFetchMessages;
export const loginUser = useMocks ? mockLoginUser : realLoginUser;
// Add other endpoints...