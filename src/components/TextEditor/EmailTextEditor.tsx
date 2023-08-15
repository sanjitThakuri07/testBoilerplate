import React, { useState, useRef, useEffect } from "react";
import {
  EditorState,
  Modifier,
  convertToRaw,
  Entity,
  convertFromRaw,
  convertFromHTML,
  ContentState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import styles from "./select.module.css";
import { v4 as uuidv4 } from "uuid";
import MultiSelect from "src/components/CustomMultiSelect/index";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";

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
  simpleTextEditor?: boolean;
  parentFormik?: any;
  disabled?: boolean;
  fetchAPIFunction?: Function;
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
      className={styles["option-badge"]}
    >
      {text}
      <span className={styles["remove-btn"]}>&times;</span>
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

function CreateCustomDecorator(
  removeText: any,
  setDeleteText: any,
  backendOptions?: any,
  disabled?: boolean,
) {
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
      const button = e.target.closest("button");
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
      <button
        style={{ color: "red", display: "inline-flex" }}
        disabled={disabled}
        // contentEditable={false}
        onClick={onClick}
        className={`custom__button-editor ${styles["option-badge"]} ${styles["custom__button-editor"]}`}
        data-placement={placementCount}
      >
        {text}
        {!disabled && <span className={styles["remove-btn"]}>&times;</span>}
      </button>
    );
  };

  return [
    {
      strategy: customStyleDecorator,
      component: CustomComponent,
    },
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
  simpleTextEditor,
  parentFormik,
  disabled,
  fetchAPIFunction,
}: TextEditorInterface) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [newEditor, setNewEditor] = useState(EditorState.createEmpty());
  const [selectTag, setSelectTag] = useState<any>([]);
  const [readOnly, setReadOnly] = useState(false);
  const editorRef = useRef(null);
  const [deleteText, setDeleteText] = useState({
    placement: null,
    value: "",
    startIndex: null,
  });

  //   toolbar customization
  const toolbar = {
    blockType: {
      inDropdown: false,
      options: ["H1", "H2", "H3", "H4", "Normal", "Blockquote"],
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
    },
    options: ["blockType", "inline", "list", "textAlign", "link", "embedded"],

    inline: {
      inDropdown: false,
      className: undefined,
      component: undefined,
      dropdownClassName: undefined,
      options: ["bold", "italic", "underline"],
    },
    link: {
      options: ["link", "unlink"],
      showOpenOptionOnHover: false,
    },
    list: {
      options: ["ordered", "unordered"],
    },
  };

  //   localization
  const localization = {
    locale: "en-us",
    translations: {
      "generic.add": "Add",
      "generic.cancel": "Cancel",

      "components.controls.blocktype.normal": "Normal",
      "components.controls.blocktype.h2": "Heading 1",
      "components.controls.blocktype.h3": "Heading 2",
      "components.controls.blocktype.h4": "Heading 3",
      "components.controls.blocktype.blockquote": "Blockquote",

      "components.controls.embedded.embedded": "Embedded",
      "components.controls.embedded.embeddedlink": "Embedded Link",
      "components.controls.embedded.enterlink": "Enter link",

      "components.controls.link.linkTitle": "Link Title",
      "components.controls.link.linkTarget": "Link Target",
      "components.controls.link.linkTargetOption": "Open link in new window",
      "components.controls.link.link": "Link",
      "components.controls.link.unlink": "Unlink",

      "components.controls.image.image": "Image",
      "components.controls.image.fileUpload": "File Upload",
      "components.controls.image.byURL": "URL",
      "components.controls.image.dropFileText": "Drop the file or click to upload",
    },
  };

  //   our decorater function that finally converts the text data into needed button or components
  const compositeDecorator = CreateCustomDecorator(
    removeText,
    setDeleteText,
    backendFields,
    disabled,
  );

  function removeText(text: any) {
    // did not get the current updated editor state so needed to do with useEffect
  }

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
      const newContentState = Modifier.replaceText(contentState, selectionState, "");
      const newEditorState = EditorState.push(editorState, newContentState, "delete-character");
      setEditorState(newEditorState);
      setDeleteText({ placement: null, value: "", startIndex: null });
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

  //   add in toolbar
  function ChooseBackendField() {
    function addData(text: string) {
      const contentState = editorState.getCurrentContent();
      const selectionState = editorState.getSelection();
      const newContentState = Modifier.insertText(contentState, selectionState, `{{${text}}} `);
      const newEditorState = EditorState.push(editorState, newContentState, "insert-characters");
      setEditorState(newEditorState);
    }

    return (
      <div className={styles["custom__select-container"]}>
        <MultiSelect
          options={backendFields}
          onChange={(data?: any) => {
            if (data?.value) {
              setSelectTag(data);
              addData(data?.value);
            } else {
              setSelectTag("");
            }
          }}
          value={selectTag}
          placeholder="Select dynamic fields"
        />
      </div>
    );
  }

  useEffect(() => {
    if (values?.content?.length || values?.id) {
      if (values?.content) {
        let compare = "<p></p>\n";
        const blocksFromHTML = convertFromHTML(
          compare == values?.content ? `<p>Type here...</p>` : values?.content,
        );
        const state = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap,
        );
        const newEditorState = EditorState.push(editorState, state, "insert-characters");
        setEditorState(newEditorState);
      }
    }
  }, [values?.content]);

  return (
    <>
      <>
        <h2
          style={{
            color: "#283352",
            fontWeight: "800",
            fontSize: "15px",
            letterSpacing: "1px",
          }}
        >
          {simpleTextEditor ? null : `To open backend field option type {`}
        </h2>

        {/* {!simpleTextEditor && (
          <button
            type="button"
            onClick={() => {
              fetchAPIFunction?.();
            }}>
            Fetch Dynamic Fields
          </button>
        )} */}

        {!simpleTextEditor && (
          <Button
            startIcon={<RefreshIcon />}
            variant="outlined"
            onClick={() => {
              fetchAPIFunction?.();
            }}
            style={{ marginBottom: "10px", float: "right", position: "relative", bottom: "-60px" }}
          >
            Dynamic Fields
          </Button>
        )}

        <Editor
          style={{ height: "100px" }}
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          toolbarClassName={`editor-toolbar ${styles["custom__toolbar"]}`}
          wrapperClassName="editor-wrapper"
          editorClassName={`editorcontainer ${disabled ? "disabled" : ""} ${
            simpleTextEditor
              ? "simple_editor_component"
              : templateHeight
              ? "my-custom-editor__container"
              : "editor"
          }`}
          placeholder="Type here..."
          toolbar={simpleTextEditor ? toolbar : <></>}
          customDecorators={compositeDecorator}
          readOnly={disabled}
          toolbarCustomButtons={simpleTextEditor ? [] : [<ChooseBackendField />]}
          mention={{
            separator: " ",
            trigger: "{",
            suggestions: backendFields?.map((field: any) => ({
              ...field,
              text: `${field?.label}`,
              value: `{${field?.label}}}`,
            })),
          }}
        />
      </>
    </>
  );
}

export default MyEditor;
