import JoditEditor from 'jodit-react';
import React, { useRef, useMemo } from 'react';
import { useField, useFormikContext } from 'formik';

const RichTextEditor = ({
  disabled = false,
  reinitialize = false,
  initialContent = '',
  onEditorContentChange = () => {},
}) => {
  const editor = useRef(null);

  const handleFileUpload = (file, callback) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result;
      const imageUrl = base64Data;
      callback(imageUrl);
    };

    reader.readAsDataURL(file);
  };

  return useMemo(
    () => (
      <JoditEditor
        ref={editor}
        value={initialContent ?? ''}
        config={{
          buttons: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'superscript',
            'subscript',
            'ul',
            'ol',
            'image',
            // Add other desired buttons/icons here
          ],
          toolbar: true,
          askBeforePasteFromWord: false,
          askBeforePasteHTML: false,
          showCharsCounter: false,
          disabled: disabled,
          uploader: {
            insertImageAsBase64URI: true,
            processFiles: (files, formData, onSuccess, onError) => {
              const file = files[0];
              handleFileUpload(file, (imageUrl) => {
                onSuccess(imageUrl);
              });
            },
          },
        }}
        tabIndex={1}
        onBlur={(newContent) => onEditorContentChange(newContent)}
        onChange={(newContent) => onEditorContentChange(newContent)}
      />
    ),
    [reinitialize, disabled],
  );
};

const TemplateEditor = (props) => {
  const handleEditorChange = props.handleEditorChange;
  const [field] = useField(props);
  const initialContent = props.value;
  const reinitialize = props.reinitialize;
  const { setReinitializeEditor } = props;

  const disabled = props.disabled;

  return (
    <RichTextEditor
      onEditorContentChange={(content) => handleEditorChange(content)}
      initialContent={initialContent}
      reinitialize={reinitialize}
      disabled={disabled}
      setReinitializeEditor={setReinitializeEditor}
    />
  );
};

export default TemplateEditor;
