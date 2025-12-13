export interface IAvailability {
  id: number;
  weekday: number;
  startTime: string;
  endTime: string;
  roomId: number;
}

export interface ICreateAvailability {
  weekday: number;
  startTime: string;
  endTime: string;
  roomId: number;
}

