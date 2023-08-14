import addQuestion from 'assets/template/icons/addQuestion.svg';
import addSection from 'assets/template/icons/addSection.svg';
import addImage from 'assets/template/icons/addImage.svg';
import addTitleDesc from 'assets/template/icons/addTitleDesc.svg';
import importQuestion from 'assets/template/icons/importQuestion.svg';
import Delete from 'assets/template/icons/delete.svg';

export default [
  {
    index:0,
    title: 'Add Question',
    icon: addQuestion,
    disabled: false,
  },
  {
    index:1,
    title: 'Add Section',
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
    index:5,
    title: 'Delete',
    icon: Delete,
    disabled: false,
  },
];
