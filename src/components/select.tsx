import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

interface Item {
  value: string | number;
  name: string;
}

const Select: React.FC<{
  items: Item[];
  value?: Item;
  name?: string;
  label: string;
  onChange?: (newValue: Item) => unknown;
}> = ({ items, onChange, value, label, name }) => {
  return (
    <Listbox defaultValue={value ?? items[0]} by="value" onChange={onChange} name={name}>
      <div className="relative mt-1">
        <Listbox.Label className="text-black">{label}</Listbox.Label>
        <Listbox.Button className="relative mt-1 w-full rounded-lg bg-neutral-200 py-2 pl-4 pr-10 text-left text-black">
          {({ value }) => (
            <>
              <span className="block truncate">{value.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
              </span>
            </>
          )}
        </Listbox.Button>
        <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-neutral-100 p-1 text-base shadow">
          {items.map(item => (
            <Listbox.Option
              key={item.value}
              className={({ active }) =>
                `relative cursor-default select-none rounded-md  py-2 px-4 ${
                  active ? 'bg-indigo-100 text-black' : ''
                }`
              }
              value={item}>
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? 'font-bold' : ''}`}>
                    {item.name}
                  </span>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default Select;
