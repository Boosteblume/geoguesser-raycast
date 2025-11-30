export interface ProfileResponse {
  user: User;
  playingRestriction: PlayingRestriction;
  email: string;
  isEmailChangeable: boolean;
  isEmailVerified: boolean;
  emailNotificationSettings: EmailNotificationSettings;
  isBanned: boolean;
  chatBan: boolean;
  distanceUnit: number;
  dateFormat: number;
  hideCustomAvatars: boolean;
  shareActivities: boolean;
  deviceToken: string;
}

export interface User {
  nick: string;
  created: string;
  isProUser: boolean;
  type: string;
  isVerified: boolean;
  pin: Pin;
  customImage: string | null;
  fullBodyPin: string;
  borderUrl: string;
  color: number;
  url: string;
  id: string;
  countryCode: string;
  br: BattleRoyale;
  streakProgress: Progress;
  explorerProgress: Progress;
  dailyChallengeProgress: number;
  lastClaimedLevel: number;
  progress: UserProgress;
  competitive: Competitive;
  lastNameChange: string;
  lastNickOrCountryChange: string;
  isBanned: boolean;
  chatBan: boolean;
  nameChangeAvailableAt: string | null;
  avatar: Avatar;
  isBotUser: boolean;
  suspendedUntil: string | null;
  wallet: number | null;
  flair: number;
  isCreator: boolean;
  isAppAnonymous: boolean;
}

export interface Pin {
  url: string;
  anchor: string;
  isDefault: boolean;
}

export interface BattleRoyale {
  level: number;
  division: number;
}

export interface Progress {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  levelXp: number;
  nextLevel: number;
  nextLevelXp: number;
  title: Title;
  competitionMedals: Progress;
}

export interface Title {
  id: number;
  tierId: number;
}

export interface Competitive {
  elo: number;
  rating: number;
  lastRatingChange: number;
  division: Division;
  onLeaderboard: boolean;
}

export interface Division {
  type: number;
  startRating: number;
  endRating: number;
}

export interface Avatar {
  fullBodyPath: string;
}

export interface PlayingRestriction {
  restriction: number;
  canPlayGame: boolean;
  canHostParty: boolean;
  description: string;
  ticket: string | null;
  periodicAllowanceMetadata: string | null;
  noRestrictionEndsAt: string | null;
}

export interface EmailNotificationSettings {
  sendDailyChallengeNotifications: boolean;
  sendDailyGameNotifications: boolean;
  sendChallengeNotifications: boolean;
  sendNewsNotifications: boolean;
  sendPromotionalNotifications: boolean;
  sendSocialNotifications: boolean;
  sendCompetitiveNotifications: boolean;
  unsubscribeToken: string | null;
}

export interface DailyChallengeResponse {
  token: string;
  date: string;
  description: string | null;
  participants: number;
  leaderboard: LeaderboardEntry[];
  authorCreator: {
    id: string;
    name: string;
    avatarImage: string;
  };
  pickedWinner: boolean;
  friends: any;
  country: any[];
}

export interface LeaderboardEntry {
  id: string;
  nick: string;
  pinUrl: string;
  totalScore: number;
  totalTime: number;
  totalDistance: number;
  countryCode: string;
  currentStreak: number;
  isVerified: boolean;
  flair: number;
}

export interface MyDailyChallengeScore {
  id: string;
  nick: string;
  pinUrl: string;
  totalScore: number;
  totalTime: number;
  totalDistance: number;
  isOnLeaderboard: boolean;
  isVerified: boolean;
  flair: number;
  countryCode: string;
  currentStreak: number;
  totalStepsCount: number | null;
}

export interface FeedEntry {
  type: number;
  time: string;
  user: {
    id: string;
    nick: string;
    isVerified: boolean;
    flair: number;
  };
  payload: string; // JSON string!
}

export interface FeedResponse {
  entries: FeedEntry[];
  paginationToken: string;
}

export interface DailyChallengePayload {
  mapSlug: string;
  mapName: string;
  points: number;
  challengeToken: string;
  gameMode: string;
  isDailyChallenge: boolean;
}

export interface GameDetails {
  token: string;
  type: string;
  mode: string;
  state: string;
  roundCount: number;
  timeLimit: number;
  forbidMoving: boolean;
  forbidZooming: boolean;
  forbidRotating: boolean;
  streakType: string;
  map: {
    id: string;
    name: string;
    slug: string;
  };
  mapName: string;
  player: {
    totalScore: {
      amount: number;
      unit: string;
      percentage: number;
    };
    guesses: GameGuess[];
    id: string;
    nick: string;
    isVerified: boolean;
  };
  rounds: GameRound[];
  created: string;
}

export interface GameRound {
  lat: number;
  lng: number;
  panoId: string;
  heading: number;
  pitch: number;
  zoom: number;
}

export interface GameGuess {
  lat: number;
  lng: number;
  roundScore: {
    amount: number;
    unit: string;
    percentage: number;
  };
  distance: {
    amount: number;
    unit: string;
  };
  time: number;
  timedOut: boolean;
  timedOutWithGuess: boolean;
}
