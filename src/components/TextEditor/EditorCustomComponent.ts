// import React from 'react';
// import PropTypes from 'prop-types';
// import { EditorState, Modifier } from 'draft-js';
// import { Box } from '@mui/material';

// interface EditorI {
//   editorState: any;
//   onChange: any;
// }

// const CustomComponent = ({ editorState, onChange }: EditorI) => {
//   const addStar = () => {
//     const contentState = Modifier.replaceText(
//       editorState.getCurrentContent(),
//       editorState.getSelection(),
//       '⭐',
//       editorState.getCurrentInlineStyle(),
//     );
//     onChange(EditorState.push(editorState, contentState, 'insert-characters'));
//   };

//   return (
//     <>
//       <div onCli={addStar}>⭐</div>
//     </>
//   );
// };

// CustomComponent.propTypes = {
//   onChange: PropTypes.func,
//   editorState: PropTypes.object,
// };

// export default CustomComponent;
