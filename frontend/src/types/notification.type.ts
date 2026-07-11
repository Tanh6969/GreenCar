export interface Notification {
  notification_id: number;
  user_id: number;
  type: string;
  title: string;
  content: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}
