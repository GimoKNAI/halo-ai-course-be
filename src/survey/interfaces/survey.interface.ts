export enum SurveyTopicKey {
  WORK_ENVIRONMENT = "WORK_ENVIRONMENT",
  TEAMWORK = "TEAMWORK",
  COMMUNICATION = "COMMUNICATION",
  LEADERSHIP = "LEADERSHIP",
  WORKLOAD = "WORKLOAD",
  RECOGNITION = "RECOGNITION",
  VALUES_ALIGNMENT = "VALUES_ALIGNMENT",
  PROFESSIONAL_GROWTH = "PROFESSIONAL_GROWTH",
  WORK_LIFE_BALANCE = "WORK_LIFE_BALANCE",
  JOB_SATISFACTION = "JOB_SATISFACTION"
}

export interface SurveyQuestion {
    topicKey: SurveyTopicKey;
    question: string;
}

export interface SurveyAnswerBody extends Record<SurveyTopicKey, string> {}