import { FC } from "react";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";

interface CustomDatePickerProps {
  value: Date | null;
  onChange: (value: any) => void;
  format?: string;
  className?: string;
}

const CustomDatePicker: FC<CustomDatePickerProps> = ({
  value,
  onChange,
  format = "dd/MM/yyyy",
  className = "form-control border-spacing-1 w-full",
}) => {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      format={format}
      className={className}
    />
  );
};

export default CustomDatePicker;
