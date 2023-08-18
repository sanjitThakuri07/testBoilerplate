import { Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { MobileIndex, MobilePreview, StarterTemplate } from "./components";
// import { NavbarTab, RightSection } from './layout';
import CustomBottomNavigation from "src/modules/template/container/layout/bottombar";
import Sidebar from "src/modules/template/container/layout/sidebar";
import TemplateTopbar from "src/modules/template/container/layout/topbar";
import { useFormik } from "formik";
import { TemplateCreationFields } from "interfaces/templates/templateFields";
import { FormikFormHelpers } from "src/interfaces/utils";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTemplateFieldsStore } from "src/store/zustand/templates/templateFieldsStore";
import BlockingModal from "src/components/BlockingModal";

const RenderComponent = ({
  formikBags,
  isViewOnly,
  templateHeadingRef,
  setInitialTemplate,
  handleSubmit,
  collapseSideBar,
  setCollapseSidebar,
}: any) => {
  return (
    <>
      <>
        <TemplateTopbar formikBag={formikBags} />

        <main className={`template__body-container ${collapseSideBar ? "collapse" : ""}`}>
          <aside className="template__sidebar">
            <Sidebar setCollapseSidebar={setCollapseSidebar} />
            <button
              type="button"
              className="collapse__btn"
              onClick={(e: any) => {
                setCollapseSidebar((prev: any) => !prev);
              }}
            >
              <ArrowForwardIosIcon />
            </button>
          </aside>

          <section>
            <form
              className={`profile-form  ${isViewOnly ? "edit-mode" : ""}`}
              onSubmit={(e: any) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <StarterTemplate
                formikBags={formikBags}
                ref={templateHeadingRef}
                setInitialTemplate={setInitialTemplate}
              >
                {" "}
              </StarterTemplate>
            </form>
          </section>
          {/* for testing purposes */}
          {/* <MobilePreview
                  children={
                    <div style={{ position: 'fixed', left: '0', top: '0' }}>
                      <MobileIndex />
                    </div>
                  }
                /> */}
          {/* <Grid item xs={3} className="right__fixed-template-layout">
          <RightSection />
        </Grid> */}
        </main>
      </>
    </>
  );
};

const Template = () => {
  const [initialTemplate, setInitialTemplate] = React.useState<TemplateCreationFields>({
    name: "",
    desc: "Form description (optional)",
    id: 1,
    question: "This is my question",
  });
  const [isViewOnly, setIsViewOnly] = React.useState(false);
  const [activePage, setActivePage] = React.useState("Form");
  const templateHeadingRef = useRef<any>(null);

  const handleFormSubmit = async (values: any) => {};

  const { templateDatasets } = useTemplateFieldsStore();
  console.log({ templateDatasets });

  const formikBags = useFormik({
    initialValues: initialTemplate,
    onSubmit: handleFormSubmit,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Template name is a required field"),
    }),
    enableReinitialize: true,
  });
  const { handleSubmit, isValid, dirty, touched, resetForm, errors, values } = formikBags;

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const formikHelpers: FormikFormHelpers = {
    isValid,
    dirty,
    touched: Object.values(touched).length > 0,
  };

  const handleViewOnly = () => {
    setIsViewOnly(!isViewOnly);
    resetForm();
  };

  // useEffect(() => {
  //   if (location.search.includes('mobile-preview')) {
  //     setActivePage('small-screen');
  //   } else {
  //     setActivePage('Form');
  //   }
  // }, [location.search]);
  const [collapseSideBar, setCollapseSidebar] = React.useState(false);

  const [showModal, setShowModal] = useState(false);

  // do not remove this code
  // const handleBeforeUnload = (e: any) => {
  //   e.preventDefault();
  //   const message = 'Are you sure you want to leave? All provided data will be lost.';
  //   e.returnValue = message;
  //   return message;
  // };

  // useEffect(() => {
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  const handleConfirm = () => {
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const navigate = useNavigate();
  // const [showPrompt, setShowPrompt] = useState(false);

  // useEffect(() => {
  //   const handleBeforeUnload = (event: any) => {
  //     if (showPrompt) {
  //       event.preventDefault();
  //       event.returnValue = '';
  //     }
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [showPrompt]);

  // const handleNavigation = (confirmed: any) => {
  //   console.log('where am i ?');
  //   if (confirmed) {
  //     setShowPrompt(false);
  //     navigate(location.pathname);
  //   } else {
  //     setShowPrompt(true);
  //   }
  // };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div id="template">
          <button
            ref={templateHeadingRef}
            style={{ display: "none" }}
            onClick={() => {
              handleSubmit();
            }}
          ></button>
          <RenderComponent
            formikBags={formikBags}
            isViewOnly={isViewOnly}
            templateHeadingRef={templateHeadingRef}
            setInitialTemplate={setInitialTemplate}
            handleSubmit={handleSubmit}
            collapseSideBar={collapseSideBar}
            setCollapseSidebar={setCollapseSidebar}
          />
        </div>

        {/* <BlockingModal
          when={showPrompt}
          message="Are you sure you want to leave this page?"
          navigate={handleNavigation}
        /> */}
      </DndProvider>
    </div>
  );
};

export default Template;
