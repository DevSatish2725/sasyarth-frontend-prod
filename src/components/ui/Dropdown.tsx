"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { defaultLocale, isSupportedLocale } from "@/i18n/config";

interface DropdownProps<T> {
  options: T[];

  value?: string;

  onChange: (value: string, option: T) => void;

  getOptionLabel: (option: T) => string;

  getOptionValue: (option: T) => string;

  getDisplayName?: (option: T) => string;

  placeholder?: string;

  searchable?: boolean;

  searchPlaceholder?: string;

  disabled?: boolean;

  loading?: boolean;

  emptyMessage?: string;

  className?: string;

  filterOption?: (option: T, search: string) => boolean;
}

export default function Dropdown<T>({
  options,
  value,
  onChange,
  getOptionLabel,
  getOptionValue,
  getDisplayName,
  placeholder = "Select option",
  searchable = false,
  searchPlaceholder = "Search...",
  disabled = false,
  loading = false,
  emptyMessage = "No options found",
  className = "",
  filterOption,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const locale = useLocale();
  const currentLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  const t = useTranslations("Common");

  const selectedOption = useMemo(
    () => options.find((option) => getOptionValue(option) === value),
    [options, value, getOptionValue],
  );

  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) {
      return options;
    }

    if (!filterOption) {
      return options;
    }

    return options.filter((option) => filterOption(option, search));
  }, [options, search, searchable, filterOption]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelect(option: T) {
    const optionValue = getOptionValue(option);

    onChange(optionValue, option);

    setIsOpen(false);

    setSearch("");
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-[#d9c9aa] bg-white px-3 text-left text-sm outline-none transition hover:border-[#159447] focus:border-[#159447] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60"
      >
        <span className={selectedOption ? "text-[#17201a]" : "text-[#8a918b]"}>
          {selectedOption ? getOptionLabel(selectedOption) : placeholder}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#536157] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-[#e7d8b9] bg-white shadow-lg">
          {searchable && (
            <div className="border-b border-[#e7d8b9] p-2">
              <div className="flex items-center gap-2 rounded-lg border border-[#d9c9aa] px-3">
                <Search className="h-4 w-4 shrink-0 text-[#536157]" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={searchPlaceholder}
                  autoFocus
                  className="h-10 w-full bg-transparent text-sm text-[#17201a] outline-none placeholder:text-[#8a918b]"
                />
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto p-1">
            {loading ? (
              <div className="px-3 py-4 text-center text-sm text-[#536157]">
                {t("loading")}
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-[#536157]">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const optionValue = getOptionValue(option);

                const isSelected = optionValue === value;

                return (
                  <button
                    key={optionValue}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-[#17201a] transition hover:bg-[#edf8ef]"
                  >
                    <div>
                      <p>{getOptionLabel(option)}</p>
                      {getDisplayName && currentLocale !== "hi" && (
                        <p
                          className="
                              mt-0.5
                              truncate
                              text-xs
                              text-[#7a847c]
                            "
                        >
                          {getDisplayName(option)}
                        </p>
                      )}
                    </div>

                    {isSelected && <Check className="h-4 w-4 text-[#159447]" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
