import React, { useState, useEffect } from 'react';
import { convertFromRaw, EditorState, ContentState, convertFromHTML } from 'draft-js';

import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../styles/TextEditor.scss';
import { Box } from '@mui/material';
// import CustomComponent from './CustomComponent';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../../styles/TextEditor.scss';
import { useTemplateFieldsStore } from 'containers/template/store/templateFieldsStore';

interface TextEditorInterface {
  setContentState?: React.Dispatch<React.SetStateAction<string | null>>;
  placeholder?: string | null;
  templateHeight?: boolean;
  item?: any;
  clearData?: boolean;
  setClearData?: Function;
  contentState?: any;
  editorKey?: any;
  updateDataState?: any;
}

export default function TextEditor({
  setContentState,
  placeholder,
  templateHeight,
  item,
  clearData,
  setClearData,
  contentState,
  editorKey,
  updateDataState,
}: TextEditorInterface) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { updateTemplateDatasets } = useTemplateFieldsStore();

  useEffect(() => {
    if (clearData) {
      setEditorState(EditorState.createEmpty());
      setClearData?.(false);
    }
  }, [clearData]);

  useEffect(() => {
    if (contentState?.length) {
      const blocksFromHTML = convertFromHTML(contentState);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );
      setEditorState(EditorState.createWithContent(state));
    }
  }, [contentState]);

  //   toolbar customization
  const toolbar = {
    options: [
      'blockType',
      'inline',
      'list',
      // "textAlign",
      'link',
      // "embedded",
      'image',
    ],
    blockType: {
      inDropdown: true,
      options: ['H2', 'H3', 'H4', 'Normal', 'Blockquote'],
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
    },
    inline: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ['bold', 'italic', 'underline'],
    },
    link: {
      options: ['link', 'unlink'],
      showOpenOptionOnHover: false,
    },
    list: {
      options: ['ordered', 'unordered'],
    },
    image: {
      className: undefined,
      component: undefined,
      popupClassName: undefined,
      urlEnabled: true,
      uploadEnabled: true,
      alignmentEnabled: true,
      uploadCallback: undefined,
      previewImage: false,
      inputAccept: 'image/gif,image/jpeg,image/jpg,image/png',
      alt: { present: true, mandatory: true },
      defaultSize: {
        height: 'auto',
        width: 'auto',
      },
    },
  };

  //   localization
  const localization = {
    locale: 'en-us',
    translations: {
      'generic.add': 'Add',
      'generic.cancel': 'Cancel',

      'components.controls.blocktype.normal': 'Normal',
      'components.controls.blocktype.h2': 'Heading 1',
      'components.controls.blocktype.h3': 'Heading 2',
      'components.controls.blocktype.h4': 'Heading 3',
      'components.controls.blocktype.blockquote': 'Blockquote',

      'components.controls.embedded.embedded': 'Embedded',
      'components.controls.embedded.embeddedlink': 'Embedded Link',
      'components.controls.embedded.enterlink': 'Enter link',

      'components.controls.link.linkTitle': 'Link Title',
      'components.controls.link.linkTarget': 'Link Target',
      'components.controls.link.linkTargetOption': 'Open link in new window',
      'components.controls.link.link': 'Link',
      'components.controls.link.unlink': 'Unlink',

      'components.controls.image.image': 'Image',
      'components.controls.image.fileUpload': 'File Upload',
      'components.controls.image.byURL': 'URL',
      'components.controls.image.dropFileText': 'Drop the file or click to upload',
    },
  };

  const handleContentStateChange = (contentState: string) => {
    // for dynamic controlled input template editor
    if (templateHeight) {
      updateTemplateDatasets(item, editorKey, draftToHtml(contentState));
      updateDataState(item, draftToHtml(contentState));
      return;
    }
    setContentState && setContentState(draftToHtml(contentState));
  };

  const handleEditorStateChange = (editorState: string) => {
    setEditorState(editorState);
  };

  return (
    <Box>
      <Editor
        editorState={editorState}
        toolbarClassName="editor-toolbar"
        wrapperClassName="editor-wrapper"
        editorClassName={`editorcontainer ${templateHeight ? 'templateHeight' : 'editor'}`}
        onEditorStateChange={handleEditorStateChange}
        onContentStateChange={handleContentStateChange}
        toolbar={toolbar}
        localization={localization}
        placeholder={placeholder}
        spellCheck

        // stripPastedStyles
        //   toolbarCustomButtons={[<CustomComponent />]}
      />
    </Box>
  );
}
