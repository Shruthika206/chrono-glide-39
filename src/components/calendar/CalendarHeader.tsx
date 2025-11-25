import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LogOut, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ViewType = "month" | "week" | "day";

interface CalendarHeaderProps {
  currentDate: Date;
  viewType: ViewType;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  onCreateEvent: () => void;
  userName?: string;
}

export const CalendarHeader = ({
  currentDate,
  viewType,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onLogout,
  onCreateEvent,
  userName,
}: CalendarHeaderProps) => {
  const formatTitle = () => {
    const monthYear = currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    if (viewType === "day") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    return monthYear;
  };

  return (
    <header className="bg-white border-b border-calendar-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Calendar</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onToday}>
              Today
            </Button>
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="rounded-r-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="rounded-l-none"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-medium text-foreground ml-2">
              {formatTitle()}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={onCreateEvent} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewChange("day")}>
                Day
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange("week")}>
                Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewChange("month")}>
                Month
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  {userName?.charAt(0).toUpperCase() || "U"}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
