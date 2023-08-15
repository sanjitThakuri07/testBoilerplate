export const fileExtensions = (file: any) => {
  let fileOpen;
  let isFile = false;
  let isImage = false;
  let fileType;

  if (typeof file === "string") {
    const fileExtension = file?.split(".")?.pop();

    switch (fileExtension) {
      case "pdf":
        fileOpen = require("src/assets/images/pdf.png");
        fileType = "pdf";
        isFile = true;
        break;
      case "csv":
        fileOpen = require("src/assets/images/csv.png");
        fileType = "excell";
        isFile = true;
        break;
      case "xls":
      case "xlsx":
        fileOpen = require("src/assets/images/excel.png");
        fileType = "excell";
        isFile = true;
        break;
      case "docx":
      case "doc":
        fileOpen = require("src/assets/images/word.png");
        fileType = "doc";
        isFile = true;
        break;
      default:
        isImage = true;
        fileType = "image";
        isFile = false;
        fileOpen = `${process.env.REACT_APP_HOST_URL}/${file}`;
    }
  }
  if (typeof file === "object") {
    const fileExtension = file?.name?.split(".").pop();

    switch (fileExtension) {
      case "pdf":
        fileOpen = require("src/assets/images/pdf.png");
        fileType = "pdf";
        isFile = true;
        break;
      case "csv":
        fileOpen = require("src/assets/images/csv.png");
        fileType = "excell";
        isFile = true;
        break;
      case "xls":
      case "xlsx":
        fileOpen = require("src/assets/images/excel.png");
        fileType = "excell";
        isFile = true;
        break;
      case "docx":
      case "doc":
        fileOpen = require("src/assets/images/word.png");
        fileType = "doc";
        isFile = true;
        break;
      default:
        fileOpen = `${file.preview}`;
        isFile = false;
        isImage = true;
        fileType = "image";
        break;
    }
  }
  return {
    fileOpen,
    fileInModal: file?.preview ? file?.preview : `${process.env.REACT_APP_HOST_URL}/${file}`,
    isFile,
    isImage,
    fileType,
  };
};
