import { format, isSameDay } from "date-fns";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  color: string;
  all_day: boolean;
  description?: string;
}

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onTimeSlotClick: (hour: number) => void;
  onEventClick: (event: Event) => void;
}

export const DayView = ({ currentDate, events, onTimeSlotClick, onEventClick }: DayViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start_time);
      return isSameDay(eventStart, currentDate) && eventStart.getHours() === hour;
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="border-b border-calendar-border p-4 sticky top-0 bg-white z-10">
        <div className="text-sm text-muted-foreground">{format(currentDate, "EEEE")}</div>
        <div className="text-3xl font-medium">{format(currentDate, "MMMM d, yyyy")}</div>
      </div>

      <div className="relative">
        {hours.map((hour) => {
          const hourEvents = getEventsForHour(hour);
          return (
            <div
              key={hour}
              className="border-b border-calendar-border min-h-[80px] flex cursor-pointer hover:bg-calendar-hover transition-colors"
              onClick={() => onTimeSlotClick(hour)}
            >
              <div className="w-24 p-3 text-sm text-muted-foreground border-r border-calendar-border">
                {format(new Date().setHours(hour, 0), "h:mm a")}
              </div>
              <div className="flex-1 p-2">
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg mb-2 cursor-pointer transition-all hover:shadow-md"
                    style={{
                      backgroundColor: event.color,
                      color: "white",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <div className="font-medium text-base">{event.title}</div>
                    <div className="text-sm opacity-90 mt-1">
                      {format(new Date(event.start_time), "h:mm a")} -{" "}
                      {format(new Date(event.end_time), "h:mm a")}
                    </div>
                    {event.description && (
                      <div className="text-sm opacity-80 mt-2">{event.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
