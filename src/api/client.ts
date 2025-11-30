import { getPreferences } from "../preferences";

const BASE_URL = "https://www.geoguessr.com/api";

export async function apiRequest<T>(endpoint: string): Promise<T> {
  const { ncfaToken } = getPreferences();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Cookie: `_ncfa=${ncfaToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// API functions
export async function getProfile() {
  return apiRequest("/v3/profiles");
}

export async function getProfileStats() {
  return apiRequest("/v3/profiles/stats");
}

export async function getDailyChallenge() {
  return apiRequest("/v3/challenges/daily-challenges/today");
}

export async function getMyDailyChallengeScore() {
  return apiRequest("/v3/challenges/daily-challenges/me");
}

export async function getFeed(count = 10, page = 0) {
  return apiRequest(`/v4/feed/private?count=${count}&page=${page}`);
}

export async function getPreviousDailyChallenge() {
  return apiRequest("/v3/challenges/daily-challenges/previous");
}
