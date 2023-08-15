import * as yup from 'yup';

export const EventValidation = yup.object().shape({
  title: yup.string().required('Title is required.'),
  //   type: yup.string().required('Type is required.'),
  // location: yup.array().min(1, 'Location is required').required(),
  attendees: yup.array().min(1, 'Attendees is required').required(),
  start_date: yup.string().required('Start date is required.'),
  end_date: yup.string().required('End date is required.'),
});

export const WeekDays = [
  { value: 6, label: 'Sun', name: 'Sunday' },
  { value: 0, label: 'Mon', name: 'Monday' },
  { value: 1, label: 'Tue', name: 'Tuesday' },
  { value: 2, label: 'Wed', name: 'Wednesday' },
  { value: 3, label: 'Thu', name: 'Thursday' },
  { value: 4, label: 'Fri', name: 'Friday' },
  { value: 5, label: 'Sat', name: 'Saturday' },
];

export const DaysInMonth = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
  { value: 13, label: '13' },
  { value: 14, label: '14' },
  { value: 15, label: '15' },
  { value: 16, label: '16' },
  { value: 17, label: '17' },
  { value: 18, label: '18' },
  { value: 19, label: '19' },
  { value: 20, label: '20' },
  { value: 21, label: '21' },
  { value: 22, label: '22' },
  { value: 23, label: '23' },
  { value: 24, label: '24' },
  { value: 25, label: '25' },
  { value: 26, label: '26' },
  { value: 27, label: '27' },
  { value: 28, label: '28' },
  { value: 29, label: '29' },
  { value: 30, label: '30' },
  { value: 31, label: '31' },
];

export const MonthOptions = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];

export const WeekDaysObj: any = {
  1: { value: 7, label: 'Sun', name: 'Sunday' },
  2: { value: 1, label: 'Mon', name: 'Monday' },
  3: { value: 2, label: 'Tue', name: 'Tuesday' },
  4: { value: 3, label: 'Wed', name: 'Wednesday' },
  5: { value: 4, label: 'Thu', name: 'Thursday' },
  6: { value: 5, label: 'Fri', name: 'Friday' },
  7: { value: 6, label: 'Sat', name: 'Saturday' },
};

export const RepeatOptions = [
  // { value: 1, label: 'Days' },
  // { value: 2, label: 'Weeks' },
  // { value: 3, label: 'Months' },
  // { value: 4, label: 'Years' },
  { value: 'daily', label: 'Days' },
  { value: 'weekly', label: 'Weeks' },
  { value: 'monthly', label: 'Months' },
  { value: 'yearly', label: 'Years' },
];

export const RepeatStatus = [
  {
    label: 'Every Day',
    value: 'daily',
  },
  {
    label: 'Every Weekday',
    value: 'weekdays',
  },
  {
    label: 'Every Week',
    value: 'weekly',
  },
  {
    label: 'Every Month',
    value: 'monthly',
  },
  {
    label: 'Every Year',
    value: 'yearly',
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];

export const monthYearChoose = [
  {
    label: 'Week',
    value: 'week',
  },
  {
    label: 'Months',
    value: 'month',
  },
];
