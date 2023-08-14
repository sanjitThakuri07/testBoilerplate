import React, { useState, useRef, useEffect } from 'react';
import {
  EditorState,
  Modifier,
  convertToRaw,
  Entity,
  convertFromRaw,
  convertFromHTML,
  ContentState,
  RichUtils,
  AtomicBlockUtils,
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { v4 as uuidv4 } from 'uuid';
import MultiSelect from 'components/CustomMultiSelect/index';
// import { convertFromHTML } from 'draft-js-import-html';

interface TextEditorInterface {
  setContentState?: React.Dispatch<React.SetStateAction<string | null>>;
  placeholder?: string | null;
  templateHeight?: boolean;
  selectedText?: any;
  selectOptionWhole?: any;
  setSelectedText?: any;
  setSelectOptionWhole?: any;
  backendFields?: any;
  contentValueState?: any;
  values?: any;
}

let placementCount = 0;

const CustomBackendTextButton = ({ index, deleteOption, text }: any) => {
  return (
    <button
      // key={v?.value}
      key={index}
      onClick={(e) => {
        e.stopPropagation();
        //  deleteOption(index);
      }}
      //   className={styles['option-badge']}
    >
      {text}
      {/* <span className={styles['remove-btn']}>&times;</span> */}
    </button>
  );
};

function findWithRegex(regex: any, contentBlock: any, callback: any) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

const imageBlockDecorator = {
  strategy: (
    contentBlock: any,
    callback: (start: number, end: number) => void,
    contentState: any,
  ) => {
    contentBlock.findEntityRanges((character: any) => {
      //   console.log(
      //     { character },
      //     character.getEntity(),
      //     contentState.getEntity(character.getEntity()),
      //   );
      //   const entityKey = character.getEntity();
      return true;
      //   return entityKey !== null && contentState.getEntity(entityKey).getType() === 'IMAGE';
    }, callback);
  },
  component: (props: any) => {
    console.log(props, 'jsjsj');
    // const { blockKey, contentState, block } = props;
    // const entity = contentState?.getEntity(block.getEntityAt(0));
    // const { src } = entity?.getData();
    console.log('hhh');

    // const handleDelete = () => {
    //   const newContentState = contentState.mergeEntityData(block.getEntityAt(0), { src: null });
    //   const newEditorState = EditorState.set(EditorState.createWithContent(newContentState), {
    //     selection: props.getEditorState().getSelection(),
    //   });
    //   props.setEditorState(RichUtils.toggleBlockType(newEditorState, 'unstyled'));
    // };

    return (
      <div className="image-block">
        {/* <img src={src} alt="" /> */}
        <button>Delete</button>
      </div>
    );
  },
};

function CreateCustomDecorator(removeText: any, setDeleteText: any, backendOptions?: any) {
  const [selectTag, setSelectTag] = useState([]);

  function customStyleDecorator(contentBlock: any, callback: any) {
    const regex = /{{\s*(.*?)\s*}}/g;
    findWithRegex(regex, contentBlock, callback);
  }

  const CustomComponent = (props: any) => {
    let { children } = props;
    let { start, text } = children?.[0]?.props;
    const onClick = (e: any) => {
      e.preventDefault();
      if (!e.target) return;
      const button = e.target.closest('button');
      let value = button?.textContent;
      let { start, text } = children?.[0]?.props;
      removeText(value);
      setDeleteText({
        value: value,
        placement: 5,
        startIndex: start,
      });
    };

    return (
      <>
        <button
          style={{ color: 'red', display: 'inline-flex' }}
          // contentEditable={false}
          onClick={onClick}
          // className={`custom__button-editor ${styles['option-badge']} ${styles['custom__button-editor']}`}
          data-placement={placementCount}>
          {/* {text} */}
          <img
            src="https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-12-r1.jpg"
            alt=""
            style={{ width: '150px' }}
          />
          {/* <span className={styles['remove-btn']}>&times;</span> */}
        </button>
      </>
    );
  };

  return [
    {
      strategy: customStyleDecorator,
      component: CustomComponent,
    },
    // imageBlockDecorator,
  ];
}

function GetPlainTextFn(editorState: any) {
  const contentState = editorState.getCurrentContent();
  const contentStateText = contentState.getPlainText();
  return contentStateText;
}

function MyEditor({
  setContentState,
  placeholder,
  templateHeight,
  selectedText,
  selectOptionWhole = [],
  setSelectedText,
  setSelectOptionWhole,
  backendFields,
  contentValueState,
  values,
}: any) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [newEditor, setNewEditor] = useState(EditorState.createEmpty());
  const [selectTag, setSelectTag] = useState<any>([]);
  const [readOnly, setReadOnly] = useState(false);
  const editorRef = useRef(null);
  const [deleteText, setDeleteText] = useState({
    placement: null,
    value: '',
    startIndex: null,
  });

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

  //   our decorater function that finally converts the text data into needed button or components
  const compositeDecorator = CreateCustomDecorator(removeText, setDeleteText, backendFields);

  function removeText(text: any) {
    // did not get the current updated editor state so needed to do with useEffect
  }

  //   test 1
  //   const handleEditorClick = () => {
  //     const selectionState = editorState.getSelection();
  //     const contentState = editorState.getCurrentContent();

  //     // Get the current block key and offset
  //     const blockKey = selectionState.getStartKey();
  //     const blockOffset = selectionState.getStartOffset();

  //     // Split the block into two
  //     const newContentState = Modifier.splitBlock(contentState, selectionState);

  //     // Create a new EditorState object with the new content
  //     const newEditorState = EditorState.push(editorState, newContentState, 'split-block');
  //     setEditorState(newEditorState);

  //     // Set the cursor at the beginning of the new block
  //     const newSelectionState = newEditorState.getSelection().merge({
  //       anchorOffset: blockOffset,
  //       focusOffset: blockOffset,
  //       anchorKey: blockKey,
  //       focusKey: blockKey,
  //     });

  //     const newerEditorState = EditorState.forceSelection(newEditorState, newSelectionState);
  //     setEditorState(newerEditorState);
  //   };

  //   test 2
  //   const handleEditorClick = () => {
  //     const selectionState = editorState.getSelection();
  //     const contentState = editorState.getCurrentContent();

  //     // Get the current block and text
  //     const block = contentState.getBlockForKey(selectionState.getStartKey());
  //     const text = block.getText();

  //     // Only split the block if the cursor is at the end of the text
  //     if (text.length === selectionState.getStartOffset()) {
  //       // Split the block into two
  //       const newContentState = Modifier.splitBlock(contentState, selectionState);

  //       // Create a new EditorState object with the new content
  //       const newEditorState = EditorState.push(editorState, newContentState, 'split-block');
  //       setEditorState(newEditorState);

  //       // Set the cursor at the beginning of the new block
  //       const newSelectionState = newEditorState.getSelection().merge({
  //         anchorOffset: 0,
  //         focusOffset: 0,
  //         anchorKey: block.getKey(),
  //         focusKey: block.getKey(),
  //       });

  //       const newerEditorState = EditorState.forceSelection(newEditorState, newSelectionState);
  //       setEditorState(newerEditorState);
  //     }
  //   };

  // test 3
  const handleEditorClick = () => {
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    // Save the current selection state
    const currentBlockKey = selectionState.getStartKey();
    const currentBlockOffset = selectionState.getStartOffset();
    const isCursorAtEnd =
      currentBlockOffset === contentState.getBlockForKey(currentBlockKey).getLength();

    // Split the block into two
    if (!isCursorAtEnd) return;
    const newContentState = Modifier.splitBlock(contentState, selectionState);

    // Create a new EditorState object with the new content
    const newEditorState = EditorState.push(editorState, newContentState, 'split-block');

    // Set the cursor at the beginning of the new block if the cursor was at the end
    let newSelectionState = newEditorState.getSelection();
    if (isCursorAtEnd) {
      newSelectionState = newSelectionState.merge({
        anchorOffset: 0,
        focusOffset: 0,
        anchorKey: currentBlockKey,
        focusKey: currentBlockKey,
      });
    }

    // Set the new editor state and selection state
    const newerEditorState = EditorState.forceSelection(newEditorState, newSelectionState);
    setEditorState(newerEditorState);
  };

  const insertImage = (url: any) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: url });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    const newEditorStateWithImage = AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      entityKey,
      ' ',
    );
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
  };

  const handlePastedFiles = (files: any) => {
    // const formData = new FormData();
    // formData.append('file', files[0]);
    // fetch('/api/uploads', { method: 'POST', body: formData })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.file) {
    //     }
    //     setEditorState(insertImage(data.file)); //created below
    // })
    // .catch((err) => {
    // });
    setEditorState(insertImage('https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-12-r1.jpg')); //created below
  };

  useEffect(() => {
    if (values?.document) {
      // handleImage(values?.document[0]?.file);
      setEditorState(insertImage('https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-12-r1.jpg'));
    }
  }, [values?.document]);

  //   logic to add and delete
  function updateTextEditor(editorState: any, deleteText: any) {
    if (deleteText?.value && !isNaN(deleteText?.startIndex)) {
      const contentState = editorState.getCurrentContent();
      const contentStateText = contentState.getPlainText();
      const textToDelete = deleteText?.value;
      //   const start = contentStateText.indexOf(textToDelete);
      const start = deleteText?.startIndex;
      //   to remove extra space need to verify for all conditions
      const end = start + textToDelete.length + 1;

      const selectionState = editorState.getSelection().merge({
        anchorOffset: start,
        focusOffset: end,
      });
      const newContentState = Modifier.replaceText(contentState, selectionState, '');
      const newEditorState = EditorState.push(editorState, newContentState, 'delete-character');
      // const contentStates = newEditorState.getCurrentContent();
      // const contentStateTexts = contentStates.getPlainText();

      // setNewEditor(newEditorState);
      setEditorState(newEditorState);
      setDeleteText({ placement: null, value: '', startIndex: null });
      setContentState?.(draftToHtml(convertToRaw(newEditorState.getCurrentContent())));
      return;
    }
  }

  //   editor change
  const handleEditorChange = (editorState: any, event: any) => {
    setEditorState(editorState);
    setContentState?.(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  };

  // run after we click on the delete
  useEffect(() => {
    if (deleteText?.value) {
      updateTextEditor(editorState, deleteText);
    }
  }, [deleteText?.value]);

  //   useEffect(() => {
  //     if (contentValueState?.length && values?.description) {
  //       const blocksFromHTML = convertFromHTML(contentValueState);
  //       const state = ContentState.createFromBlockArray(
  //         blocksFromHTML.contentBlocks,
  //         blocksFromHTML.entityMap,
  //       );
  //       const newEditorState = EditorState.push(editorState, state, 'insert-characters');
  //       setEditorState(newEditorState);
  //     }
  //   }, [values?.description]);

  return (
    <>
      <div
        onClick={(e: any) => {
          console.log(e);
        }}>
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          toolbarClassName={`editor-toolbar`}
          wrapperClassName="editor-wrapper"
          editorClassName={`editorcontainer  ${
            templateHeight ? 'my-custom-editor__container' : 'editor'
          }`}
          placeholder="Type here..."
          customDecorators={compositeDecorator}
          handlePastedFiles={handlePastedFiles}
          // readOnly={readOnly}
          // handleBeforeInput={(e: any) => {
          // }}
          //   toolbarCustomButtons={[<ChooseBackendField />]}
          //   mention={{
          //     separator: ' ',
          //     trigger: '{',
          //     suggestions: backendFields?.map((field: any) => ({
          //       ...field,
          //       text: `${field?.label}`,
          //       value: `{${field?.label}}}`,
          //     })),
          //   }}
        />
      </div>
    </>
  );
}

export default MyEditor;
