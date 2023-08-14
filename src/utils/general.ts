import { customAlphabet } from "nanoid/non-secure";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSSTUVWXYZ1234567890",
  15,
);

export const getNanoID = () => nanoid().replace(/[0-9]+/gi, "");

export const getArrayOfCountingNumbers = (length = 10) =>
  Array(length)
    .fill(0)
    .map((_, i) => i + 1);

export const getArrayOfCountingNumbers2 = (length = 10) => Array.from({ length }, (_, i) => i + 1);

export const getQueryString = (obj: any) => new URLSearchParams(obj).toString();

export const consoleLogFormData = (formData: any) => {
  for (const pair of formData.entries()) {
    console.info(`${pair[0]} = ${pair[1]}`);
  }
};

export const shallowEqual = ({ object1, object2 }: any) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
};

export const checkPermission = ({ permission, permissions = [] }: any) => {
  const result =
    !permission ||
    !permission.length ||
    (permissions.length && Array.isArray(permission)
      ? permissions.some((v) => permission.includes(v))
      : permissions.includes(permission));

  return result;
};

// export const parseJwt = (token?: string) => {
//   if (!token) return "";
//   const base64Url = token.split(".")[1];
//   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split("")
//       .map(function (c) {
//         return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
//       })
//       .join(""),
//   );

//   return JSON.parse(jsonPayload);
// };

// export const getParsedJWT = parseJwt(sessionStorage.getItem(`accessToken`) as any);

export function setIntervalWithCount(delay = 500, noOfTimes = 5) {
  let count = 0;
  const intervalID = setInterval(() => {
    count += 1;
    if (count === noOfTimes) {
      window.clearInterval(intervalID);
    }
  }, delay);
}

export const getModifiedValues = (currentValues: object, initialValues: object) => {
  const modifiedValues = {};

  if (currentValues) {
    Object.entries(currentValues).forEach((entry) => {
      const key = entry[0];
      const value = entry[1];

      if (value !== initialValues[key]) {
        modifiedValues[key] = value;
      }
    });
  }

  return modifiedValues;
};

export const getFileExtension = (filename: any) => {
  const splittedFileIcon = String(filename).split(".");

  if (splittedFileIcon.length) {
    return splittedFileIcon[splittedFileIcon.length - 1];
  }
  return undefined;
};

export const downloadFromBlob = (blob: Blob, filename: string, extension: string) => {
  const fullName = `${filename}.${extension}`;
  const a = document.createElement("a");
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fullName;
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 1000);
};

export const downloadFromUrl = (url: string, filename?: string, extension?: string) => {
  const fullName = `${filename || "file"}.${extension || getFileExtension(url) || "txt"}`;
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = url;
  a.download = fullName;
  a.click();

  // clean up "a" element & remove ObjectURL
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};

// export const parseJwt = (token) => {
//   if (!token) return "";
//   const base64Url = token.split(".")[1];
//   const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split("")
//       .map(function (c) {
//         return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
//       })
//       .join(""),
//   );

//   return JSON.parse(jsonPayload);
// };

// export const getParsedJWT = parseJwt(sessionStorage.getItem(`accessToken`) as any);
