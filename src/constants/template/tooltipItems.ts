import addQuestion from "src/assets/template/icons/addQuestion.svg";
import addSection from "src/assets/template/icons/addSection.svg";
import addImage from "src/assets/template/icons/addImage.svg";
import addTitleDesc from "src/assets/template/icons/addTitleDesc.svg";
import importQuestion from "src/assets/template/icons/importQuestion.svg";
import Delete from "src/assets/template/icons/delete.svg";

export default [
  {
    index: 0,
    title: "Add Question",
    icon: addQuestion,
    disabled: false,
  },
  {
    index: 1,
    title: "Add Section",
    icon: addSection,
    disabled: false,
  },
  // {
  //   index:2,
  //   title: 'Add Image',
  //   icon: addImage,
  //   disabled: false,
  // },
  // {
  //   index:3,
  //   title: 'Add Title & Description',
  //   icon: addTitleDesc,
  //   disabled: false,
  // },
  // {
  //   index:4,
  //   title: 'Import Question',
  //   icon: importQuestion,
  //   disabled: false,
  // },
  {
    index: 5,
    title: "Delete",
    icon: Delete,
    disabled: false,
  },
];
