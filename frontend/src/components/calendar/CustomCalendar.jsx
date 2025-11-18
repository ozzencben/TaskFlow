import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./CustomCalendar.css";

const CustomCalendar = ({ selectedDay, onSelect }) => {
  return (
    <div className="custom-calendar-container">
      <DayPicker
        mode="single"
        selected={selectedDay}
        onSelect={onSelect}
        modifiersClassNames={{
          today: "rdp-day_today",
          selected: "rdp-day_selected",
        }}
      />
    </div>
  );
};

export default CustomCalendar;
