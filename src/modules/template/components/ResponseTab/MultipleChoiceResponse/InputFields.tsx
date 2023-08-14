// import React, { useState } from 'react';
// import { useField, FieldArray } from 'formik';
// import { DragDropContext, Droppable, Draggable } from '@react-dnd/core';
// import { HTML5Backend } from 'react-dnd-html5-backend';

// interface InputField {
//   id: string;
//   value: string;
// }

// interface InputFieldsProps {
//   name: string;
// }

// const InputFields: React.FC<InputFieldsProps> = ({ name }) => {
//   const [inputFields, setInputFields] = useField([]);

//   const onDragEnd = (result: any) => {
//     if (!result.destination) {
//       return;
//     }

//     const { source, destination } = result;

//     setInputFields((prevInputFields: any) => {
//       const newInputFields = [...prevInputFields];
//       const [removed] = newInputFields.splice(source.index, 1);
//       newInputFields.splice(destination.index, 0, removed);
//       return newInputFields;
//     });
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <Droppable droppableId="inputFields">
//         {(provided: any) => (
//           <div {...provided.droppableProps} ref={provided.innerRef}>
//             <FieldArray
//               name={name}
//               render={(arrayHelpers:any) => (
//                 <>
//                   {inputFields.map((inputField, index) => (
//                     <Draggable key={inputField.id} draggableId={inputField.id} index={index}>
//                       {(provided) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}>
//                           <input
//                             type="text"
//                             value={inputField.value}
//                             onChange={(e) => {
//                               const newInputFields = [...inputFields];
//                               newInputFields[index].value = e.target.value;
//                               setInputFields(newInputFields);
//                             }}
//                           />
//                           <button type="button" onClick={() => arrayHelpers.remove(index)}>
//                             -
//                           </button>
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                   <button
//                     type="button"
//                     onClick={() => arrayHelpers.push({ id: Date.now().toString(), value: '' })}>
//                     +
//                   </button>
//                 </>
//               )}
//             />
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// };

// export default InputFields;
