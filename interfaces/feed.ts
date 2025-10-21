import { Agent } from './agent'
import { User } from './user'

export enum FeedType {
  POST = 'post',
  RETWEET = 'retweet'
}

export interface Feed {
  agent_content: string
  agent_info: Agent
  content: string
  created_at: string
  like_ids: string[]
  retweet_ids: string[]
  type: FeedType
  updated_at: string
  user_id: string
  user_info: User
  user_question: string
  uuid: string
}

export interface FeedListResponse {
  data: Feed[]
  status: string
}

export interface CreateFeedRequest {
  content: string
  user_question: string
  agent_id: string
  agent_content: string
}
