import { TextareaAutosize } from '@material-ui/core';
import { Button } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { v4 as uuidv4 } from 'uuid';

const TodoComponent = ({
  title,
  setFieldValue,
  item,
  getValue,
  value,
  dynamicField,
  values,
}: any) => {
  const [todoData, setTodoData]: any = useState([]);
  const [inputData, setInputData]: any = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (values?.length) {
      setTodoData(value?.filter((data: any) => data?.type) || []);
    }
  }, [value]);

  return (
    <div className="todo__component">
      <div className="todo__list">
        {todoData?.map((todo: any, index: number) => {
          return (
            <span key={todo?.id} className="list__item">
              <div className="input__field">
                <span>{index + 1}. </span>
                <span>{todo?.[`${dynamicField}`]}</span>
              </div>
              <div className="actions">
                <EditIcon
                  className="edit__icon"
                  onClick={() => {
                    setEditMode(true);
                    setInputData(todo);
                  }}
                />
                <DeleteIcon
                  className="delete__icon"
                  onClick={() => {
                    let previousData = [...(todoData || [])];
                    let updatedData = previousData?.filter((item: any) => item?.id !== todo?.id);
                    setTodoData((prev: any) => {
                      return updatedData;
                    });
                    if (Array.isArray(value)) {
                      let filterValue = value?.filter((item: any) => item?.id !== todo?.id);
                      setFieldValue?.(`${item?.component}__${item?.id}.value`, [
                        ...filterValue,
                        ...updatedData,
                      ]);
                      return;
                    }
                    setFieldValue?.(`${item?.component}__${item?.id}.value`, updatedData);
                  }}
                />
              </div>
            </span>
          );
        })}
      </div>
      <div className="actions">
        <TextareaAutosize
          placeholder={`Type your new ${title || 'data'}`}
          minRows={2}
          id="notes"
          onChange={(ev) => {
            setInputData((prev: any) => ({ ...prev, [dynamicField]: ev?.target?.value }));
          }}
          className={`text__area-style todo__input`}
          name="notes"
          value={inputData?.[dynamicField] || ''}
        />
        <Button
          type="button"
          variant="outlined"
          disabled={inputData?.[dynamicField] ? false : true}
          onClick={() => {
            if (!inputData?.[dynamicField]) return;
            let previousData = [...(todoData || [])];
            if (editMode) {
              let datas = previousData?.filter((todo: any) => todo?.id !== inputData?.id);
              let updatedData = [{ ...inputData }, ...(datas || [])];
              setTodoData((prev: any) => {
                return updatedData;
              });

              setInputData({});
              setEditMode(false);
              setFieldValue?.(
                `${item?.component}__${item?.id}.value`,
                Array.isArray(value) ? [...(value || []), ...(updatedData || [])] : updatedData,
              );

              getValue?.(todoData);
              return;
            }
            let updatedData = [
              ...(previousData || []),
              { id: uuidv4(), [dynamicField]: inputData?.[dynamicField], type: 'create' },
            ];
            setTodoData((prev: any) => updatedData);
            setInputData({});
            setFieldValue?.(
              `${item?.component}__${item?.id}.value`,
              Array.isArray(value) ? [...(value || []), ...updatedData] : updatedData,
            );
            // setFieldValue?.(`${item?.component}__${item?.id}.value`, updatedData);
            getValue?.(todoData);
          }}>
          {editMode ? `Edit ${title || 'data'}` : `Add new ${title || 'data'}`}
        </Button>
      </div>
    </div>
  );
};

export default TodoComponent;
