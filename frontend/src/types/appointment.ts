export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export enum EnumAppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export interface ICreateAppointment {
  order: number;
  status: AppointmentStatus;
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  title: string;
  userId: number;
  roomId: number;
}

export interface IAppointment {
  order: number;
  status: AppointmentStatus;
  date: string;
  startTime: string;
  endTime: string;
  details: string;
  title: string;
  userId: number;
  roomId: number;
}

// export interface IUserAppointmentsDetails

