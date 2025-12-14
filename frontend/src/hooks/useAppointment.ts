import { IRoomDetails } from "@/types/room";

// converte "HH:MM:SS" -> minutos inteiros
function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// converte minutos -> "HH:MM"
function minutesToTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function getAvailableTimes(
  roomDetails: IRoomDetails,
  date: string // ex: "2025-09-18"
): { start: string; end: string }[] {
  const room = roomDetails.room;
  const duration = room.duration; // em minutos
  const jsDay = new Date(date).getDay();
  const weekday = (jsDay + 1) % 7;

  // pega disponibilidade só do dia escolhido
  const availabilities = roomDetails.availability.filter(
    (a) => a.weekday === weekday
  );

  if (!availabilities.length) return [];

  const appointments = (roomDetails.appointments || []).filter(
    (appt) => appt.date === date
  );

  const appointmentRanges = appointments.map((appt) => ({
    start: timeToMinutes(appt.startTime),
    end: timeToMinutes(appt.endTime),
  }));

  const freeSlots: { start: string; end: string }[] = [];

  for (const availability of availabilities) {
    const startAvail = timeToMinutes(availability.startTime);
    const endAvail = timeToMinutes(availability.endTime);

    for (let t = startAvail; t + duration <= endAvail; t += duration) {
      const slotStart = t;
      const slotEnd = t + duration;

      // verifica conflito com appointments
      const hasConflict = appointmentRanges.some(
        (appt) => !(slotEnd <= appt.start || slotStart >= appt.end)
      );

      if (!hasConflict) {
        freeSlots.push({
          start: minutesToTime(slotStart),
          end: minutesToTime(slotEnd),
        });
      }
    }
  }

  return freeSlots;
}

