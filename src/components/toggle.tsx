import { Fragment } from 'react';
import { Switch } from '@headlessui/react';

const Toggle: React.FC<{
  checked: boolean;
  label: string;
  name?: string;
  onChange?: (checked: boolean) => unknown;
}> = ({ checked, label, onChange, name }) => {
  return (
    <Switch.Group as="div" className="flex items-center gap-2">
      <Switch defaultChecked={checked} onChange={onChange} as={Fragment} name={name}>
        {({ checked }) => (
          <button
            className={`${
              checked ? 'bg-indigo-600' : 'bg-neutral-400'
            } relative inline-flex h-6 w-11 items-center rounded-full`}>
            <span
              className={`${
                checked ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </button>
        )}
      </Switch>
      <Switch.Label>{label}</Switch.Label>
    </Switch.Group>
  );
};

export default Toggle;
