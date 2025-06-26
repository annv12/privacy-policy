// Simple in-memory token store (should use DB in production)
const tokenStore: Record<string, string> = {};

export const saveAccessToken = (userId: string, accessToken: string) => {
  tokenStore[userId] = accessToken;
  console.log(`[TOKEN] Saved for user ${userId}: ${accessToken}`);
};

export const getAccessToken = (userId: string): string | undefined => {
  return tokenStore[userId];
};
