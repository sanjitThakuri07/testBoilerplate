// writting text in text editor
// const contentState = editorState.getCurrentContent();
// const selectionState = editorState.getSelection();
// const newContentState = Modifier.insertText(contentState, selectionState, customText);
// const newEditorState = EditorState.push(editorState, newContentState, 'insert-characters');
// setEditorState(newEditorState);

// const insertCustomElement = ({ editorState, onClick, customText }: any) => {
//     const contentState = editorState.getCurrentContent();
//     const selectionState = editorState.getSelection();

//     // Create a new ContentBlock with the custom element
//     const block = new ContentBlock({
//       key: new Date().getTime().toString(),
//       type: 'unstyled',
//       text: customText ? customText : '',
//       characterList: [],
//       data: {},
//       depth: 0,
//       entityRanges: [],
//       inlineStyleRanges: [],
//       children: [
//         {
//           type: 'CUSTOM_ELEMENT',
//           text: '',
//           characterList: [],
//           data: { onClick },
//         },
//       ],
//     });

//     // Insert the new block into the ContentState
//     const newContentState = ContentState.createFromBlockArray(
//       Modifier.insertFragment(contentState, selectionState, [block]).getBlockMap().toList(),
//     );

//     // Create a new EditorState with the updated ContentState
//     const newEditorState: any = insertCustomElement({
//       editorState,
//       onClick: handleClick,
//       customText,
//     });
//     setEditorState(newEditorState);
//     return newEditorState;
//   };

// method 3rd
// const insertCustomElement = ({ editorState, onClick, customText }: any) => {
//     const contentState = editorState.getCurrentContent();
//     const selectionState = editorState.getSelection();

//     // Create a new ContentBlock with the custom element
//     const customBlock = new ContentBlock({
//       key: new Date().getTime().toString(),
//       type: 'unstyled',
//       text: customText ? customText : '',
//       characterList: [],
//       data: {},
//       depth: 0,
//       entityRanges: [
//         {
//           offset: 0,
//           length: 1,
//           key: Entity.create('CUSTOM_ELEMENT', 'IMMUTABLE', { onClick }),
//         },
//       ],
//       inlineStyleRanges: [],
//       children: [],
//     });

//     // Add the custom block to the content state with an entity
//     const contentStateWithEntity = contentState.createEntity('CUSTOM_ELEMENT', 'IMMUTABLE', {
//       onClick,
//     });
//     const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
//     const newBlockMap = contentState
//       .getBlockMap()
//       .set(customBlock.key, customBlock.merge({ data: { entityKey } }));

//     // Create a new selection state with the inserted block
//     const insertedBlockKey = customBlock.key;
//     const insertedBlock = newBlockMap.get(insertedBlockKey);
//     const insertedBlockLength = insertedBlock.getLength();
//     const selectionStateAfter = selectionState.merge({
//       anchorKey: insertedBlockKey,
//       anchorOffset: insertedBlockLength,
//       focusKey: insertedBlockKey,
//       focusOffset: insertedBlockLength,
//       isBackward: false,
//     });

//     // Create a new editor state with the updated content and selection
//     const newContentState = contentState.set('blockMap', newBlockMap);
//     const newEditorState = EditorState.push(editorState, newContentState, 'insert-fragment');
//     return EditorState.forceSelection(newEditorState, selectionStateAfter);
//   };

// function createButtonDecorator() {
//     function findButtonEntities(contentBlock: any, callback: any) {
//       const text = contentBlock.getText();
//       const BUTTON_REGEX = /<button([^>]+)>(.*?)<\/button>/g;
//       let matchArr, start;
//       while ((matchArr = BUTTON_REGEX.exec(text)) !== null) {
//         start = matchArr.index;
//         const end = start + matchArr[0].length;
//         const data = {
//           html: matchArr[0],
//           onClick: (e: any) => {
//             e.stopPropagation();
//             console.log('Button clicked');
//           },
//         };
//         callback(start, end, { type: 'BUTTON', data });
//       }
//     }

//     function ButtonComponent(props: any) {
//       const { html, onClick } = props.contentState.getEntity(props.entityKey).getData();
//       return typeof buttonComponent === 'function' ? (
//         React.createElement(buttonComponent, { html, onClick })
//       ) : (
//         <span dangerouslySetInnerHTML={{ __html: html }} onClick={onClick} />
//       );
//     }

//     return new CompositeDecorator([
//       {
//         strategy: findButtonEntities,
//         component: ButtonComponent,
//       },
//     ]);
//   }
