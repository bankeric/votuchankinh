
export interface File {
  uuid: string;
  name: string;
  path: string;
  created_at: string;
  updated_at: string;
  author: string;
  category: string;
  status: string;
  used_in_qas?: number;
  size?: number;
  type?: string;
}

export interface Document {
  uuid: string;
  title: string;
  content: string;
  description: string;
  created_at: string;
  updated_at: string;
  author: string;
}