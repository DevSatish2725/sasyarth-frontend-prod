"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Option {
  id: string;
  name: string;
}

interface SearchableLocationFieldProps {
  label: string;
  placeholder: string;

  value: Option | null;

  options: Option[];

  onSearchChange?: (value: string) => void;

  onSelect: (option: Option) => void;

  disabled?: boolean;
  isLoading?: boolean;

  localSearch?: boolean;

  minimumSearchLength?: number;
}

export default function SearchableLocationField({
  label,
  placeholder,
  value,
  options,
  onSearchChange,
  onSelect,
  disabled = false,
  isLoading = false,
  localSearch = false,
  minimumSearchLength = 0,
}: SearchableLocationFieldProps) {
  const [search, setSearch] = useState(value?.name ?? "");

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch(value?.name ?? "");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [value]);

  const displayedOptions = localSearch
    ? options.filter((option) =>
        option.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : options;

  const handleInputChange = (inputValue: string) => {
    setSearch(inputValue);
    setIsOpen(true);

    if (!localSearch) {
      onSearchChange?.(inputValue);
    }
  };

  const handleSelect = (option: Option) => {
    setSearch(option.name);

    setIsOpen(false);

    onSelect(option);
  };

  const shouldShowTypeMessage =
    !localSearch && search.trim().length < minimumSearchLength;

  return (
    <div ref={containerRef} className="relative">
      <label
        className="
          mb-2
          block
          text-sm
          font-bold
          text-text-primary
        "
      >
        {label}
      </label>

      <div className="relative">
        <span
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-lg
            text-text-muted
          "
        >
          <Search size={16} />
        </span>

        <input
          type="text"
          value={search}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => {
            if (!disabled) {
              setIsOpen(true);
            }
          }}
          onChange={(event) => handleInputChange(event.target.value)}
          className="
            h-12
            w-full
            rounded-xl
            border
            border-border
            bg-white
            pl-11
            pr-10
            text-sm
            font-medium
            text-text-primary
            outline-none
            transition

            placeholder:text-text-muted

            focus:border-primary
            focus:ring-2
            focus:ring-primary/10

            disabled:cursor-not-allowed
            disabled:bg-surface-muted
            disabled:text-text-muted
          "
        />

        <span
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-xs
            text-text-secondary
          "
        >
          ▼
        </span>
      </div>

      {isOpen && !disabled && (
        <div
          className="
              absolute
              left-0
              right-0
              top-full
              z-50
              mt-1
              max-h-60
              overflow-y-auto
              rounded-xl
              border
              border-border
              bg-white
              py-1
              shadow-lg
            "
        >
          {shouldShowTypeMessage ? (
            <p
              className="
                  px-4 py-3
                  text-sm
                  text-text-muted
                "
            >
              Type at least {minimumSearchLength} characters
            </p>
          ) : isLoading ? (
            <p
              className="
                  px-4 py-3
                  text-sm
                  text-text-secondary
                "
            >
              Searching...
            </p>
          ) : displayedOptions.length === 0 ? (
            <p
              className="
                  px-4 py-3
                  text-sm
                  text-text-muted
                "
            >
              No location found
            </p>
          ) : (
            displayedOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className="
                      flex
                      min-h-11
                      w-full
                      items-center
                      px-4
                      text-left
                      text-sm
                      font-medium
                      text-text-primary
                      transition

                      hover:bg-primary-light
                    "
              >
                {option.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
