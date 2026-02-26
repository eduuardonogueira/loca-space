export interface ConversationPreview {
  id: number;
  roomTitle: string;
  roomPrice: number;
  roomImageUrl: string;
  userName: string;
  userAvatarUrl: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount?: number;
  online?: boolean;
  userId: number;
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

