
import { Survey, SurveyTheme, User } from './types';

// ==========================================
// CONFIGURATION
// ==========================================

export const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4t2v86JMdMPpTvXXTmY0uWB-D2cpcSE7-0VdPen_xacBHbu0SpNHG98A0pbYxo2zPOw/exec'; 

// ==========================================
// MOCK DATA
// ==========================================

export const MOCK_USER: User = {
  id: 'current-user-123',
  name: 'Alex Builder',
  points: 500,
  completedSurveyIds: [],
  surveysPostedIds: ['s5', 's6', 's11', 's12'],
  dailyCompletions: { date: new Date().toDateString(), count: 0 },
  lastCompletionTimestamp: 0,
  hasUsedFreeBoost: false
};

const NOW = Date.now();
const DAY_MS = 86400000;

export const MOCK_SURVEYS: Survey[] = [
  {
    id: 's1',
    title: 'New Eco-Friendly Coffee Cup Design',
    description: 'We are launching a new sustainable coffee cup. Help us choose the best color palette and ergonomic shape! Takes about 3 minutes.',
    link: 'https://forms.google.com/example',
    creatorName: 'Sarah G.',
    theme: SurveyTheme.PRODUCT_LAUNCH,
    targetResponses: 100,
    currentResponses: 45,
    pointsReward: 1,
    closingDate: new Date(NOW + DAY_MS * 10).toISOString(),
    createdAt: new Date(NOW - DAY_MS * 2).toISOString(),
    estimatedTime: 3,
    isPromoted: true,
    targetCriteria: 'Coffee Drinkers',
    targetLocation: 'Global',
    targetAge: 'All',
    targetLanguage: 'English',
    extensionCount: 0,
    verificationCode: 'ECO25' // Demo 驗證碼: ECO25
  },
  {
    id: 's2',
    title: 'University Student Sleep Patterns',
    description: 'Academic research for my Psychology thesis. Looking for current university students to share their sleep habits.',
    link: 'https://typeform.com/example',
    creatorName: 'Mike Ross',
    theme: SurveyTheme.ACADEMIC_RESEARCH,
    targetResponses: 50,
    currentResponses: 48,
    pointsReward: 1,
    closingDate: new Date(NOW + DAY_MS * 5).toISOString(),
    createdAt: new Date(NOW - DAY_MS * 5).toISOString(),
    estimatedTime: 5,
    targetCriteria: 'University Students',
    targetLocation: 'Global',
    targetAge: '18-25',
    targetLanguage: 'English',
    extensionCount: 0
  },
  {
    id: 's3',
    title: 'SaaS Dashboard Usability Test',
    description: 'We need feedback on our new analytics dashboard layout. Please watch the short video and answer 5 questions.',
    link: 'https://surveymonkey.com/example',
    creatorName: 'TechFlow Inc.',
    theme: SurveyTheme.USER_EXPERIENCE,
    targetResponses: 200,
    currentResponses: 12,
    pointsReward: 3,
    closingDate: new Date(NOW + DAY_MS * 29).toISOString(),
    createdAt: new Date(NOW - 3600000).toISOString(),
    estimatedTime: 10,
    targetCriteria: 'Data Analysts / PMs',
    targetLocation: 'US, UK, CA',
    targetAge: '25-45',
    targetLanguage: 'English',
    extensionCount: 0
  },
  {
    id: 's4',
    title: 'Vegan Cake Flavor Preferences',
    description: 'I am a home baker testing out new vegan recipes. Which flavors sound most appealing to you?',
    link: 'https://forms.google.com/example2',
    creatorName: 'Baker Jess',
    theme: SurveyTheme.MARKET_RESEARCH,
    targetResponses: 30,
    currentResponses: 5,
    pointsReward: 1,
    closingDate: new Date(NOW + DAY_MS * 15).toISOString(),
    createdAt: new Date(NOW - 7200000).toISOString(),
    estimatedTime: 2,
    targetCriteria: 'Vegan / Dessert Lovers',
    targetLocation: 'Taiwan',
    targetAge: 'All',
    targetLanguage: 'Mandarin/English',
    extensionCount: 0
  },
  {
    id: 's5',
    title: 'Freelancer Tools Preference',
    description: 'I am building a tool for freelancers to manage invoices. What is your biggest pain point?',
    link: 'https://forms.google.com/example-freelance',
    creatorName: 'Alex Builder',
    theme: SurveyTheme.MARKET_RESEARCH,
    targetResponses: 50,
    currentResponses: 12,
    pointsReward: 1,
    closingDate: new Date(NOW + DAY_MS * 14).toISOString(), 
    createdAt: new Date(NOW - DAY_MS * 1).toISOString(),
    estimatedTime: 2,
    isPromoted: false,
    targetCriteria: 'Freelancers',
    targetLocation: 'Global',
    targetAge: '20+',
    targetLanguage: 'English',
    extensionCount: 0
  },
  {
    id: 's6',
    title: 'Weekend Activity Preferences',
    description: 'Quick poll for a community event I am organizing. Music vs Food?',
    link: 'https://typeform.com/example-event',
    creatorName: 'Alex Builder',
    theme: SurveyTheme.FUN_SOCIAL,
    targetResponses: 100,
    currentResponses: 88,
    pointsReward: 1,
    closingDate: new Date(NOW - DAY_MS * 1).toISOString(),
    createdAt: new Date(NOW - DAY_MS * 30).toISOString(),
    estimatedTime: 1,
    isPromoted: false,
    targetCriteria: 'Locals',
    targetLocation: 'Taipei',
    targetAge: 'All',
    targetLanguage: 'Mandarin',
    extensionCount: 0
  },
  {
    id: 's7',
    title: '台北捷運通勤滿意度調查',
    description: '我們是一群關注公共交通的大學生，希望能了解大家對於台北捷運尖峰時段的搭乘體驗與建議。填答時間約 3 分鐘。',
    link: 'https://forms.google.com/mrt-survey',
    creatorName: '王小明',
    theme: SurveyTheme.ACADEMIC_RESEARCH,
    targetResponses: 100,
    currentResponses: 23,
    pointsReward: 1,
    closingDate: new Date(NOW + DAY_MS * 14).toISOString(),
    createdAt: new Date(NOW - DAY_MS * 0.5).toISOString(),
    estimatedTime: 3,
    isPromoted: true,
    targetCriteria: '捷運通勤族',
    targetLocation: '台北/新北',
    targetAge: '全部',
    targetLanguage: '中文',
    extensionCount: 0,
    verificationCode: 'MRT888' // Demo 驗證碼: MRT888
  },
  {
    id: 's8',
    title: '手搖飲消費習慣大調查',
    description: '想知道大家一週都喝幾杯手搖飲？對於甜度冰塊的偏好？填寫問卷有機會抽中飲料提袋！',
    link: 'https://typeform.com/bubble-tea',
    creatorName: '珍奶愛好者',
    theme: SurveyTheme.FUN_SOCIAL,
    targetResponses: 200,
    currentResponses: 145,
    pointsReward: 1,
    closingDate: new Date(NOW + DAY_MS * 7).toISOString(),
    createdAt: new Date(NOW - DAY_MS * 1.5).toISOString(),
    estimatedTime: 2,
    targetCriteria: '愛喝飲料的人',
    targetLocation: '台灣',
    targetAge: '15-40歲',
    targetLanguage: '中文',
    extensionCount: 0
  },
  {
    id: 's9',
    title: '遠端工作效率與生活平衡',
    description: '針對目前正在進行混合辦公或全遠端工作的職場人士，探討工作與生活平衡的現況與挑戰。',
    link: 'https://surveymonkey.com/remote-work-tw',
    creatorName: 'HR Sarah',
    theme: SurveyTheme.MARKET_RESEARCH,
    targetResponses: 50,
    currentResponses: 12,
    pointsReward: 2,
    closingDate: new Date(NOW + DAY_MS * 27).toISOString(),
    createdAt: new Date(NOW - DAY_MS * 2.5).toISOString(),
    estimatedTime: 8,
    targetCriteria: '遠端工作者',
    targetLocation: '台灣',
    targetAge: '22-55歲',
    targetLanguage: '中文',
    extensionCount: 0
  },
  {
    id: 's10',
    title: '2025 大學生理財觀念調查',
    description: '調查現代大學生的理財工具使用情形（股票、ETF、加密貨幣、定存等），以及對未來的財務規劃。',
    link: 'https://forms.google.com/finance-students',
    creatorName: '政大理財研究社',
    theme: SurveyTheme.EDUCATION,
    targetResponses: 80,
    currentResponses: 45,
    pointsReward: 1,
    closingDate: new Date(NOW + DAY_MS * 20).toISOString(),
    createdAt: new Date(NOW - DAY_MS * 4).toISOString(),
    estimatedTime: 5,
    targetCriteria: '在學大學生',
    targetLocation: '全台大專院校',
    targetAge: '18-24歲',
    targetLanguage: '中文',
    extensionCount: 0
  },
  {
    id: 's11',
    title: 'Beta App Feedback (Expired)',
    description: 'We finished our beta testing phase last week. Looking for final thoughts from users who participated.',
    link: 'https://forms.google.com/beta-test',
    creatorName: 'Alex Builder',
    theme: SurveyTheme.PRODUCT_LAUNCH,
    targetResponses: 50,
    currentResponses: 15,
    pointsReward: 1,
    closingDate: new Date(NOW - DAY_MS * 2).toISOString(),
    createdAt: new Date(NOW - DAY_MS * 10).toISOString(),
    estimatedTime: 4,
    isPromoted: false,
    targetCriteria: 'Beta Users',
    targetLocation: 'Global',
    targetAge: 'All',
    targetLanguage: 'English',
    extensionCount: 0
  },
  {
    id: 's12',
    title: '2024 春季活動意見調查 (已過期 & 已延期過)',
    description: '感謝參與我們的春季活動，請填寫回饋以幫助我們改進未來的活動規劃。',
    link: 'https://forms.google.com/spring-event',
    creatorName: 'Alex Builder',
    theme: SurveyTheme.FUN_SOCIAL,
    targetResponses: 100,
    currentResponses: 88,
    pointsReward: 1,
    closingDate: new Date(NOW - DAY_MS * 1).toISOString(),
    createdAt: new Date(NOW - DAY_MS * 15).toISOString(),
    estimatedTime: 2,
    targetCriteria: '活動參與者',
    targetLocation: '台北',
    targetAge: '18-30歲',
    targetLanguage: '中文',
    extensionCount: 1 
  }
];

export const DAILY_SURVEY_LIMIT = 15;
export const SURVEY_COOLDOWN_MS = 60 * 1000;
export const COST_PER_POST = 10;
export const PROMOTION_COST = 20;
export const BASE_RESPONSE_LIMIT = 100; 
export const RESPONDENT_BATCH_SIZE = 50; 
export const RESPONDENT_BATCH_COST = 5; 
export const EXTENSION_COST = 5; 
export const MAX_EXTENSIONS = 1;
