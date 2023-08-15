import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Collapse, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import React from "react";
import MobileTextAnswer from "./MobileTextAnswer/MobileTextAnswer";
// import MobileDateTime from './MobileDateTime/MobileDateTime';
import MobileOptions from "./MobileOptions/MobileOptions";
import MobileMedia from "./MobileMedia/MobileMedia";
import MobileSlider, { RangeSlider } from "./MobileSlider/MobileSlider";
import MobileLocation from "./MobileLocation/MobileLocation";
import SingleSelectMobile from "./SingleSelectMobile/SingleSelectMobile";
import MultipleSelectMobile from "./MultipleSelectMobile/MultipleSelectMobile";
import ReusableMobileComponent from "./ReusableMobileComponent/ReusableMobileComponent";
import { useTemplate } from "src/store/zustand/globalStates/templates/templateData";

interface MobilePreviewProps {
  children?: React.ReactNode;
}
const MobileIndex = ({ children }: MobilePreviewProps) => {
  const [open, setOpen] = React.useState(true);

  const { templateData } = useTemplate();

  const handleClick = () => {
    setOpen(!open);
  };

  let JSONData = [
    {
      id: "p1",
      component: "page",
      parent: null,
      name: "Page 1",

      isQuestionDisplayed: true,
      isSectionDisplayed: false,
      isTitleDescriptionDisplayed: false,
    },
    {
      id: "869474c2-646d-455b-a179-96eb4095d871",
      name: "New Question",
      component: "question",
      parent: null,
      parentPage: "p1",
      type: "text",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
    },
    {
      id: "3f409549-ab4e-48a6-8d0a-d03032cada14",
      name: "New Question",
      component: "question",
      type: "multiple",
      parent: null,
      parentPage: "p1",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
    },
    {
      id: "c0c9473b-9f47-4848-a77c-7e3c4205a041",
      name: "Second one",
      component: "question",
      parent: null,
      type: "single",
      parentPage: "p1",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
    },
    {
      id: "8685f2fe-173a-4102-8983-37c1821b1e98",
      name: "New Section",
      component: "section",
      parent: null,
      parentPage: "p1",
      isQuestionDisplayed: false,
      isSectionDisplayed: true,
    },
    {
      id: "3e4b4246-1417-430b-971b-1105385b9d10",
      name: "New Question",
      component: "question",
      parent: null,
      type: "location",
      parentPage: "p1",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
    },
    {
      id: "17991df9-462e-499d-9928-1d79c4fd5929",
      name: "New Section",
      component: "section",
      parent: null,
      parentPage: "p1",
      isQuestionDisplayed: false,
      isSectionDisplayed: true,
    },
    {
      id: "d65fcc54-5955-49ff-999d-27be7e906044",
      name: "New Section",
      component: "section",
      parent: null,
      parentPage: "p1",
      isQuestionDisplayed: false,
      isSectionDisplayed: true,
    },
    {
      id: "02c72984-223f-4537-91d0-0d89ea96a1d7",
      name: "New Question",
      component: "question",
      parent: null,
      parentPage: "p1",
      type: "media",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
    },
    {
      id: "38db4e8c-fe07-4425-bf4d-4907788b2ded",
      name: "New Question",
      component: "question",
      parent: null,
      parentPage: "p1",
      type: "slider",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
    },
    {
      id: "cf4467a8-90e5-474a-a8f3-ee5fd2b9e7d2",
      name: "New Question",
      component: "question",
      parent: null,
      parentPage: "p1",
      type: "range",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
    },
    {
      id: "b923a381-44ee-4a31-b58d-c0f5c485b701",
      name: "New Question",
      component: "question",
      parent: null,
      type: "options",
      parentPage: "p1",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
    },
    {
      id: "s12",
      parent: null,
      component: "question",
      parentPage: "p1",
      name: "Hello world Last type",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
      isTitleDescriptionDisplayed: false,
    },
    {
      id: "p2",
      component: "page",
      parent: null,
      name: "Page 2",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
      isTitleDescriptionDisplayed: false,
    },
    {
      id: "s12",
      parent: null,
      component: "question",
      parentPage: "p2",
      type: "media",
      name: "Hello world Last type",
      isQuestionDisplayed: true,
      isSectionDisplayed: false,
      isTitleDescriptionDisplayed: false,
    },
  ];

  return (
    <div id="MobilePreview_container">
      {/* <ListItemButton onClick={handleClick} sx={{ PaddingLeft: '0px !important' }}>
        <ListItemText primary="Page 1 of 1" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Typography variant="h3" gutterBottom>
        Title Page
      </Typography>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ marginTop: '17px' }}>
          <div className="mobile_screen">
            {JSONData.map((item, index) => {
              return (
                <>
                  {item.component === 'page' ? (
                    <>This is a page</>
                  ) : item.component === 'section' ? (
                    <>This is a section</>
                  ) : (
                    <ReusableMobileComponent
                      label={item.name}
                      key={index}
                      children={
                        <>
                          {item.type === 'text' ? (
                            <MobileTextAnswer />
                          ) : item.type === 'range' ? (
                            <RangeSlider />
                          ) : item.type === 'multiple' ? (
                            <MultipleSelectMobile />
                          ) : item.type === 'single' ? (
                            <SingleSelectMobile />
                          ) : item.type === 'location' ? (
                            <MobileLocation />
                          ) : item.type === 'media' ? (
                            <MobileMedia />
                          ) : item.type === 'options' ? (
                            <MobileOptions />
                          ) : item.type === 'slider' ? (
                            <MobileSlider />
                          ) : (
                            ''
                          )}
                        </>
                      }
                    />
                  )}
                </>
              );
            })}
          </div>
        </List>
      </Collapse> */}

      {JSONData.map((item, index) => {
        return (
          <div key={index}>
            {item.component === "page" ? (
              <>
                <ListItemButton onClick={handleClick} sx={{ PaddingLeft: "0px !important" }}>
                  <ListItemText primary="Page 1 of 1" />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Typography variant="h3" gutterBottom>
                  {item.name}
                </Typography>
              </>
            ) : item.component === "section" ? (
              <>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ marginTop: "17px" }}>
                    <div className="mobile_screen">
                      {JSONData.map((item, index) => {
                        return (
                          <>
                            <ReusableMobileComponent
                              label={item.name}
                              key={index}
                              children={
                                <>
                                  {item.type === "text" ? (
                                    <MobileTextAnswer />
                                  ) : item.type === "range" ? (
                                    <RangeSlider />
                                  ) : item.type === "multiple" ? (
                                    <MultipleSelectMobile />
                                  ) : item.type === "single" ? (
                                    <SingleSelectMobile />
                                  ) : item.type === "location" ? (
                                    <MobileLocation />
                                  ) : item.type === "media" ? (
                                    <MobileMedia />
                                  ) : item.type === "options" ? (
                                    <MobileOptions />
                                  ) : item.type === "slider" ? (
                                    <MobileSlider />
                                  ) : (
                                    ""
                                  )}
                                </>
                              }
                            />
                          </>
                        );
                      })}

                      {/* <ReusableMobileComponent
                    label={'Booking ID'}
                    children={
                      <>
                        <MultipleSelectMobile />
                      </>
                    }
                  />

                  <ReusableMobileComponent
                    label={'Booking ID'}
                    children={
                      <>
                        <RangeSlider />
                      </>
                    }
                  />

                  <ReusableMobileComponent
                    label={'Booking ID'}
                    children={
                      <>
                        <MobileSlider />
                      </>
                    }
                  />
                  <ReusableMobileComponent
                    label={'Booking ID'}
                    children={
                      <>
                        <MobileTextAnswer />
                      </>
                    }
                  />
                  <ReusableMobileComponent
                    label={'Booking ID'}
                    children={
                      <>
                        <MobileLocation />
                      </>
                    }
                  />
                  <ReusableMobileComponent
                    label={'Booking ID'}
                    children={
                      <>
                        <MobileMedia />
                      </>
                    }
                  />
                  <ReusableMobileComponent
                    label={'Booking ID'}
                    children={
                      <>
                        <MobileOptions />
                      </>
                    }
                  />
                  <ReusableMobileComponent
                    label={'Booking ID'}
                    children={<><MobileDateTime /> </>}
                  />
                  <ReusableMobileComponent
                    label={'Booking ID'}
                    children={
                      <>
                        <SingleSelectMobile />
                      </>
                    }
                  /> */}

                      {/* <MobileTextAnswer />
                  <RangeSlider />
                  <MultipleSelectMobile />
                  <SingleSelectMobile />
                  <MobileLocation />
                  <MobileSlider />
                  <MobileTextAnswer />
                  <MobileMedia />
                  <MobileOptions />
                  <MobileTextAnswer />
                  <MobileDateTime />
                  <MobileTextAnswer /> */}
                    </div>
                  </List>
                </Collapse>
              </>
            ) : (
              <>Everything comes here </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MobileIndex;
