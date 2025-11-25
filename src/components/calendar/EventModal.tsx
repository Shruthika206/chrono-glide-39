import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

interface Event {
  id?: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  color: string;
  all_day: boolean;
  location?: string;
}

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, "id"> & { id?: string }) => void;
  onDelete?: (eventId: string) => void;
  event?: Event;
  initialDate?: Date;
  initialHour?: number;
}

const colorOptions = [
  { name: "Blue", value: "#4285f4" },
  { name: "Red", value: "#ea4335" },
  { name: "Green", value: "#34a853" },
  { name: "Yellow", value: "#fbbc04" },
  { name: "Purple", value: "#9334e9" },
  { name: "Orange", value: "#ff6d00" },
];

export const EventModal = ({
  open,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
  initialHour,
}: EventModalProps) => {
  const [formData, setFormData] = useState<Omit<Event, "id"> & { id?: string }>({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
    color: "#4285f4",
    all_day: false,
    location: "",
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else if (initialDate) {
      const start = new Date(initialDate);
      if (initialHour !== undefined) {
        start.setHours(initialHour, 0, 0, 0);
      }
      const end = new Date(start);
      end.setHours(start.getHours() + 1);

      setFormData({
        title: "",
        description: "",
        start_time: start.toISOString().slice(0, 16),
        end_time: end.toISOString().slice(0, 16),
        color: "#4285f4",
        all_day: false,
        location: "",
      });
    }
  }, [event, initialDate, initialHour]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription>
            {event ? "Update your event details" : "Add a new event to your calendar"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Event title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Time *</Label>
              <Input
                id="start"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Time *</Label>
              <Input
                id="end"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add event description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Add location"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-all ${
                    formData.color === color.value
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            {event && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{event ? "Update" : "Create"} Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
