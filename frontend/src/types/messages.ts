export interface ConversationPreview {
  id: number;
  room: {
    id: number;
    name: string;
    price: number;
    bannerUrl: string | null;
  } | null;
  userName: string;
  userAvatarUrl: string | null;
  userId: number;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  online?: boolean;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface RawConversation {
  conversationId: number;
  room: {
    id: number;
    name: string;
    price: number;
    bannerUrl: string | null;
  } | null;
  participants: {
    userId: number;
    fullName: string;
    avatarUrl: string | null;
  }[];
  lastMessage: {
    content: string;
    senderId: number;
    createdAt: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export interface MessageUserProfile {
  fullName: string;
  avatarUrl: string;
  birthDate: string;
  location: string;
  email: string;
  phone: string;
  gender: string;
  online?: boolean;
}

export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Agora";
  if (diffMin < 60) return `${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d`;
}
