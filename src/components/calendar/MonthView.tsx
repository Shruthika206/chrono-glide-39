import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  color: string;
  all_day: boolean;
}

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export const MonthView = ({ currentDate, events, onDateClick, onEventClick }: MonthViewProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, day);
    });
  };

  return (
    <div className="flex-1 bg-white">
      <div className="grid grid-cols-7 border-b border-calendar-border">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-sm font-medium text-muted-foreground border-r border-calendar-border last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1" style={{ height: "calc(100vh - 180px)" }}>
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toString()}
              className={cn(
                "border-r border-b border-calendar-border last:border-r-0 p-2 min-h-[120px] overflow-y-auto cursor-pointer transition-colors hover:bg-calendar-hover",
                !isCurrentMonth && "bg-muted/30",
                isCurrentDay && "bg-blue-50"
              )}
              onClick={() => onDateClick(day)}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isCurrentMonth && "text-muted-foreground",
                    isCurrentDay && "bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded truncate cursor-pointer transition-all hover:shadow-md"
                    style={{
                      backgroundColor: event.color,
                      color: "white",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {format(new Date(event.start_time), "h:mm a")} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground pl-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
