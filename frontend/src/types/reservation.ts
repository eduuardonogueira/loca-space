
export interface Reservation {
  id: number;
  order: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  date: string;       
  startTime: string;  
  endTime: string;
  details: string;     
  title: string;    
  userId: number;
  roomId: number;
}
