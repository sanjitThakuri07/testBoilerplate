export interface ICalendarFilter {
  country: object[];
  region: object[];
  location: object[];
  customer: object[];
  activity_status: object[];
  inspection?: object[];
  inspection_type?: any;
  inspection_status: object[];
  territory: object[];
  booking_status: object[];
  display_options: object[];
  start_date: string;
  end_date: string;
}

export interface CalendarFilter {
  filterName: string;
  setFilterName: (payload: string) => void;

  filterFields: ICalendarFilter;
  setFilterFields: (payload: ICalendarFilter) => void;

  filterId: number;
  setFilterId: (payload: number) => void;
}
