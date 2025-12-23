/**
 * 通用的记忆服务类型定义
 */

export type PlatformType = 'claude' | 'gemini' | 'generic';

export interface MemorySession {
  id: string;
  platform: PlatformType;
  platformSessionId: string;
  project: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'failed';
}

export type ObservationType = 'decision' | 'bugfix' | 'feature' | 'refactor' | 'discovery' | 'change';

export interface MemoryObservation {
  id?: number;
  sessionId: string;
  project: string;
  type: ObservationType;
  title: string;
  subtitle?: string;
  text: string;
  facts: string[];
  concepts: string[];
  filesRead: string[];
  filesModified: string[];
  timestamp: Date;
}

export interface MemorySummary {
  id?: number;
  sessionId: string;
  project: string;
  request: string;
  investigated: string;
  learned: string;
  completed: string;
  nextSteps: string;
  notes?: string;
  timestamp: Date;
}

export interface IMemoryService {
  /**
   * 创建或恢复一个会话
   */
  getOrCreateSession(platform: PlatformType, platformSessionId: string, project: string): Promise<MemorySession>;
  
  /**
   * 添加观察结果
   */
  addObservation(observation: Omit<MemoryObservation, 'id' | 'timestamp'>): Promise<number>;
  
  /**
   * 记录会话摘要
   */
  saveSummary(summary: Omit<MemorySummary, 'id' | 'timestamp'>): Promise<number>;
  
  /**
   * 搜索记忆
   */
  searchObservations(query: string, filters?: any): Promise<MemoryObservation[]>;
  
  /**
   * 关闭会话
   */
  completeSession(sessionId: string): Promise<void>;
}
