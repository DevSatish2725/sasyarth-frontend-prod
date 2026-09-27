"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import type { VegetableResponse } from "@/types/vegetable.types";

interface VegetableMultiSelectProps {
  vegetables: VegetableResponse[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

type DropdownPlacement = "top" | "bottom";

interface DropdownPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: DropdownPlacement;
}

/*
 * Space between the input and dropdown.
 */
const DROPDOWN_GAP = 8;

/*
 * Preferred maximum height of the complete dropdown.
 */
const DROPDOWN_MAX_HEIGHT = 280;

/*
 * If there is less than this much room below,
 * we'll consider opening above.
 */
const DROPDOWN_MIN_HEIGHT = 160;

/*
 * Prevent dropdown from touching viewport edges.
 */
const VIEWPORT_PADDING = 16;

/*
 * Approximate height reserved for "Clear all".
 */
const DROPDOWN_FOOTER_HEIGHT = 45;

export function VegetableMultiSelect({
  vegetables,
  selectedIds,
  onChange,
  placeholder = "Search vegetables...",
  disabled = false,
}: VegetableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [canScrollRight, setCanScrollRight] = useState(false);

  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition | null>(null);

  /*
   * Normal component wrapper.
   *
   * Used for outside-click detection.
   */
  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * Complete select box.
   *
   * Its dimensions determine where the portal
   * dropdown should appear.
   */
  const triggerRef = useRef<HTMLDivElement>(null);

  /*
   * Portal dropdown.
   *
   * Because it renders under document.body,
   * it needs its own outside-click reference.
   */
  const dropdownRef = useRef<HTMLDivElement>(null);

  const chipsRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);


  const selectedVegetables = useMemo(() => {
    return vegetables.filter((vegetable) =>
      selectedIds.includes(vegetable._id),
    );
  }, [vegetables, selectedIds]);

  const matchesVegetableSearch = (
    vegetable: VegetableResponse,
    search: string,
  ) => {
    const query = search.trim().toLocaleLowerCase();

    if (!query) {
      return true;
    }

    const searchableValues = [
      vegetable.name,
      vegetable.displayNames?.en,
      vegetable.displayNames?.hi,
      ...(vegetable.searchAliases ?? []),
    ];

    return searchableValues.some((value) =>
      value?.toLocaleLowerCase().includes(query),
    );
  };

  const filteredVegetables = useMemo(() => {
    return vegetables.filter((vegetable) => {
      if (selectedIds.includes(vegetable._id)) {
        return false;
      }
      return matchesVegetableSearch(vegetable, search);
    });
  }, [vegetables, selectedIds, search]);

  const updateDropdownPosition = useCallback(() => {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    const viewportWidth = window.innerWidth;

    /*
     * Available vertical space below the input.
     */
    const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_PADDING;

    /*
     * Available vertical space above the input.
     */
    const spaceAbove = rect.top - VIEWPORT_PADDING;

    /*
     * Prefer opening below.
     *
     * Open above only when:
     *
     * 1. Below has less than our preferred minimum.
     * 2. Above has more usable space than below.
     */
    const shouldOpenAbove =
      spaceBelow < DROPDOWN_MIN_HEIGHT && spaceAbove > spaceBelow;

    /*
     * Protect against the dropdown extending
     * horizontally outside the viewport.
     */
    const width = Math.min(rect.width, viewportWidth - VIEWPORT_PADDING * 2);

    const left = Math.max(
      VIEWPORT_PADDING,
      Math.min(rect.left, viewportWidth - width - VIEWPORT_PADDING),
    );

    if (shouldOpenAbove) {
      const availableHeight = Math.max(0, spaceAbove - DROPDOWN_GAP);

      const maxHeight = Math.min(DROPDOWN_MAX_HEIGHT, availableHeight);

      setDropdownPosition({
        bottom: window.innerHeight - rect.top + DROPDOWN_GAP,

        left,
        width,
        maxHeight,
        placement: "top",
      });

      return;
    }

    const availableHeight = Math.max(0, spaceBelow - DROPDOWN_GAP);

    const maxHeight = Math.min(DROPDOWN_MAX_HEIGHT, availableHeight);

    setDropdownPosition({
      top: rect.bottom + DROPDOWN_GAP,
      left,
      width,
      maxHeight,
      placement: "bottom",
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    updateDropdownPosition();
  }, [isOpen, updateDropdownPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePositionChange = () => {
      updateDropdownPosition();
    };

    /*
     * capture = true is intentional.
     *
     * Your seller filter sidebar has its own scrolling,
     * so this also catches nested scroll-container events.
     */
    window.addEventListener("scroll", handlePositionChange, true);

    window.addEventListener("resize", handlePositionChange);

    return () => {
      window.removeEventListener("scroll", handlePositionChange, true);

      window.removeEventListener("resize", handlePositionChange);
    };
  }, [isOpen, updateDropdownPosition]);

  const updateScrollButtons = useCallback(() => {
    const element = chipsRef.current;

    if (!element) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = element;

    setCanScrollLeft(scrollLeft > 2);

    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      updateScrollButtons();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [selectedVegetables, updateScrollButtons]);

  useEffect(() => {
    const handleResize = () => {
      updateScrollButtons();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateScrollButtons]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      /*
       * Click inside normal component.
       */
      if (containerRef.current?.contains(target)) {
        return;
      }

      /*
       * Click inside portal.
       *
       * Portal is under document.body, so it isn't
       * physically inside containerRef.
       */
      if (dropdownRef.current?.contains(target)) {
        return;
      }

      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function openDropdown() {
    if (disabled) {
      return;
    }

    setIsOpen(true);
  }

  function handleSelect(vegetableId: string) {
    if (selectedIds.includes(vegetableId)) {
      return;
    }

    onChange([...selectedIds, vegetableId]);

    setSearch("");

    /*
     * Keep focus on search so multiple vegetables
     * can be selected quickly.
     */
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function handleRemove(vegetableId: string) {
    onChange(selectedIds.filter((id) => id !== vegetableId));
  }

  function handleClear() {
    onChange([]);
    setSearch("");
  }

  function scrollChips(direction: "left" | "right") {
    const element = chipsRef.current;

    if (!element) {
      return;
    }

    element.scrollBy({
      left: direction === "left" ? -180 : 180,

      behavior: "smooth",
    });
  }

  const optionsMaxHeight = dropdownPosition
    ? selectedIds.length > 0
      ? Math.max(80, dropdownPosition.maxHeight - DROPDOWN_FOOTER_HEIGHT)
      : dropdownPosition.maxHeight
    : 0;

  const dropdown =
    isOpen && !disabled && dropdownPosition && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",

              top:
                dropdownPosition.placement === "bottom"
                  ? dropdownPosition.top
                  : undefined,

              bottom:
                dropdownPosition.placement === "top"
                  ? dropdownPosition.bottom
                  : undefined,

              left: dropdownPosition.left,
              width: dropdownPosition.width,
              maxHeight: dropdownPosition.maxHeight,
            }}
            className="
              z-99999
              flex
              flex-col
              overflow-hidden
              rounded-xl
              border border-[#e7d8b9]
              bg-white
              shadow-xl
            "
          >

            <div
              style={{
                maxHeight: optionsMaxHeight,
              }}
              className="
                min-h-0
                overflow-y-auto
                overscroll-contain
                p-2

                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#d7d9d7]
              "
            >
              {filteredVegetables.length > 0 ? (
                filteredVegetables.map((vegetable) => (
                  <button
                    key={vegetable._id}
                    type="button"
                    onClick={() => handleSelect(vegetable._id)}
                    className="
                        flex
                        w-full
                        items-center
                        justify-between
                        gap-3
                        rounded-lg
                        px-3 py-2.5
                        text-left
                        transition
                        hover:bg-[#edf8ef]
                      "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                            truncate
                            text-sm
                            font-semibold
                            text-[#17201a]
                          "
                      >
                        {vegetable.name}
                      </p>

                      {vegetable.displayNames?.hi && (
                        <p
                          className="
                              mt-0.5
                              truncate
                              text-xs
                              text-[#7a847c]
                            "
                        >
                          {vegetable.displayNames.hi}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm font-medium text-[#536157]">
                    No vegetables found.
                  </p>
                </div>
              )}
            </div>

            {selectedIds.length > 0 && (
              <div
                className="
                  shrink-0
                  border-t
                  border-[#eee4cf]
                  bg-white
                  px-3 py-2.5
                "
              >
                <button
                  type="button"
                  onClick={handleClear}
                  className="
                    text-xs
                    font-bold
                    text-[#a85f00]
                    hover:underline
                  "
                >
                  Clear all
                </button>
              </div>
            )}
          </div>,

          document.body,
        )
      : null;

  return (
    <>
      <div ref={containerRef} className="relative min-w-0">
        <div
          ref={triggerRef}
          className={`
            min-w-0
            overflow-hidden
            rounded-xl
            border
            bg-white
            transition

            ${
              isOpen
                ? "border-[#159447] ring-2 ring-[#159447]/10"
                : "border-[#e7d8b9]"
            }

            ${disabled ? "cursor-not-allowed opacity-60" : ""}
          `}
        >

          {selectedVegetables.length > 0 && (
            <div
              className="
                flex
                h-11
                min-w-0
                items-center
                border-b
                border-[#eee4cf]
                bg-[#fafcf9]
              "
            >

              <button
                type="button"
                disabled={!canScrollLeft}
                onClick={() => scrollChips("left")}
                className="
                  flex
                  h-full
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  border-r
                  border-[#eee4cf]
                  bg-white
                  text-[#536157]
                  transition

                  hover:bg-[#edf8ef]
                  hover:text-[#159447]

                  disabled:cursor-default
                  disabled:opacity-25
                "
                aria-label="Scroll selected vegetables left"
              >
                <ChevronLeft size={17} />
              </button>

              <div
                ref={chipsRef}
                onScroll={updateScrollButtons}
                className="
                  flex
                  min-w-0
                  flex-1
                  items-center
                  gap-1.5
                  overflow-x-auto
                  overflow-y-hidden
                  scroll-smooth
                  px-2

                  scrollbar: none
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {selectedVegetables.map((vegetable) => (
                  <span
                    key={vegetable._id}
                    className="
                        inline-flex
                        h-7
                        shrink-0
                        items-center
                        gap-1.5
                        whitespace-nowrap
                        rounded-full
                        bg-[#edf8ef]
                        px-2.5
                        text-xs
                        font-semibold
                        text-[#107a3a]
                      "
                  >
                    {vegetable.name}

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        handleRemove(vegetable._id);
                      }}
                      className="
                          flex
                          h-4
                          w-4
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          transition
                          hover:bg-[#d8f1de]
                        "
                      aria-label={`Remove ${vegetable.name}`}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>

              <button
                type="button"
                disabled={!canScrollRight}
                onClick={() => scrollChips("right")}
                className="
                  flex
                  h-full
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  border-l
                  border-[#eee4cf]
                  bg-white
                  text-[#536157]
                  transition

                  hover:bg-[#edf8ef]
                  hover:text-[#159447]

                  disabled:cursor-default
                  disabled:opacity-25
                "
                aria-label="Scroll selected vegetables right"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          )}

          <div
            className="
              flex
              h-11
              min-w-0
              items-center
              gap-2
              px-3
            "
            onClick={() => {
              if (disabled) {
                return;
              }

              openDropdown();

              inputRef.current?.focus();
            }}
          >
            <Search
              className="
                h-4
                w-4
                shrink-0
                text-[#7a847c]
              "
            />

            <input
              ref={inputRef}
              type="text"
              value={search}
              disabled={disabled}
              placeholder={
                selectedIds.length > 0 ? "Add vegetable..." : placeholder
              }
              onFocus={openDropdown}
              onChange={(event) => {
                setSearch(event.target.value);

                setIsOpen(true);
              }}
              className="
                h-full
                min-w-0
                flex-1
                bg-transparent
                text-sm
                text-[#17201a]
                outline-none
                placeholder:text-[#8a938c]
              "
            />

            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();

                  handleClear();
                }}
                className="
                  shrink-0
                  text-xs
                  font-semibold
                  text-[#a85f00]
                  hover:underline
                "
              >
                Clear
              </button>
            )}

            <button
              type="button"
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();

                if (disabled) {
                  return;
                }

                if (isOpen) {
                  setIsOpen(false);

                  return;
                }

                openDropdown();

                inputRef.current?.focus();
              }}
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-md
                text-[#7a847c]
                transition
                hover:bg-[#edf8ef]
              "
              aria-label={
                isOpen ? "Close vegetable options" : "Open vegetable options"
              }
            >
              <ChevronDown
                className={`
                  h-4
                  w-4
                  transition-transform

                  ${
                    isOpen && dropdownPosition?.placement === "top"
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {dropdown}
    </>
  );
}
