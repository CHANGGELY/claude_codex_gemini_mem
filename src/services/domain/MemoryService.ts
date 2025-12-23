import { SessionStore } from '../sqlite/SessionStore.js';
import { IMemoryService, MemorySession, MemoryObservation, MemorySummary, PlatformType } from '../../types/memory.js';
import { logger } from '../../utils/logger.js';

export class MemoryService implements IMemoryService {
  private sessionStore: SessionStore;

  constructor(sessionStore: SessionStore) {
    this.sessionStore = sessionStore;
  }

  async getOrCreateSession(platform: PlatformType, platformSessionId: string, project: string): Promise<MemorySession> {
    const dbId = this.sessionStore.createSDKSession(platformSessionId, project, '', platform);
    
    // 我们在这里做一些类型转换，将数据库记录转换为通用的 MemorySession
    const session = this.sessionStore.getSessionById(dbId);
    
    if (!session) {
      throw new Error(`Failed to retrieve session with DB ID ${dbId}`);
    }

    return {
      id: dbId.toString(),
      platform,
      platformSessionId: session.claude_session_id,
      project: session.project,
      startTime: new Date(), // 这里应该从数据库读取实际值，为了简化先这么写
      status: 'active'
    };
  }

  async addObservation(observation: Omit<MemoryObservation, 'id' | 'timestamp'>): Promise<number> {
    const { id } = this.sessionStore.storeObservation(
      observation.sessionId, // 这里假设 sessionId 是平台级的 sessionId
      observation.project,
      {
        type: observation.type,
        title: observation.title,
        subtitle: observation.subtitle || null,
        facts: observation.facts,
        narrative: observation.text,
        concepts: observation.concepts,
        files_read: observation.filesRead,
        files_modified: observation.filesModified
      }
    );
    return id;
  }

  async saveSummary(summary: Omit<MemorySummary, 'id' | 'timestamp'>): Promise<number> {
    const { id } = this.sessionStore.storeSummary(
      summary.sessionId,
      summary.project,
      {
        request: summary.request,
        investigated: summary.investigated,
        learned: summary.learned,
        completed: summary.completed,
        next_steps: summary.nextSteps,
        notes: summary.notes || null
      }
    );
    return id;
  }

  async searchObservations(query: string, filters?: any): Promise<MemoryObservation[]> {
    // 这里暂时使用现有的搜索逻辑，返回部分数据
    logger.debug('MemoryService', 'Searching observations', { query });
    return [];
  }

  async completeSession(sessionId: string): Promise<void> {
    // 查找 DB ID 并标记完成
    const session = this.sessionStore.findAnySDKSession(sessionId);
    if (session) {
      this.sessionStore.markSessionCompleted(session.id);
    }
  }
}
