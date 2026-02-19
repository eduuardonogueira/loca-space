export class UserDetailsDto {
  user: {
    id: number;
    fullName: string;
    phone: number;
    gender: string;
    birthDate: string;
    email: string;
    type: string;
    role: string;
    createdAt: Date;
    updatedAt: Date | null;
  };
  appointments: Array<{
    id: number;
    order: number;
    status: string;
    date: string;
    startTime: string;
    endTime: string;
    details: string | null;
    title: string;
    room: {
      id: number;
      name: string;
      location: string;
      capacity: number;
      status: string;
      description: string | null;
      imageUrl: string | null;
    };
    createdAt: Date;
    updatedAt: Date | null;
  }>;
}
