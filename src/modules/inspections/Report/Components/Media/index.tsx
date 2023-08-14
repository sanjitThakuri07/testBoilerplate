import { faAngleRight, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Collapse, Stack, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useCurrentLayout, useReportDataSets } from "containers/inspections/store/inspection";
import { validateInput } from "containers/template/validation/inputLogicCheck";
import { findData } from "containers/template/validation/keyValidationFunction";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Media({ pages, dataSetSeperator, mode = "web" }: any) {
  const [collapseActions, setCollapseActions] = React.useState<any>(true);

  const { initialState, setInitialState } = useReportDataSets();

  const dataSetSeperators = initialState?.fields?.reduce(
    (acc: any, curr: any) => {
      if (
        curr.component?.toLowerCase() !== "logic" &&
        curr.logicReferenceId === null &&
        curr.parent === null
      ) {
        acc.questionDataSet.push(curr);
      } else if (curr.component === "logic") {
        acc.logicDataSet.push(curr);
      } else if (curr.logicReferenceId || curr.parent) {
        acc.logicQuestion.push(curr);
      }
      return acc;
    },
    { logicDataSet: [], questionDataSet: [], logicQuestion: [] },
  );

  function dataNode({ dataSetSeperator, data, acc }: any) {
    const findLogic = dataSetSeperator.logicDataSet?.find(
      (datas: any) => data.logicId === datas.id,
    );
    if (!findLogic) return null;

    let trigger = {};

    const conditionQuestions = findLogic?.logics
      ?.map((logic: any, index: any) => {
        if (logic) {
          let datas = [];
          let conditionDataset = {
            condition: logic?.condition,
            trigger: logic?.trigger,
          };
          if (
            validateInput({
              operator: conditionDataset?.condition,
              userInput: data?.value,
              authorizedValues: Array.isArray(logic?.value) ? logic?.value : [logic?.value],
            })
          ) {
            trigger = logic?.trigger.reduce((acc: any, curr: any) => {
              if (curr?.name) {
                acc[`${curr.name?.toString()?.split(" ").join("_")}`] = curr.value;
              }
              return acc;
            }, {});
            datas = logic.linkQuestions.map((data: any) =>
              findData(dataSetSeperator.logicQuestion, data, "id"),
            );
          }
          return datas;
        } else {
          return;
        }
      })
      .flat();

    if (!conditionQuestions?.length) return;
    conditionQuestions?.map((data: any) => {
      const qnLogic = dataSetSeperator?.logicDataSet?.find((lg: any) => lg?.id === data?.logicId);

      if (data?.component === "question") {
        // do saving
        // recursive vall
        acc.filterQuestion.push(data);
        if (data?.type === "media") {
          data?.value?.[0]?.documents?.length && acc.medias.push(...data?.value?.[0]?.documents);
        }
        data?.media?.[0]?.documents?.length && acc.medias.push(...data?.media?.[0]?.documents);

        data?.action?.length && acc.actions.push(...data?.action);
        dataNode({ dataSetSeperator: dataSetSeperator, data: data, acc });
      } else if (data.component === "section") {
        dataSection({ dataSetSeperator: dataSetSeperator, data: data, acc });
      }
    });
  }

  function dataSection({ dataSetSeperator, data, acc }: any) {
    const findChildren = dataSetSeperator?.logicQuestion?.filter((item: any) => {
      return data?.id === item?.parent;
    });

    if (!findChildren?.length) return;
    findChildren?.map((child: any) => {
      if (child.component === "question") {
        acc.filterQuestion.push(child);
        // if(child?.type === 'media'){
        // child?.value?.[0]?.documents?.length && acc.medias.push(...child?.value?.[0]?.documents);
        // }
        child?.media?.[0]?.documents?.length && acc.medias.push(...child?.media?.[0]?.documents);
        child?.action?.length && acc.actions.push(...child?.action);

        dataNode({ dataSetSeperator: dataSetSeperator, data: child, acc });
      } else if (child.component === "section") {
        dataSection({ dataSetSeperator: dataSetSeperator, data: child, acc });
      }
    });
  }

  const mediaArray = [...dataSetSeperators?.questionDataSet, ...dataSetSeperators?.logicQuestion];
  // create a collection of media from active lists
  const datass = mediaArray?.reduce(
    (acc: any, curr: any) => {
      const foundLogic = dataSetSeperators?.logicDataSet?.find(
        (lg: any) => lg?.id === curr?.logicId,
      );
      if (curr?.component === "question") {
        if (curr?.type === "media") {
          curr?.value?.[0]?.documents?.length && acc.medias.push(...curr?.value?.[0]?.documents);
        }
        acc.filterQuestion.push(curr);
        curr?.media?.[0]?.documents?.length && acc.medias.push(...curr?.media?.[0]?.documents);
        curr?.action?.length && acc.actions.push(...curr?.action);

        dataNode({ dataSetSeperator: dataSetSeperators, data: curr, acc });
      } else if (curr.component === "section") {
        dataSection({ dataSetSeperator: dataSetSeperators, data: curr, acc });
      }
      return acc;
    },
    { flaggedQuestions: [], medias: [], actions: [], filterQuestion: [] },
  );
  console.log(datass?.medias);
  if (mode === "pdf") {
    return (
      <Box>
        <Box className="box-container-pdf">
          <Box
            sx={{ fontWeight: 500 }}
            className="pdf_label"
            display={"flex"}
            justifyContent="space-between"
          >
            <span>Media Summary</span>
            <div className="counting_highlight">{datass?.medias?.length}</div>
          </Box>
          <RenderMedia data={datass} mode="mode" />
        </Box>
      </Box>
    );
  }
  return (
    <Box className="overview_layout_container">
      <Box display={"flex"} width={"100%"} justifyContent="space-between">
        <Stack direction="row" justifyContent="center" alignItems={"center"} spacing={2}>
          <Box onClick={() => setCollapseActions(!collapseActions)} className="overview_button">
            <FontAwesomeIcon
              icon={faAngleRight}
              className={`${collapseActions && "rotate_arrow_down"} rotate_arrow_straight`}
            />
          </Box>

          <Typography fontSize={18} fontWeight={500} sx={{ select: "none" }}>
            Media
          </Typography>
        </Stack>
        <div className="counting_highlight">{datass?.medias?.length}</div>
      </Box>
      {/* collapse items */}
      <Collapse in={collapseActions} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
        <RenderMedia data={datass} />
      </Collapse>
    </Box>
  );
}

const mediaTypes = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"],
};

interface ImageGridProps {
  imageData: {
    url: string;
    size: "small" | "medium" | "large";
  }[];
  fromQN?: boolean;
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  imageContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  smallImage: {
    height: "150px",
    objectFit: "contain",
  },
  mediumImage: {
    height: "300px",
  },
  largeImage: {
    height: "450px",
  },
});

const ImageGrid: React.FC<ImageGridProps> = ({ imageData, fromQN = false }) => {
  const classes = useStyles();

  return (
    <div>
      <div
        style={{
          maxWidth: "1000px",
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          columnGap: 10,
          rowGap: 0,
        }}
      >
        {imageData.map((image, index) => (
          <div key={index} style={{ width: 150, height: 150 }}>
            <img
              className={
                fromQN || image?.size === "small"
                  ? classes.smallImage
                  : image?.size === "medium"
                  ? classes.mediumImage
                  : classes.largeImage
              }
              src={`${process.env.VITE_HOST_URL}/${image?.url}`}
              alt="Photos"
              style={{
                objectFit: "contain",
                width: 150,
                height: 150,
              }}
            />
          </div>
        ))}
      </div>
    </div>

    // orignal: changed by firoj
    // <div className={classes.root}>
    //   <Grid container spacing={2} padding="10px 10px">
    //     {imageData.map((image: any, index: number) => (
    //       <Grid
    //         item
    //         xs={12}
    //         sm={6}
    //         md={fromQN || image?.size === 'small' ? 4 : 12}
    //         key={index}
    //         sx={{ paddingLeft: fromQN ? '7px !important' : '16px' }}>
    //         <Card>
    //           <div className={classes.imageContainer}>
    //             <CardMedia
    //               component="img"
    //               src={`${process.env.VITE_HOST_URL}/${image?.url}`}
    //               alt="Image"
    //               className={
    //                 fromQN || image?.size === 'small'
    //                   ? classes.smallImage
    //                   : image?.size === 'medium'
    //                   ? classes.mediumImage
    //                   : classes.largeImage
    //               }
    //               sx={{
    //                 objectFit: 'contain',
    //               }}
    //             />
    //           </div>
    //         </Card>
    //       </Grid>
    //     ))}
    //   </Grid>
    // </div>
  );
};

export const RenderMedia = ({ data, mode, fromQN = false }: any) => {
  const { currentReportLayout } = useCurrentLayout();
  // const [dummyLayout, setDummyLayout] = React.useState([
  //   { rows: 0, cols: 0 },
  //   { rows: 0, cols: 0 },
  //   { rows: 0, cols: 0 },
  //   { rows: 0, cols: 0 },
  // ]);
  const [imgs, setImgs] = React.useState([]);

  const images: JSX.Element[] = [];
  const otherFiles: JSX.Element[] = [];
  if (Array.isArray(data?.medias)) {
    data?.medias?.forEach((v: any) => {
      const fileType = v?.split("/").pop()?.split(".").pop();

      if (fileType && mediaTypes.image.includes(`.${fileType}`)) {
        // File type is an image
        images.push(v);
      } else {
        // File type is not an image
        otherFiles.push(v);
      }
    });
  }
  if (data?.type === "media" && Array.isArray(data?.value)) {
    data?.value?.[0]?.documents?.forEach((v: any) => {
      const fileType = v?.split("/").pop()?.split(".").pop();

      if (fileType && mediaTypes.image.includes(`.${fileType}`)) {
        // File type is an image
        images.push(v);
      } else {
        // File type is not an image
        otherFiles.push(v);
      }
    });
  }

  useEffect(() => {
    setImgs((prev): any => {
      const updatedData = images.map((item: any, index: any) => {
        if (currentReportLayout?.media_thumbnail === "small") {
          return { url: item, size: "small" };
        } else if (currentReportLayout?.media_thumbnail === "medium") {
          return { url: item, size: "medium" };
        } else if (currentReportLayout?.media_thumbnail === "large") {
          return { url: item, size: "large" };
        } else {
          return { url: item, size: "small" };
        }
      });

      return updatedData;
    });
  }, [currentReportLayout?.media_thumbnail]);
  return (
    <Box>
      {/* <div className="small__size_gallery">{images}</div> */}
      {/* <Box p={2}>
        <ImageList
          sx={{ width: '100%', height: '100%' }}
          variant="quilted"
          cols={4}
          rowHeight={121}>
          {dummyLayout?.map((item: any, index: number) => {
            return (
              <ImageListItem key={index} cols={item.cols || 1} rows={item.rows || 1}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // height: '100%',
                    // width: '100%',
                    background: '#EEEEEE',
                    borderRadius: '10px',
                  }}>
                  <img
                    src={`${process.env.VITE_HOST_URL}/${item?.item}`}
                    alt="not_found"
                    // style={{
                    //   display: 'flex',
                    //   alignItems: 'center',
                    //   justifyContent: 'center',
                    // }}
                  />
                </div>
              </ImageListItem>
            );
          })}
        </ImageList>
      </Box> */}
      {/* <Grid container spacing={2}>
        {images.map((imageUrl, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                src={`${process.env.VITE_HOST_URL}/${imageUrl}`}
                alt="Image"
              />
            </Card>
          </Grid>
        ))}
      </Grid> */}
      <ImageGrid imageData={imgs} fromQN={fromQN} />

      {otherFiles?.map((other: any) => (
        <Box
          margin={fromQN ? "16px 0 0 0" : "16px 0"}
          padding={fromQN ? "0" : "16px 10px"}
          borderRadius="6px"
          boxShadow={
            mode === "pdf" && !fromQN
              ? "rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px"
              : ""
          }
        >
          {" "}
          <Box display={"flex"} alignItems={"center"} gap="10px">
            <FontAwesomeIcon icon={faFileLines} />
            <Link to={`${process.env.VITE_HOST_URL}/${other}`}>{other?.split("/").pop()}</Link>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
