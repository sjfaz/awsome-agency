import React from "react";

interface SelectProps {
  onchange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: React.FC<SelectProps> = (props: SelectProps) => {
  return (
    <select
      onChange={props.onchange}
      className="select select-bordered w-full mb-2"
    >
      <option>Website</option>
      <option>Mobile App</option>
    </select>
  );
};
