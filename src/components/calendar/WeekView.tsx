import { startOfWeek, endOfWeek, eachDayOfInterval, format, isToday, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  color: string;
  all_day: boolean;
}

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: Event) => void;
}

export const WeekView = ({ currentDate, events, onTimeSlotClick, onEventClick }: WeekViewProps) => {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForTimeSlot = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start_time);
      return isSameDay(eventStart, day) && eventStart.getHours() === hour;
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="grid grid-cols-8 border-b border-calendar-border sticky top-0 bg-white z-10">
        <div className="p-3 text-sm font-medium text-muted-foreground border-r border-calendar-border">
          Time
        </div>
        {days.map((day) => (
          <div
            key={day.toString()}
            className={cn(
              "p-3 text-center border-r border-calendar-border last:border-r-0",
              isToday(day) && "bg-blue-50"
            )}
          >
            <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
            <div
              className={cn(
                "text-2xl font-medium",
                isToday(day) && "bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mt-1"
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-calendar-border min-h-[60px]">
            <div className="p-2 text-xs text-muted-foreground border-r border-calendar-border">
              {format(new Date().setHours(hour, 0), "h:mm a")}
            </div>
            {days.map((day) => {
              const slotEvents = getEventsForTimeSlot(day, hour);
              return (
                <div
                  key={`${day}-${hour}`}
                  className="border-r border-calendar-border last:border-r-0 p-1 cursor-pointer hover:bg-calendar-hover transition-colors"
                  onClick={() => onTimeSlotClick(day, hour)}
                >
                  {slotEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded mb-1 cursor-pointer transition-all hover:shadow-md"
                      style={{
                        backgroundColor: event.color,
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-[10px] opacity-90">
                        {format(new Date(event.start_time), "h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
