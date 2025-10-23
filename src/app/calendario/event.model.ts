export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;   // yyyy-mm-dd
  start?: string; // HH:mm
  end?: string;   // HH:mm
  color?: string;
}
