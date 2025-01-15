import { SortOrder } from "mongoose";
import { ShowType } from "../interfaces/show";

type SortOptions = {
    [key: string]: SortOrder;
};

type SortTypeOptions = {
    original_name?: 1 | -1;
    name?: 1 | -1;
    first_air_date?: 1 | -1;
};

export const getSortOptions = (sort = "date_desc"): SortOptions => {
    switch (sort) {
        case "name_asc":
            return { name: 1 };
        case "original_name_asc":
            return { original_name: 1 };
        case "date_asc":
            return { first_air_date: 1 };
        case "date_desc":
            return { first_air_date: -1 };
        default:
            return { name: 1 };
    }
};

export const sortShows = (shows: ShowType[], sortOptions: SortTypeOptions) => {
    return [...shows].sort((a, b) => {
        if (sortOptions.original_name) {
            return sortOptions.original_name * a.original_name.localeCompare(b.original_name);
        }
        if (sortOptions.name) {
            return sortOptions.name * a.name.localeCompare(b.name);
        }
        if (sortOptions.first_air_date) {
            return (
                sortOptions.first_air_date *
                (new Date(a.first_air_date).getTime() - new Date(b.first_air_date).getTime())
            );
        }
        return 0;
    });
};
