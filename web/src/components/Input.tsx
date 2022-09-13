import React from "react";

// const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   console.log("value is:", event.target.value);
// };

interface InputProps {
  labelName: string;
  value: string;
  onchange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = (props: InputProps) => {
  //keydown();
  return (
    <label className="input-group mb-2 mt-3">
      <span className="w-[100px]">{props.labelName}</span>
      <input
        type="text"
        placeholder={props.labelName}
        className="input input-bordered w-full"
        onChange={props.onchange}
        value={props.value}
      />
    </label>
  );
};
