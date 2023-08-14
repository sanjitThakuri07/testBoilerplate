import { CalendarFilter, ICalendarFilter } from 'interfaces/calendarFilter';
import moment from 'moment';
import { create } from 'zustand';

export const useCalendarFilter = create<CalendarFilter>((set: any) => ({
  filterName: '',
  setFilterName: (payload: string) => set({ filterName: payload }),

  filterFields: {
    country: [],
    region: [],
    location: [],
    customer: [],
    activity_status: [],
    inspection: [],
    inspection_status: [],
    territory: [],
    booking_status: [],
    display_options: [],
    start_date: moment().startOf('month').format('YYYY-MM-DD'),
    end_date: moment().endOf('month').format('YYYY-MM-DD'),
  },
  setFilterFields: (payload: ICalendarFilter) => set({ filterFields: payload }),

  filterId: 0,
  setFilterId: (payload: number) => set({ filterId: payload }),
}));
