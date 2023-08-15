import React, { CSSProperties, useEffect, useState } from "react";
import { Box, Divider, InputLabel, Stack, Switch, TextField } from "@mui/material";
import { useDrag } from "react-dnd";
import { useTextAnswer } from "src/store/zustand/globalStates/templates/TextAnswer";
import { itemTypes } from "src/modules/template/itemTypes/itemTypes";
import TextEditor from "src/components/TextEditor/TextEditor";
import { IOSSwitch } from "src/components/switch/IosSwitch";

export default function ({ updateDataState, item }: any) {
  const [isQuestionFocused, setIsQuestionFocused] = React.useState(false);
  const { question, setQuestion } = useTextAnswer();
  const [textValue, setTextValue] = useState<string>("");
  const [duplicate, setDuplicate] = useState(false);
  const [required, setRequired] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: itemTypes.TEXT_ANSWER,
    item: {
      name: "Text Answer",
      type: itemTypes.TEXT_ANSWER,
      id: 1,
      position: { x: 0, y: 0 },
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const getStyle = (isDragging: boolean): CSSProperties => {
    const opacity = isDragging ? 0.4 : 1;
    const cursor = isDragging ? "grabbing" : "grab";
    return {
      opacity,
      cursor,
    };
  };

  useEffect(() => {
    if (question.length === 0) {
      setQuestion("Booking Id");
    } else if (textValue) {
      setQuestion(textValue);
    }
  }, [isQuestionFocused]);

  // const handleSwitchChange = (ev: ChangeEvent<HTMLInputElement>): void => {
  //   const name = ev.target.name as keyof SystemParamaterPayload;
  //   setFieldValue(name, !values[name]);
  //   setFieldTouched(name);
  // };

  return (
    <>
      <Divider />

      <Box sx={{ px: 2, pt: 2 }}>
        <div className="TextAnswer_wrapper" ref={drag} style={getStyle(isDragging)}>
          <Stack className="TextAnswer_wrapper_header">
            <Stack direction="row" sx={{ width: "100%", alignItems: "center" }} spacing={1.5}>
              <div className="draggable_icon">
                <img src="/src/assets/icons/dots.svg" alt="Drag" />
              </div>
              {!isQuestionFocused ? (
                <InputLabel htmlFor="Question" onClick={() => setIsQuestionFocused(true)}>
                  <div className="label-heading">{question}</div>
                </InputLabel>
              ) : (
                <div className="TextAnswer_input" style={{ width: "100%" }}>
                  <TextField
                    variant="standard"
                    autoFocus
                    value={textValue}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setTextValue(event.target.value);
                    }}
                    sx={{ backgroundColor: "#f9fafb", width: "100%" }}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    // onChange={(event) => setTextValue(event.target.value)}
                    onBlur={(event) => setIsQuestionFocused(false)}
                  />
                </div>
              )}
            </Stack>
            <div className="TextAnswer_input" style={{ width: "100%" }}>
              <TextEditor
                placeholder="Description (optional)"
                templateHeight={true}
                item={item}
                editorKey="titleAndDescValue"
              />
            </div>
            <Divider />
            <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 2 }}>
              <Stack direction="row" spacing={0.5}>
                <Box>Duplicate</Box>
                <Box>
                  <Switch
                    size="small"
                    checked={duplicate}
                    onChange={() => setDuplicate(!duplicate)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Box>
              </Stack>
              {/* required */}
              <Stack direction="row" spacing={0.5}>
                <Box>Required</Box>
                <Box>
                  <Switch
                    size="small"
                    checked={required}
                    onChange={() => setRequired(!required)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </div>
      </Box>
    </>
  );
}
