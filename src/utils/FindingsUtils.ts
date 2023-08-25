import { v4 as uuidv4 } from "uuid";

const commonColorProp: any = {
  id: uuidv4(),
  value: "High",
  backgroundColor: "#000",
  textColor: "#F04438",
  dotColor: "#000",
  label: "High",
};

export const imageUrl =
  "https://media.licdn.com/dms/image/C560BAQGwHd4oj4DKFg/company-logo_100_100/0/1659430562669?e=1701302400&v=beta&t=b6ne-5pbfns2JKY_S9S0h-ioIKyeFPB-sUHJE6CKTeU";

export const RadioOptions: any = {
  High: {
    id: uuidv4(),
    value: "High",
    backgroundColor: "#FEF3F2",
    textColor: "#F04438",
    dotColor: "#B42318",
    label: "High",
  },
  Medium: {
    id: uuidv4(),
    value: "Medium",
    backgroundColor: "#FFFAEB",
    textColor: "#B54708",
    dotColor: "#F79009",
    label: "Medium",
  },
  "In Progress": {
    id: uuidv4(),
    value: "Medium",
    backgroundColor: "#FFFAEB",
    textColor: "#B54708",
    dotColor: "#F79009",
    label: "Medium",
  },
  Low: {
    id: uuidv4(),
    value: "Low",
    backgroundColor: " #ECFDF3",
    textColor: "#027A48",
    dotColor: "#12B76A",
    label: "Low",
  },
  Open: {
    id: uuidv4(),
    value: "Low",
    backgroundColor: " #E8F9FD",
    textColor: "#42C2FF",
    dotColor: "#9AC5F4",
    label: "Low",
  },
  "N/A": {
    id: uuidv4(),
    value: "N/A",
    backgroundColor: "#F2F4F7",
    textColor: "#667085",
    dotColor: "#344054",
    label: "N/A",
  },

  Active: {
    id: uuidv4(),
    value: "Active",
    backgroundColor: "#2e7d32",
    textColor: "#fff",
    dotColor: "#fff",
    label: "Active",
  },
  InActive: {
    id: uuidv4(),
    value: "Inactive",
    backgroundColor: "rgb(229, 229, 229)",
    textColor: "rgba(0, 0, 0, 0.87)",
    dotColor: "#616161",
    label: "Inactive",
  },
  Hold: {
    id: uuidv4(),
    value: "Inactive",
    backgroundColor: "rgb(229, 229, 229)",
    textColor: "rgba(0, 0, 0, 0.87)",
    dotColor: "#616161",
    label: "Inactive",
  },
  // daily: commonColorProp,
  Completed: {
    id: uuidv4(),
    value: "Completed",
    backgroundColor: "#ECFDF3",
    textColor: "#027A48",
    dotColor: "#12B76A",
  },
  // quotation
  Sent: {
    id: uuidv4(),
    backgroundColor: "#FFFAEB",
    textColor: "#B54708",
    dotColor: "#F79009",
  },

  Paid: {
    id: uuidv4(),
    backgroundColor: "#a0dbad",
    textColor: "#3a6e45",
    dotColor: "#3a6e45",
  },
  // quotation
  Accepted: {
    id: uuidv4(),
    backgroundColor: "rgb(222,248,220)",
    textColor: "#2A9730",
  },
  // quotation
  Rejected: {
    id: uuidv4(),
    backgroundColor: "rgb(250,213,213)",
    textColor: "#B1182B",
  },
  Converted: {
    id: uuidv4(),
    value: "Converted",
    backgroundColor: "rgb(232,249,255)",
    textColor: "4C91AA",
    dotColor: "#4C91AA",
    label: "Converted",
  },
  Regular: {
    id: uuidv4(),
    value: "Regular",
    backgroundColor: "#ECFDF3",
    textColor: "#027A48",
    dotColor: "#12B76A",
  },

  [`Logged In`]: {
    id: uuidv4(),
    backgroundColor: "rgb(222,248,220)",
    textColor: "#2A9730",
  },

  [`Logged Out`]: {
    id: uuidv4(),
    backgroundColor: "rgb(250,213,213)",
    textColor: "#B1182B",
  },

  default: {
    id: uuidv4(),
    value: "default",
    // backgroundColor: ' #ECFDF3',
    // backgroundColor: '#ECFDF3',
    backgroundColor: "#FFFAEB",
    textColor: "#B54708",
    dotColor: "#F79009",
    label: "default",
  },
};
