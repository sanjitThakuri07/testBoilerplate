import React, { useEffect, useState, useRef } from "react";
import {
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  convertToRaw,
  ContentState,
  convertFromHTML,
  convertFromRaw,
  Modifier,
  selectionState,
  CompositeDecorator,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import draftToHtml from "draftjs-to-html";
import HeaderStyl from "./DraftComponents/styleController";
import HeaderBlock from "./DraftComponents/blockController";
import { useSnackbar } from "notistack";
import Editor, { composeDecorators } from "@draft-js-plugins/editor";
import createVideoPlugin from "@draft-js-plugins/video";
import createImagePlugin from "@draft-js-plugins/image";
import createResizeablePlugin from "@draft-js-plugins/resizeable";
import createAlignmentPlugin from "@draft-js-plugins/alignment";
import "@draft-js-plugins/alignment/lib/plugin.css";
import MultiUploader from "src/components/MultiFileUploader/index";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import createFocusPlugin from "@draft-js-plugins/focus";
import "@draft-js-plugins/focus/lib/plugin.css";
import "./DraftComponents/style.scss";
import { postAPI } from "src/lib/axios";
import { ElevatorSharp } from "@mui/icons-material";
import FullPageLoader from "src/components/FullPageLoader";
import { v4 as uuidv4 } from "uuid";
import { fileExtensions } from "utils/fileExtensionChecker";
import { insertFile } from "./keyFunctions";
import { insert } from "formik";

// ======== //
const alignmentPlugin = createAlignmentPlugin();

const { AlignmentTool } = alignmentPlugin;

const focusPlugin = createFocusPlugin();

const videoPlugin = createVideoPlugin();
const resizeablePlugin = createResizeablePlugin();

const decorator = composeDecorators(
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
  focusPlugin.decorator,
  // fileDecorator,
);

const imagePlugin = createImagePlugin({ decorator });

const styles = {
  editor: {
    border: "1px solid gray",
    minHeight: "6em",
    textAlign: "left",
  },
};

const plugins = [videoPlugin, resizeablePlugin, imagePlugin, alignmentPlugin, focusPlugin];

const html = "";

const MyEditor = ({
  values,
  setContentState,
  templateHeight,
  contentValueState,
  name,
  disabled = false,
}) => {
  const [openMultiImage, setOpenMultiImage] = React.useState(false);
  const [newEditorState, setNewEditorState] = useState(EditorState.createEmpty());
  const [isLoading, setIsLoading] = useState(false);

  function getEditorValue() {
    if (values?.[`${name}`]) {
      // const draftEditor = stateFromHTML(values?.[`${name}`]);
      function wrapImagesWithFigure(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const images = doc.getElementsByTagName("img");
        // console.log({ images });
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const figure = doc.createElement("figure");
          const width = img.getAttribute("style").match(/width:\s*(\d+)/)?.[1];
          img.setAttribute(
            "style",
            img
              .getAttribute("style")
              .replace(/width:\s*(\d+)/, `width: ${width ? width : "auto"}%`),
          );
          img.setAttribute("width", width ? width : "auto");
          img.parentNode.insertBefore(figure, img);
          figure.appendChild(img);
        }
        return doc.documentElement.innerHTML + `\n<p>&nbsp;</p>`;
      }
      // let html2 =
      //   '<img src="https://bas-dev-api.bridge.propelmarine.com/static/activity/39/png-transparent-sonic-the-hedgehog-segasonic-the-hedgehog-sonic-sega-all-stars-racing-sonic-unleashed-sonic-colors-sonic-best-free-s-game-sonic-the-hedgehog-video-game-thumbnail.png" style="width: 100%"></img>';
      // const draftEditor = stateFromHTML(html2);
      // console.log(wrapImagesWithFigure(values?.[`${name}`]));
      const draftEditor = stateFromHTML(wrapImagesWithFigure(values?.[`${name}`]));
      return draftEditor;
    }
  }
  const [clearData, setClearData] = useState(false);
  const [editorValue, setEditorValue] = React.useState(() => {
    if (html) {
      const draftEditor = stateFromHTML(html);
      return {
        htmlValue: html,
        editorState: values?.[`${name}`]
          ? EditorState.createWithContent(getEditorValue())
          : EditorState.createEmpty(),
      };
    } else {
      return {
        value: "<p></p>",
        editorState: values?.[`${name}`]
          ? EditorState.createWithContent(getEditorValue())
          : EditorState.createEmpty(),
      };
    }
  });

  // console.log(draftToHtml(convertToRaw(editorValue?.editorState.getCurrentContent())), 'jj');

  // General Function
  const refContainer = useRef();
  const focusEditor = () => {
    refContainer.current.focus();
  };

  // Toggle Handle function
  const toggleInlineStyle = (inlineStyle) => {
    onChange(RichUtils.toggleInlineStyle(editorValue.editorState, inlineStyle));
  };

  const toggleBlockType = (blockType) => {
    onChange(RichUtils.toggleBlockType(editorValue.editorState, blockType));
  };

  const insertImage = (url) => {
    let { fileOpen, isFile, fileInModal, fileType } = fileExtensions(url);
    // if (fileType === 'pdf' || fileType === 'doc' || fileType === 'excell') {
    // } else {
    //   const contentState = editorValue.editorState.getCurrentContent();
    //   const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', {
    //     src: url,
    //     resizable: true,
    //     height: 25,
    //     width: 25,
    //     alt: '',
    //   });
    //   const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    //   const newEditorState = EditorState.set(editorValue.editorState, {
    //     currentContent: contentStateWithEntity,
    //   });
    //   return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    // }
    const contentState = editorValue.editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity("IMAGE", "IMMUTABLE", {
      src: url,
      resizable: true,
      height: 25,
      width: 25,
      alt: "",
    });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorValue.editorState, {
      currentContent: contentStateWithEntity,
    });
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  };

  const handlePastedFiles = (files) => {
    const state = insertImage(files);
    setEditorValue({
      ...editorValue,
      editorState: state,
    });
    setNewEditorState(state);
    setContentState(draftToHtml(convertToRaw(state.getCurrentContent())));
  };

  const onChange = (editorState) => {
    setEditorValue({ ...editorValue, editorState });
    setContentState(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    if (newEditorState?.getCurrentContent().getPlainText()?.length) {
      setEditorValue({ ...editorValue, editorState: newEditorState });
      setNewEditorState(EditorState.createEmpty());
      setContentState(draftToHtml(convertToRaw(newEditorState.getCurrentContent())));
    }
  };

  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      {isLoading && <FullPageLoader />}
      <div className="editor__container">
        <div style={{ display: "flex", alignItems: "center" }} className="header__toolbar">
          <HeaderBlock editorState={editorValue.editorState} onToggle={toggleBlockType} />
          <HeaderStyl editorState={editorValue.editorState} onToggle={toggleInlineStyle} />
        </div>
        <div onClick={focusEditor} className="editor__content">
          <Editor
            ref={refContainer}
            editorState={editorValue.editorState}
            onChange={onChange}
            plugins={plugins}
            readOnly={disabled}
            className={disabled ? "disabled" : ""}
          />
        </div>
        <div className="image__uploader-box">
          <MultiUploader
            setOpenMultiImage={setOpenMultiImage}
            multiple={false}
            disabled={disabled}
            openMultiImage={openMultiImage}
            icon={
              <>
                <div onClick={() => setOpenMultiImage(true)} className="attach__document">
                  <AttachFileIcon />
                  <span>Attach Document</span>
                  <span className="light">(max. 15 MB)</span>
                </div>
              </>
            }
            getFileData={async (files) => {
              setEditorValue((prev) => ({
                ...prev,
                editorState: insertFile({
                  EditorState,
                  AtomicBlockUtils,
                  editorState: editorValue?.editorState,
                  Modifier,
                  selectionState,
                }),
              }));
              if (files?.length && files[0].documents?.length) {
                const formData = new FormData();
                formData.append("id", values?.id ? values?.id : uuidv4());
                const fileArr = files[0]?.documents.map((doc) => {
                  formData.append(`files`, doc?.file);
                  return { base64: doc?.base64, file: doc?.file };
                });
                // setFieldValue('document', fileArr);
                // console.log({ fileArr });
                setIsLoading(true);
                // const { data } = await postAPI('/activity/upload-media/', formData);

                // if (data) {
                //   let imageUrl = process.env.VITE_HOST_URL + '/' + data?.media?.[0];
                //   handlePastedFiles(imageUrl);
                //   setIsLoading(false);
                //   enqueueSnackbar('File added successfully');
                // } else {
                //   setIsLoading(false);
                //   enqueueSnackbar('Sorry ! something went wrong. Please try again later', {
                //     variant: 'error',
                //   });
                // }
                setIsLoading(false);
                setClearData(true);
              }
            }}
            initialData={[]}
            clearData={clearData}
            setClearData={setClearData}
            accept={{
              "image/jpeg": [".jpeg", ".jpg"],
              "image/png": [".png"],
              "application/pdf": [".pdf"],
              "application/csv": [".csv"],
              "application/xlsx": [".xlsx"],
            }}
            maxFileSize={15}
            requireDescription={false}
          />
        </div>
      </div>
    </>
  );
};

export default MyEditor;
