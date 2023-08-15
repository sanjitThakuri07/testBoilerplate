import React, { useEffect, useState } from "react";
import MobileTextAnswer from "./MobileTextAnswer/MobileTextAnswer";
import MobileOptions from "./MobileOptions/MobileOptions";
import MobileSlider, { RangeSlider } from "./MobileSlider/MobileSlider";
import { useTemplate } from "src/store/zustand/globalStates/templates/templateData";
import { useTemplateFieldsStore } from "src/modules/template/store/templateFieldsStore";
import responseItems from "constants/template/responseItems";
import NoteIcon from "src/assets/template/mobileIcons/notes.png";
import MediaIcon from "src/assets/template/mobileIcons/media.png";
import ActionIcon from "src/assets/template/mobileIcons/action.png";
import { Formik, FieldArray, Field, Form } from "formik";

import MobileDateTime from "./MobileDateTime/MobileDateTime";
import MobileInspectionDate from "./MobileInspectionDate/MobileInspectionDate";
import ReusableMobileComponent from "./ReusableMobileComponent/ReusableMobileComponent";
import { fetchApI } from "src/modules/apiRequest/apiRequest";
import useDebounceSearch from "hooks/useDebounceSearch";
import SelectInternalResponse from "./SelectInternalResponse";
import SelectMultipleResponse from "./SelectMultipleResponse";
import MobileNumber from "./MobileNumber";
import MobileSpeechRecognition from "./MobileSpeechRecognition/MobileSpeechRecognition";
import MobileLocation from "./MobileLocation/MobileLocation";
import MobileTemperature from "./MobileTemperature/mobileTemperature";
import MobileSignature from "./MobileSignature";
import MobileInstruction from "./MobileInstruction";
interface MobilePreviewProps {
  children?: React.ReactNode;
}

const Lists = ({ innerList, templateDatasets }: any) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      {innerList?.component === "section" && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: "0.5rem 0.1rem",
            background: "steelblue",
            color: "white",
          }}
        >
          {innerList?.label}
        </div>
      )}
      {innerList?.component === "question" && innerList?.response_choice === "default" && (
        <div>
          <div className="mobile_component_box">
            <div className="mobile_component_box_wrapper">
              <div className="mobile_component_box_wrapper_heading">
                {innerList.label}

                {responseItems.find((option: any) => option.id === innerList.response_type)
                  ?.type === "text" ? (
                  <MobileTextAnswer />
                ) : responseItems.find((option: any) => option.id === innerList.response_type)
                    ?.type === "date" ? (
                  responseItems.find((option: any) => option.id === innerList.response_type)?.id ===
                  "INSPECT_001" ? (
                    <MobileInspectionDate item={innerList} />
                  ) : responseItems.find((option: any) => option.id === innerList.response_type)
                      ?.id === "DATE_001" ? (
                    <MobileDateTime item={innerList} />
                  ) : (
                    ""
                  )
                ) : responseItems.find((option: any) => option.id === innerList.response_type)
                    ?.type === "number" ? (
                  <MobileOptions />
                ) : responseItems.find((option: any) => option.id === innerList.response_type)
                    ?.type === "range" ? (
                  <MobileSlider dataItem={innerList} />
                ) : responseItems.find((option: any) => option.id === innerList.response_type)
                    ?.type === "speech_recognition" ? (
                  <MobileSpeechRecognition dataItem={innerList} />
                ) : (
                  ""
                )}

                <div className="mobile_component_box_wrapper_footer">
                  <div className="footer_item" onClick={() => {}}>
                    <div className="footer_item_icon">
                      <img src={NoteIcon} alt="" />
                    </div>
                    <div className="footer_item_text">Notes</div>
                  </div>
                  {/* ---Next Item */}
                  <div className="footer_item" onClick={() => {}}>
                    <div className="footer_item_icon">
                      <img src={MediaIcon} alt="" />
                    </div>
                    <div className="footer_item_text">Media</div>
                  </div>
                  {/* ---Next Item */}
                  <div className="footer_item" onClick={() => {}}>
                    <div className="footer_item_icon">
                      <img src={ActionIcon} alt="" />
                    </div>
                    <div className="footer_item_text">Action</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isOpen
        ? templateDatasets
            .filter(
              (dset: any) =>
                dset.parent === innerList?.id &&
                dset.component === "question" &&
                dset?.response_choice === "default",
            )
            ?.map((inList: any) => (
              //    <Lists inList={inList}/>
              // <div>{inList.label}</div>
              <div>
                <div className="mobile_component_box">
                  <div className="mobile_component_box_wrapper">
                    <div className="mobile_component_box_wrapper_heading">
                      {inList.label}
                      {responseItems.find((option: any) => option.id === inList.response_type)
                        ?.type === "text" ? (
                        <MobileTextAnswer />
                      ) : responseItems.find((option: any) => option.id === inList.response_type)
                          ?.type === "date" ? (
                        responseItems.find((option: any) => option.id === inList.response_type)
                          ?.id === "INSPECT_001" ? (
                          <MobileInspectionDate item={inList} />
                        ) : responseItems.find(
                            (option: any) => option.id === innerList.response_type,
                          )?.id === "DATE_001" ? (
                          <MobileDateTime item={inList} />
                        ) : (
                          ""
                        )
                      ) : responseItems.find((option: any) => option.id === inList.response_type)
                          ?.type === "number" ? (
                        <MobileOptions />
                      ) : responseItems.find((option: any) => option.id === inList.response_type)
                          ?.type === "range" ? (
                        <MobileSlider dataItem={inList} />
                      ) : responseItems.find((option: any) => option.id === inList.response_type)
                          ?.type === "speech_recognition" ? (
                        <MobileSpeechRecognition dataItem={inList} />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
        : ""}
    </div>
  );
};

const MobileIndex = ({ children }: MobilePreviewProps) => {
  const { templateDatasets, setTemplateDatasets } = useTemplateFieldsStore();
  const {} = useTemplate();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  const [internalResponseData, setInternalResponseData] = React.useState<any>([]);
  const [searchInternalResponse, setSearchInternalResponse] = React.useState<string>("");

  const InternalSearchResponse = useDebounceSearch(searchInternalResponse, 1000);

  const handleSearchInternalResponse = async () => {
    await fetchApI({
      setterFunction: setInternalResponseData,
      url: `internal-response/?q=${InternalSearchResponse}&page=1&size=50`,
    });
  };

  useEffect(() => {
    handleSearchInternalResponse();
  }, [InternalSearchResponse]);

  return (
    <div id="MobilePreview_container">
      <Formik
        enableReinitialize={true}
        initialValues={{
          datasets: templateDatasets,
        }}
        onSubmit={(values) => {
          setTemplateDatasets(values.datasets);
          // setTemplateDatasets(values)
        }}
      >
        {({ values, setFieldValue }) => {
          // console.log(values);
          return (
            <Form>
              <>
                <FieldArray name="persons">
                  {({ push, remove, insert }: any) => (
                    <>
                      {values.datasets.map((data: any, index: any) => {
                        return (
                          <>
                            {data.component === "question" ? (
                              <ReusableMobileComponent
                                item={data}
                                label={""}
                                children={
                                  <>
                                    {data?.response_choice === "internal" && (
                                      <SelectInternalResponse
                                        item={data}
                                        apiItem={
                                          internalResponseData.length &&
                                          internalResponseData.find(
                                            (responseData: any) =>
                                              responseData.id === data.response_type,
                                          )
                                        }
                                      />
                                    )}
                                    {(data?.response_choice === "multiple" ||
                                      data?.response_choice === "global") && (
                                      <SelectMultipleResponse item={data} />
                                    )}

                                    {data?.response_choice === "default" ? (
                                      responseItems.find(
                                        (option: any) => option.id === data.response_type,
                                      )?.type === "text" ? (
                                        <MobileTextAnswer
                                          item={data}
                                          value={values.datasets?.[index]?.value}
                                          onChange={(e: any) =>
                                            setFieldValue(`datasets.${index}.value`, e.target.value)
                                          }
                                        />
                                      ) : responseItems.find(
                                          (option: any) => option.id === data.response_type,
                                        )?.type === "date" ? (
                                        responseItems.find(
                                          (option: any) => option.id === data.response_type,
                                        )?.id === "INSPECT_001" ? (
                                          <MobileInspectionDate item={data} />
                                        ) : responseItems.find(
                                            (option: any) => option.id === data.response_type,
                                          )?.id === "DATE_001" ? (
                                          <MobileDateTime item={data} />
                                        ) : (
                                          ""
                                        )
                                      ) : responseItems.find(
                                          (option: any) => option.id === data.response_type,
                                        )?.type === "range" ? (
                                        <MobileSlider item={data} />
                                      ) : responseItems.find(
                                          (option: any) => option.id === data.response_type,
                                        )?.type === "number" ? (
                                        <MobileNumber
                                          item={data}
                                          value={values.datasets?.[index]?.value}
                                          onChange={(e: any) =>
                                            setFieldValue(`datasets.${index}.value`, e.target.value)
                                          }
                                        />
                                      ) : responseItems.find(
                                          (option: any) => option.id === data.response_type,
                                        )?.type === "speech_recognition" ? (
                                        <MobileSpeechRecognition dataItem={data} />
                                      ) : responseItems.find(
                                          (option: any) => option.id === data.response_type,
                                        )?.type === "location" ? (
                                        <MobileLocation />
                                      ) : responseItems.find(
                                          (option: any) => option.id === data.response_type,
                                        )?.type === "temp" ? (
                                        <MobileTemperature />
                                      ) : responseItems.find(
                                          (option: any) => option.id === data.response_type,
                                        )?.type === "instruction" ? (
                                        <MobileInstruction
                                          item={data}
                                          // value={values.datasets?.[index]?.value}
                                          // onChange={(e: any) =>
                                          //   setFieldValue(`datasets.${index}.value`, e.target.value)
                                          // }
                                        />
                                      ) : responseItems.find(
                                          (option: any) => option.id === data.response_type,
                                        )?.type === "signature" ? (
                                        <MobileSignature
                                          item={data}
                                          // value={values.datasets?.[index]?.value}
                                          // onChange={(e: any) =>
                                          //   setFieldValue(`datasets.${index}.value`, e.target.value)
                                          // }
                                        />
                                      ) : (
                                        // <MobileNumber />
                                        ""
                                      )
                                    ) : (
                                      ""
                                    )}

                                    {/* <div className="mobile_component_box_wrapper_footer">
                                      <div className="footer_item" onClick={() => {}}>
                                        <div className="footer_item_icon">
                                          <img src={NoteIcon} alt="" />
                                        </div>
                                        <div className="footer_item_text">
                                          Notes
                                        </div>
                                      </div>
                                      <div className="footer_item" onClick={() => {}}>
                                        <div className="footer_item_icon">
                                          <img src={MediaIcon} alt="" />
                                        </div>
                                        <div className="footer_item_text">
                                          Media
                                        </div>
                                      </div>
                                      <div className="footer_item" onClick={() => {}}>
                                        <div className="footer_item_icon">
                                          <img src={ActionIcon} alt="" />
                                        </div>
                                        <div className="footer_item_text">
                                          Action
                                        </div>
                                      </div>
                                    </div> */}
                                  </>
                                }
                              />
                            ) : (
                              // <div key={index}>
                              //   <div>{person.label}</div>
                              //   <input
                              //     value={values.datasets?.[index]?.value}
                              //     onChange={(e) =>
                              //       setFieldValue(`datasets.${index}.value`, e.target.value)
                              //     }
                              //   />
                              //   {/* <Field name={`persons.${index}.value`} /> */}
                              //   <div className="mobile_component_box_wrapper_footer">
                              //     <div className="footer_item" onClick={() => {}}>
                              //       <div className="footer_item_icon">
                              //         <img src={NoteIcon} alt="" />
                              //       </div>
                              //       <div className="footer_item_text">Notes</div>
                              //     </div>
                              //     {/* ---Next Item */}
                              //     <div className="footer_item" onClick={() => {}}>
                              //       <div className="footer_item_icon">
                              //         <img src={MediaIcon} alt="" />
                              //       </div>
                              //       <div className="footer_item_text">Media</div>
                              //     </div>
                              //     {/* ---Next Item */}
                              //     <div className="footer_item" onClick={() => {}}>
                              //       <div className="footer_item_icon">
                              //         <img src={ActionIcon} alt="" />
                              //       </div>
                              //       <div className="footer_item_text">Action</div>
                              //     </div>
                              //   </div>
                              // </div>
                              ""
                              // <div className="mobile_component_box">
                              //   <div className="mobile_component_box_wrapper">
                              //     <div className="mobile_component_box_wrapper_heading">
                              //       {data.label}
                              //     </div>
                              //   </div>
                              // </div>
                            )}
                          </>
                        );
                      })}
                    </>
                  )}
                </FieldArray>
              </>
              <button type="submit">Sumbit</button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MobileIndex;
