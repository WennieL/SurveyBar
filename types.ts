
export enum SurveyTheme {
  EDUCATION = 'Education',
  PRODUCT_LAUNCH = 'Product Launch',
  ACADEMIC_RESEARCH = 'Academic Research',
  MARKET_RESEARCH = 'Market Research',
  USER_EXPERIENCE = 'User Experience',
  FUN_SOCIAL = 'Fun & Social',
  OTHER = 'Other'
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  link: string;
  creatorName: string;
  theme: SurveyTheme;
  targetResponses: number;
  currentResponses: number;
  pointsReward: number;
  closingDate: string;
  createdAt: string;
  estimatedTime?: number; // Minutes
  isPromoted?: boolean;
  targetCriteria?: string; // e.g. "University Students", "Renters"
  targetLocation?: string; // e.g. "Global", "Taiwan", "US"
  targetAge?: string; // e.g. "18-24", "All"
  targetLanguage?: string; // e.g. "English", "Mandarin"
  isClosed?: boolean; // Manually closed or finished
  extensionCount?: number; // How many times it has been extended
  verificationCode?: string; // 新增：研究者設定的驗證碼
}

export interface User {
  id: string;
  name: string;
  points: number;
  completedSurveyIds: string[]; // IDs of surveys user has finished
  surveysPostedIds: string[]; // IDs of surveys user created
  dailyCompletions: { date: string; count: number }; // Track daily limit
  lastCompletionTimestamp: number; // For cooldown logic
  hasUsedFreeBoost: boolean; // Track if the one-time free boost has been used
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
