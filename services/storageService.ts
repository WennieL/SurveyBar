
import { Survey, User } from '../types';
import { MOCK_SURVEYS, MOCK_USER, DAILY_SURVEY_LIMIT, SURVEY_COOLDOWN_MS, PROMOTION_COST, COST_PER_POST, MAX_EXTENSIONS } from '../constants';

const STORAGE_KEYS = {
  USER: 'surveybar_user_v6',
  SURVEYS: 'surveybar_surveys_v6'
};

export const StorageService = {
  // Initialize
  init: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USER)) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(MOCK_USER));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SURVEYS)) {
      localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(MOCK_SURVEYS));
    }
  },

  getUser: (): User => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    const parsed = data ? JSON.parse(data) : MOCK_USER;
    return { ...MOCK_USER, ...parsed };
  },

  getSurveys: (): Survey[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SURVEYS);
    return data ? JSON.parse(data) : MOCK_SURVEYS;
  },

  addSurvey: (survey: Survey): { success: boolean; message: string } => {
    const user = StorageService.getUser();
    
    const rewardPerPerson = survey.pointsReward || 1;
    const rewardPoolCost = survey.targetResponses * rewardPerPerson;
    
    let totalCost = COST_PER_POST + rewardPoolCost;
    let usedFreeBoost = false;

    if (survey.isPromoted) {
        if (!user.hasUsedFreeBoost) {
            usedFreeBoost = true;
        } else {
            totalCost += PROMOTION_COST;
        }
    }

    if (user.points < totalCost) {
      return { success: false, message: `Insufficient points. You need ${totalCost} points.` };
    }

    const surveys = StorageService.getSurveys();
    survey.extensionCount = 0;
    const newSurveys = [survey, ...surveys];
    
    user.points -= totalCost;
    user.surveysPostedIds.push(survey.id);
    
    if (usedFreeBoost) {
        user.hasUsedFreeBoost = true;
    }

    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(newSurveys));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    const boostMsg = survey.isPromoted ? (usedFreeBoost ? ' and boosted for FREE' : ' and boosted') : '';
    return { success: true, message: `Survey posted${boostMsg} successfully! ${totalCost} points deducted.` };
  },

  updateSurvey: (updatedSurvey: Survey, costDeducted: number = 0): { success: boolean; message: string } => {
    const surveys = StorageService.getSurveys();
    const index = surveys.findIndex(s => s.id === updatedSurvey.id);
    const user = StorageService.getUser();
    
    if (index === -1) return { success: false, message: 'Survey not found.' };

    const oldSurvey = surveys[index];
    const oldClosingTime = new Date(oldSurvey.closingDate).getTime();
    const newClosingTime = new Date(updatedSurvey.closingDate).getTime();
    const isExtending = newClosingTime > oldClosingTime + 86400000;

    if (isExtending) {
        const currentExtensions = oldSurvey.extensionCount || 0;
        if (currentExtensions >= MAX_EXTENSIONS) {
            return { success: false, message: 'Max extension limit reached (1 time).' };
        }
        updatedSurvey.extensionCount = currentExtensions + 1;
    } else {
        updatedSurvey.extensionCount = oldSurvey.extensionCount || 0;
    }

    if (costDeducted > 0) {
        if (user.points < costDeducted) {
            return { success: false, message: 'Insufficient points for update.' };
        }
        user.points -= costDeducted;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    if (updatedSurvey.isClosed && new Date(updatedSurvey.closingDate).getTime() > Date.now()) {
        updatedSurvey.isClosed = false;
    }

    surveys[index] = updatedSurvey;
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
    
    return { success: true, message: 'Survey updated successfully!' };
  },

  closeSurvey: (surveyId: string): { success: boolean; message: string } => {
    const surveys = StorageService.getSurveys();
    const index = surveys.findIndex(s => s.id === surveyId);
    if (index === -1) return { success: false, message: 'Survey not found.' };

    surveys[index].isClosed = true;
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
    return { success: true, message: 'Survey closed.' };
  },

  deleteSurvey: (surveyId: string): { success: boolean; message: string } => {
    let surveys = StorageService.getSurveys();
    const user = StorageService.getUser();
    
    surveys = surveys.filter(s => s.id !== surveyId);
    user.surveysPostedIds = user.surveysPostedIds.filter(id => id !== surveyId);

    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return { success: true, message: 'Survey deleted.' };
  },

  completeSurvey: (surveyId: string, providedCode?: string): { success: boolean; message: string } => {
    const user = StorageService.getUser();
    const surveys = StorageService.getSurveys();
    const surveyIndex = surveys.findIndex(s => s.id === surveyId);

    if (surveyIndex === -1) return { success: false, message: 'Survey not found.' };
    if (user.completedSurveyIds.includes(surveyId)) return { success: false, message: 'Already completed.' };

    const survey = surveys[surveyIndex];

    // Verification Code Logic
    if (survey.verificationCode && survey.verificationCode.trim() !== '') {
        const inputCode = providedCode?.trim().toUpperCase();
        const correctCode = survey.verificationCode.trim().toUpperCase();
        if (inputCode !== correctCode) {
            return { success: false, message: 'Invalid verification code.' };
        }
    }

    const today = new Date().toDateString();
    if (user.dailyCompletions.date !== today) {
        user.dailyCompletions = { date: today, count: 0 };
    }
    if (user.dailyCompletions.count >= DAILY_SURVEY_LIMIT) {
        return { success: false, message: 'Daily limit reached.' };
    }
    
    const now = Date.now();
    if (now - user.lastCompletionTimestamp < SURVEY_COOLDOWN_MS) {
         const remaining = Math.ceil((SURVEY_COOLDOWN_MS - (now - user.lastCompletionTimestamp))/1000);
         return { success: false, message: `Please wait ${remaining}s before next survey.` };
    }

    user.points += survey.pointsReward; 
    user.completedSurveyIds.push(surveyId);
    user.dailyCompletions.count += 1;
    user.lastCompletionTimestamp = now;

    survey.currentResponses += 1;
    surveys[surveyIndex] = survey;

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));

    return { success: true, message: `Survey verified! Earned ${survey.pointsReward} points.` };
  },

  purchasePoints: (amount: number) => {
      const user = StorageService.getUser();
      user.points += amount;
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  promoteSurvey: (surveyId: string): { success: boolean; message: string } => {
      const user = StorageService.getUser();
      const surveys = StorageService.getSurveys();
      const index = surveys.findIndex(s => s.id === surveyId);

      if (index === -1) return { success: false, message: 'Survey not found' };
      if (surveys[index].isPromoted) return { success: false, message: 'Already promoted' };

      let cost = PROMOTION_COST;
      if (!user.hasUsedFreeBoost) {
          cost = 0;
          user.hasUsedFreeBoost = true;
      }

      if (user.points < cost) return { success: false, message: 'Insufficient points' };

      user.points -= cost;
      surveys[index].isPromoted = true;
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
      
      return { success: true, message: cost === 0 ? 'Boosted for FREE!' : `Survey boosted! -${cost} pts` };
  }
};
