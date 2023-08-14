export const engToNepMap = {
  0: "०",
  1: "१",
  2: "२",
  3: "३",
  4: "४",
  5: "५",
  6: "६",
  7: "७",
  8: "८",
  9: "९",
};
export const nepToEngMap = {
  "०": 0,
  "१": 1,
  "२": 2,
  "३": 3,
  "४": 4,
  "५": 5,
  "६": 6,
  "७": 7,
  "८": 8,
  "९": 9,
};

const nepaliMonthsInEnglish = {
  1: "Baisakh",
  2: "Jestha",
  3: "Ashad",
  4: "Shrawan",
  5: "Bhadra",
  6: "Asoj",
  7: "Kartik",
  8: "Mangshir",
  9: "Poush",
  10: "Magh",
  11: "Falgun",
  12: "Chaitra",
};

const nepaliMonths = {
  1: "बैशाख",
  2: "जेठ",
  3: "असार",
  4: "साउन",
  5: "भदौ",
  6: "असोज",
  7: "कार्तिक",
  8: "मंसिर",
  9: "पौष",
  10: "माघ",
  11: "फाल्गुण",
  12: "चैत",
};

const nepaliWeekDays = {
  0: "आइतवार",
  1: "सोमवार",
  2: "मंगलवार",
  3: "वुधवार",
  4: "विहीवार",
  5: "शुक्रवार",
  6: "शनिवार",
};

const nepaliWeekDaysInEnglish = {
  0: "Aaitabar",
  1: "Sombar",
  2: "Mangalbar",
  3: "Budhabar",
  4: "Bihibar",
  5: "Sukrabar",
  6: "Sanibar",
};

export const getNepaliDigits = (number = 1) => {
  return Array.from(String(number))
    .map((i) => engToNepMap[i])
    .join("");
};

export const getEnglishDigits = (number = 1) => {
  return Array.from(String(number))
    .map((i) => nepToEngMap[i])
    .join("");
};

export const getNepaliMonth = (number) => nepaliMonths[number];

export const formatDate = (OSIDate) => {
  const date = new Date("2014-07-04");
  const dateFormat = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedDate = dateFormat.format(date);
  return formattedDate;
};

export const getFullDateTime = (dateString: string) => {
  if (!dateString) {
    return "";
  }
  return new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" }).format(
    new Date(dateString.replaceAll("-", "/")),
  );
};

export const convertToDateTimeLocalString = (date: Date) => {
  // datetime-local wants, YYYY-mm-ddTHH:MM
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
