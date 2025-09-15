export enum ChatMode {
  SEARCH = "search",
  QUIZ = "quiz",
  GUIDANCE = "guidance",
  POETRY = "poetry",
  NONE = ""
}

export enum Language {
  VI = "vi",
  EN = "en",
}
export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}


export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface Message {
  uuid: string;
  role: MessageRole;
  content: string;
  session_id?: string;
  created_at?: string;
  agent_id: string;
  response_answer_id?: string;
  feedback?: string;
  related_message?: Message;
  approval_status?: ApprovalStatus;
  thought?: string;
  edited_content?: string;
  like_user_ids?: string[];
  dislike_user_ids?: string[];
}

export type PreviewMessage = Message;
// {
//   uuid: string;
//   role: MessageRole;
//   content: string;
//   created_at: string;
// }

export interface CreateChatDto {
  agent_id: string;
  uuid?: string;
  title?: string;
  language: Language;
  messages: Pick<Message, "role" | "content" | "created_at">[];
  order?: number;
}

export interface UpdateChatDto {
  title?: string;
  order?: number;
}

export interface CreateMessageDto {
  content: string;
  role: MessageRole;
  agent_id: string;
}

export type Chat = {
  uuid: string;
  title: string;
  messages: Message[];
  created_at: string;
  updated_at: string;
  agent_id: string;
};

export type Folder = {
  id: string;
  name: string;
  icon: string;
  created_at: string;
};

// {
//   "author": "8c54cb30-d7af-47d3-b77c-729ce1adab49",
//   "base_model": "gemini-2.5-flash",
//   "created_at": "Mon, 07 Jul 2025 15:23:39 GMT",
//   "description": "Fine-tuned model for Vietnamese conversations",
//   "hyperparameters": null,
//   "language": "vi",
//   "model_path": null,
//   "name": "fine_tuned_model_20250707_172139",
//   "status": "completed",
//   "training_data_path": null,
//   "training_metrics": null,
//   "updated_at": "Mon, 07 Jul 2025 15:23:39 GMT",
//   "uuid": "7da264f3-bbbf-4f32-990d-60f1cd764de0",
//   "validation_data_path": null,
//   "version": "1.0.0"
// }
export type Model = {
  name: string;
  description: string;
  author?: string;
  base_model?: string;
  created_at?: string;
  hyperparameters?: string;
  language?: string;
  model_path?: string;
  status?: string;
};