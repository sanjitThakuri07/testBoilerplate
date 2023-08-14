import draftToHtml from 'draftjs-to-html';
import {
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  convertToRaw,
  ContentState,
  convertFromHTML,
  convertFromRaw,
} from 'draft-js';

export const insertFile = ({
  fileUrl,
  fileType,
  EditorState,
  AtomicBlockUtils,
  editorState,
  set,
}: any) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity('FILE', 'IMMUTABLE', {
    src: 'https://bas-dev-api.bridge.propelmarine.com/static/activity/000d261c-d496-4912-9b66-f79f8ffcb50d/JavaScriptNotesForProfessionals.pdf',
  });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(editorState, {
    currentContent: contentStateWithEntity,
  });

  const newContentState = AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
  const newSelection = newContentState.getSelection().merge({
    anchorOffset: 0,
    focusOffset: 0,
  });
  const updatedEditorState = EditorState.forceSelection(newContentState, newSelection);
  console.log(draftToHtml(convertToRaw(updatedEditorState.getCurrentContent())), 'shhs');

  //   setEditorState(updatedEditorState);
  return updatedEditorState;
};

// export const insertFile = ({
//   fileUrl,
//   fileType,
//   EditorState,
//   AtomicBlockUtils,
//   editorState,
//   set,
//   Modifier,
//   selectionState,
// }: any) => {
//   const contentState = editorState.getCurrentContent();
//   const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
//     url: 'http://www.zombo.com',
//   });
//   const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
//   const contentStateWithLink = Modifier.applyEntity(
//     contentStateWithEntity,
//     selectionState,
//     entityKey,
//   );
//   const newEditorState = EditorState.set(editorState, {
//     currentContent: contentStateWithLink,
//   });
//   //   setEditorState(updatedEditorState);
//   return newEditorState;
// };

export const handleLinkAdd = ({ editorState, linkPlugin }: any) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const contentStateWithLink = linkPlugin.addLinkAtSelection(
    contentState,
    selectionState,
    'https://example.com',
  );
  const newEditorState = EditorState.push(editorState, contentStateWithLink, 'insert-characters');
  //   setEditorState(newEditorState);
  return newEditorState;
};
