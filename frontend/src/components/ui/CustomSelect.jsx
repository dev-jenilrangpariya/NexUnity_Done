import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { cn } from "../../lib/utils";

export default function CustomSelect({
  className,
  buttonClassName,
  listClassName,
  optionClassname,
  list,
  props,
  setValue,
}) {
  const [selected, setSelected] = useState(list[0]);

  useEffect(() => {
    setValue(selected);
  }, [selected]);

  return (
    <div className={cn("", className)} {...props}>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button
            className={cn(
              "relative w-full cursor-default bg-white h-[40px] pl-3 pr-10 text-left rounded-lg shadow-md focus:outline-none text-sm md:text-base",
              buttonClassName
            )}
          >
            <span className="block truncate">{selected}</span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={cn(
                "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm",
                listClassName
              )}
            >
              {list.map((iteam, iteamIdx) => (
                <Listbox.Option
                  key={iteamIdx}
                  className={({ active }) =>
                    cn(
                      `relative cursor-default select-none py-2 ps-3 pr-4 ${
                        active
                          ? "bg-blue-500/50 text-blue-800"
                          : "text-gray-900"
                      }`,
                      optionClassname
                    )
                  }
                  value={iteam}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {iteam}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
