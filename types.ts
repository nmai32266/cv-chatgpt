
export interface DetailedAnalysis {
  experienceMatch: string;      
  skillsAssessment: string;     
  jobStability: string;         
  employmentGaps: string;       
  progressionAndAwards: string; 
  teamworkAndSoftSkills: string;
  proactivity: string;          
}

export interface Recommendation {
  title: string;
  description: string;
  provider: string;
}

export interface RoadmapItem {
  name: string;
  provider?: string; 
  description: string;
}

export interface DevelopmentRoadmap {
  courses: RoadmapItem[];
  projects: RoadmapItem[];
}

export interface AnalysisResult {
  candidateLevel: string;
  summary: string; 
  matchScore: number; 
  strengths: string[];
  weaknesses: string[];
  detailedAnalysis: DetailedAnalysis;
  suggestedJobs: Recommendation[];
  developmentRoadmap: DevelopmentRoadmap; 
  aiAgentReview: string; 
}

export interface UploadState {
  fileData: string | null; 
  targetJob: string;
  mimeType: string;
  fileName?: string;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'reviewing';

export interface ActivityItem {
  id: string;
  name: string;
  provider: string;
  type: 'course' | 'project' | 'job' | 'scan';
  appliedDate: string;
  status: ApplicationStatus;
  description?: string;
  candidateName?: string;
  cvFileContent?: string; // Base64
  cvMimeType?: string;
  ownerUsername?: string; // Trường mới để lưu trữ theo account
}

export interface User {
  username: string;
  name: string;
  role: 'candidate' | 'hr';
}
