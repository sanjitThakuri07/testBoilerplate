/**
 * @description Validates the certain password criteria
 * @summary Atleast 8 characters. | Atleast 1 Digit. | Cannot use space.
 * @param password
 * @returns string[]
 * */

export interface IPasswordCriteria {
  valid?: boolean;
  value: string;
  key: "minEight" | "isSpace" | "atLeastNumber";
}

export const validatePassword = (
  passwordCriteria: IPasswordCriteria[],
  password: string,
) => {
    const number = new RegExp("(?=.*[0-9])");
    const length = new RegExp("(?=.{8,})");
    const space = new RegExp(/^\S*$/);
  return [...passwordCriteria].map((pc) => {
    if (pc.key === "minEight") {
      return {
        ...pc,
        valid: length.test(password),
      };
    }
    if (pc.key === "atLeastNumber") {
      return {
        ...pc,
        valid: number.test(password),
      };
    }
    if(pc.key === "isSpace") {
      return {
        ...pc,
        valid: space.test(password)
      }
    }
    return pc;
  })
};