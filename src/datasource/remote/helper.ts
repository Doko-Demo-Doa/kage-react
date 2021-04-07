import fetchR from 'fetch-retry';

export const fetchRetry = fetchR(fetch, {
  retries: 30,
  retryDelay: 2000,
});
