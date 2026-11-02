"use client";

import { defaultLocale, isSupportedLocale } from "@/i18n/config";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "use-intl";

export interface Option {
  ids: {
    habitationId: string;
    maujaId: string;
    villageId: string;
    blockId: string;
    districtId: string;
    stateId: string;
  };
  displayNames: {
    en: string;
    hi: string;
  };
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

  locationSearch?: string;

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
  locationSearch,
}: SearchableLocationFieldProps) {
  const locale = useLocale();
  const currentLocale = isSupportedLocale(locale) ? locale : defaultLocale;
  const [search, setSearch] = useState(locationSearch ?? "");

  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("Common");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [value]);

  const handleInputChange = (inputValue: string) => {
    setSearch(inputValue);
    setIsOpen(true);

    if (!localSearch) {
      onSearchChange?.(inputValue);
    }
  };

  const handleSelect = (option: Option) => {
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
              {t("typeAtLeastOneCharacter", { count: 2 })}
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
          ) : options.length === 0 ? (
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
            options.map((option) => (
              <button
                key={option.ids.toString()}
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
                {option.displayNames[currentLocale]}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
