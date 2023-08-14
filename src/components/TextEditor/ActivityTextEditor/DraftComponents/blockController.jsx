import React from 'react';
import StyleButton from './button';

const GroupText = [
  { label: 'H1', group: 'text', style: 'header-one' },
  { label: 'H2', group: 'text', style: 'header-two' },
  { label: 'H3', group: 'text', style: 'header-three' },
  { label: 'H4', group: 'text', style: 'header-four' },
  { label: 'H5', group: 'text', style: 'header-five' },
  { label: 'H6', group: 'text', style: 'header-six' },
];

const BLOCK_TYPES = [
  { label: 'H1', group: 'text', style: 'header-one' },
  { label: 'H2', group: 'text', style: 'header-two' },
  { label: 'H3', group: 'text', style: 'header-three' },
  { label: 'H4', group: 'text', style: 'header-four' },
  { label: 'H5', group: 'text', style: 'header-five' },
  { label: 'H6', group: 'text', style: 'header-six' },
  //   { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  // { label: 'Code Block', style: 'code-block' },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState?.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        (() => {
          switch (type?.group) {
            default:
              return (
                <StyleButton
                  key={type.label}
                  active={type.style === blockType}
                  label={type.label}
                  onToggle={props.onToggle}
                  style={type.style}
                />
              );
          }
        })(),
      )}
    </div>
  );
};

export default BlockStyleControls;
