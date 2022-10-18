import { useId } from 'react';

const Input: React.FC<{
  defaultValue: string;
  label: string;
  name?: string;
  minLength: number;
  maxLength: number;
}> = ({ defaultValue, label, name, maxLength, minLength }) => {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id}>{label}</label>
      <input
        type="text"
        className="w-full rounded-lg bg-neutral-200 py-2 px-4 text-black"
        required
        minLength={minLength}
        maxLength={maxLength}
        id={id}
        name={name}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default Input;
