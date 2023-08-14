import React from 'react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import ListIcon from '@mui/icons-material/List';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

import './style.scss';

const StyleButton = ({ onToggle, label, style, active }) => {
  const toggleBtn = (e) => {
    e.preventDefault();
    onToggle(style);
  };
  const iconEditor = (label) => {
    switch (label) {
      case 'Blockquote':
        return { text: 'Block', style: {} };
      case 'UL':
        return { text: <ListIcon />, style: {} };
      case 'OL':
        return { text: <FormatListNumberedIcon />, style: {} };
      case 'Bold':
        return { text: <FormatBoldIcon />, style: { fontWeight: 'bold' } };
      case 'Italic':
        return { text: <FormatItalicIcon />, style: { fontStyle: 'italic' } };
      case 'Underline':
        return { text: <FormatUnderlinedIcon />, style: { textDecoration: 'underline' } };
      default:
        return { text: label, style: {} };
    }
  };

  // const iconObj = {
  //   Blockquote: "Block",
  //   UL: "List",
  //   OL: "ORDERLIST",
  //   Bold: "Bold",
  //   Italic: "Italic",
  //   Underline: "Underline"
  // };

  return (
    <button
      type="button"
      className={`RichEditor-styleButton ${
        active && 'RichEditor-activeButton'
      } custom__rich-button__style`}
      onMouseDown={toggleBtn}>
      <div className="btn-editor-icon" style={iconEditor(label)?.style}>
        {iconEditor(label)?.text}
      </div>
    </button>
  );
};

export default StyleButton;
