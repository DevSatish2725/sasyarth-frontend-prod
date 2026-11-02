import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import { locationService } from "@/services/location.service";
import { useMemo } from "react";
import { Location } from "@/types/location.types";

export const useLocations = (locationSearch: string) => {
  const debouncedLocationSearch = useDebounce(locationSearch, 300);

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: ["locations", debouncedLocationSearch],

    queryFn: () => {
      if (!locationSearch) {
        return Promise.resolve([]);
      }

      return locationService.searchLocations({
        searchQuery: locationSearch,
        limit: 10,
      });
    },

    enabled:
      Boolean(debouncedLocationSearch) &&
      debouncedLocationSearch.trim().length >= 2,
  });

  const locationList = useMemo(() => {
    return locations?.data
      ? locations.data.map((location: Location) => {
          const {
            habitationId,
            maujaId,
            villageId,
            blockId,
            districtId,
            stateId,
            habitation,
            mauja,
            village,
            block,
            district,
            state,
          } = location;
          const uniquePlace = () => {
            if (habitation.en === mauja.en && habitation.en === village.en) {
              return {
                en: habitation.en,
                hi: habitation.hi,
              };
            } else if (mauja.en === village.en) {
              return {
                en: `${habitation.en} < ${mauja.en}`,
                hi: `${habitation.hi} < ${mauja.hi}`,
              };
            } else if (habitation.en === mauja.en) {
              return {
                en: `${habitation.en} < ${village.en}`,
                hi: `${habitation.hi} < ${village.hi}`,
              };
            } else {
              return {
                en: `${habitation.en} < ${mauja.en} < ${village.en}`,
                hi: `${habitation.hi} < ${mauja.hi} < ${village.hi}`,
              };
            }
          };
          return {
            ids: {
              habitationId,
              maujaId,
              villageId,
              blockId,
              districtId,
              stateId,
            },
            displayNames: {
              en: `${uniquePlace().en} < ${block.en} < ${district.en} < ${state.en}`,
              hi: `${uniquePlace().hi} < ${block.hi} < ${district.hi} < ${state.hi}`,
            },
          };
        })
      : [];
  }, [locations]);

  return { locationList, locationsLoading };
};
