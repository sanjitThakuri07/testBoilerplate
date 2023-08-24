import moment from "moment";

export const validateFieldTypeNames = {
  FLOAT: "FLOAT",
  NUMBER: "NUMBER",
};

export const queryMaker = (query: Object) => {
  const querys = Object.entries(query || {}).reduce((acc: any, [key, value]: any) => {
    if (Array.isArray(value)) {
      let subQuery = value.reduce((acc: any, curr: any) => {
        return (acc = acc + `${key}=${curr}&`);
      }, "");
      acc += `${subQuery}`;
    } else {
      acc += key === "filterQuery" ? (!value?.length ? "" : `${value}`) : `${key}=${value}&`;
    }

    return acc;
  }, "");
  return querys;
};

export const checkDate = function isValidDate(dateString: string) {
  return !isNaN(Date.parse(dateString));
};

export const formatDate = ({ date }: any) => {
  return moment(new Date(date)).format("MMM Do YY");
};

export const getHighestLowestData = ({ objectCollection }: any) => {
  let lowestStart = Infinity;
  let highestEnd = -Infinity;
  for (const key in objectCollection) {
    if (objectCollection?.hasOwnProperty(key) && typeof objectCollection?.[key] === "object") {
      const { start, end } = objectCollection?.[key];
      lowestStart = Math.min(lowestStart, start);
      highestEnd = Math.max(highestEnd, end);
    }
  }
  return {
    lowestStart,
    highestEnd,
  };
};

export function getObjectsWithinRange({ obj, startRange, endRange }: any) {
  const result: any = {};
  let lowestRange = Infinity;
  let highestRange = -Infinity;
  for (const key in obj) {
    if (typeof obj?.[key] === "object") {
      const { start, end } = obj?.[key];
      if (start > startRange && end < endRange) {
        result[key] = { start, end };
        lowestRange = Math.min(lowestRange, start);
        highestRange = Math.max(highestRange, end);
      }
    }
  }
  result.lowestStart = lowestRange;
  result.highestRange = highestRange;

  return result;
}

export function validateField(validateFieldType: string, value: string) {
  const regexFloat = /^[0-9]*\.?[0-9]*$/i;
  const numberRegex = /^[0-9\b\x7F]+$/;
  let testPass = false;
  switch (validateFieldType) {
    case validateFieldTypeNames?.FLOAT:
      testPass = regexFloat.test(value);
      break;
    case validateFieldTypeNames?.NUMBER:
      testPass = numberRegex.test(value);
      break;
    default:
      testPass = true;
      break;
  }

  return testPass;
}

export const checkUpperCase = (value?: string) => {
  return value?.match(/[A-Z]/g);
};

export const checkCharSymbol = (value?: string) => {
  return value?.match(/[\S]/g);
};

export const checkNumber = (value?: string) => {
  return value?.match(/\d/);
};

export function sortObjectKeysToCustomArray({ obj, customOrder }: any) {
  const keys = Object.keys(obj);
  keys.sort((a, b) => customOrder.indexOf(a) - customOrder.indexOf(b));
  return keys;
}

export function getNestedDataObject({ fetchData, data, fetchKey }: any) {
  let value: any;
  let keyName: any;
  if (fetchData instanceof Object) {
    let dataObject = data?.[fetchData?.obj_name];
    if (Array?.isArray(dataObject)) {
      let finalData = dataObject?.reduce((acc: any, curr: any) => {
        if (Array.isArray(curr?.[fetchData?.field_name])) {
          let val = curr?.[fetchData?.field_name]?.map((it: any) => {
            return checkDate(it) ? formatDate({ date: it }) : it;
          });

          acc.push(...(val || []));
        } else {
          let val = checkDate(curr?.[fetchData?.field_name])
            ? formatDate({ date: curr?.[fetchData?.field_name] })
            : curr?.[fetchData?.field_name];

          acc.push(val);
        }
        return acc;
      }, []);
      value = finalData;
    } else if (dataObject instanceof Object) {
      value = dataObject?.[fetchData?.field_name] || "";
    }
    keyName = fetchData?.label;
  } else {
    value = data?.[fetchKey] || "";
    keyName = fetchData;
  }

  return { value, keyName };
}

export function hexToHSLA(hex: any, alpha: any) {
  // Remove the '#' symbol if present
  hex = hex.replace("#", "");

  // Convert HEX to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Calculate max and min values for RGB
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  // Calculate the hue
  let h;
  if (max === min) {
    h = 0;
  } else if (max === r) {
    h = 60 * ((g - b) / (max - min));
  } else if (max === g) {
    h = 60 * (2 + (b - r) / (max - min));
  } else {
    h = 60 * (4 + (r - g) / (max - min));
  }

  if (h < 0) {
    h += 360;
  }

  // Calculate the lightness
  const l = (max + min) / 2;

  // Calculate the saturation
  let s;
  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = (max - min) / (max + min);
  } else {
    s = (max - min) / (2 - max - min);
  }

  return `hsla(${h}, ${s * 100}%, ${l * 100}%, ${alpha})`;
}

export function calculatePerceivedBrightness(r: any, g: any, b: any) {
  // Calculate perceived brightness using a formula
  return Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);
}

export function getContrastColor(h: any, s: any, l: any, a: any) {
  // Calculate RGB values from HSL
  const normalizedS = s / 100;
  const normalizedL = l / 100;
  const c = (1 - Math.abs(2 * normalizedL - 1)) * normalizedS;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = normalizedL - c / 2;

  let r, g, b;

  if (0 <= h && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (60 <= h && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (120 <= h && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (180 <= h && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (240 <= h && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // Adjust RGB values based on perceived brightness
  const perceivedBrightness = calculatePerceivedBrightness(r, g, b);
  const textColor = perceivedBrightness > 127 ? "#000000" : "#FFFFFF";

  return hexToHSLA(textColor, a);
}

export function getHSLA(hslaColor: any) {
  const hslaSeperation = hslaColor.split("hsla(")?.reverse()?.[0] || "";
  const [h, s, l, a] = hslaSeperation
    .match(/([\d.]+)%?,\s*([\d.]+)%?,\s*([\d.]+)%?,\s*([\d.]+)\)/)
    .slice(1)
    .map(Number);
  // console.log(
  //   { hslaSeperation },
  //   {
  //     value: hslaSeperation
  //       .match(/([\d.]+)%?,\s*([\d.]+)%?,\s*([\d.]+)%?,\s*([\d.]+)\)/)
  //       .slice(1)
  //       .map(Number),
  //   },
  // );
  return [h, s, l, a];
}
