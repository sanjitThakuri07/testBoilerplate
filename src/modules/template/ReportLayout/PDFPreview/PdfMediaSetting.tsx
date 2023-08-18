import React, { useEffect } from "react";
import { Box, ImageList, ImageListItem } from "@mui/material";
import NoImageFoundIcon from "src/assets/icons/no_image_found_icon.svg";

export default function PdfMediaSetting({ has_media_summary, media_thumbnail }: any) {
  // for image datasets
  //   const [imgDataSets, setImgDataSets] = React.useState([
  //     {
  //       img: "",
  //       title: "",
  //       rows: 0,
  //       cols: 0,
  //     },
  //     {
  //       img: "",
  //       title: "",
  //       rows: 0,
  //       cols: 0,
  //     },

  //     {
  //       img: "",
  //       title: "",
  //       rows: 0,
  //       cols: 0,
  //     },
  //     {
  //       img: "",
  //       title: "",
  //       rows: 0,
  //       cols: 0,
  //     },
  //   ]);

  //   for image data sets
  //   function srcset(image: string, size: number, rows = 1, cols = 1) {
  //     return {
  //       src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
  //       srcSet: `${image}?w=${size * cols}&h=${
  //         size * rows
  //       }&fit=crop&auto=format&dpr=2 2x`,
  //     };
  //   }

  const [dummyLayout, setDummyLayout] = React.useState([
    { rows: 0, cols: 0 },
    { rows: 0, cols: 0 },
    { rows: 0, cols: 0 },
    { rows: 0, cols: 0 },
  ]);

  useEffect(() => {
    setDummyLayout((prev: any) => {
      const updatedData = prev.map((item: any, index: any) => {
        if (media_thumbnail === "small") {
          if (index % 2 !== 0) {
            return { ...item, rows: 0, cols: 2 };
          } else {
            return { ...item, rows: 2, cols: 2 };
          }
        } else if (media_thumbnail === "medium") {
          return { ...item, rows: 1, cols: 4 };
        } else if (media_thumbnail === "large") {
          return { ...item, rows: 4, cols: 4 };
        }
      });

      return updatedData;
    });
  }, [media_thumbnail]);

  return (
    <Box mt={2}>
      {has_media_summary && (
        <Box className="box-container-pdf">
          <Box sx={{ fontWeight: 500 }} className="pdf_label">
            Media Summary
          </Box>

          <Box px={2}>
            <ImageList
              sx={{ width: "100%", height: "100%" }}
              variant="quilted"
              cols={4}
              rowHeight={121}
            >
              {dummyLayout?.map((item: any, index: number) => {
                return (
                  <ImageListItem key={index} cols={item?.cols || 1} rows={item?.rows || 1}>
                    {/* <img
                      {...srcset(item.img, 121, item.rows, item.cols)}
                      alt={"not_found"}
                      loading="lazy"
                      style={{ borderRadius: "10px" }}
                    /> */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                        background: "#EEEEEE",
                        borderRadius: "10px",
                      }}
                    >
                      <img
                        src={NoImageFoundIcon}
                        alt="not_found"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </div>
                  </ImageListItem>
                );
              })}
            </ImageList>
          </Box>
        </Box>
      )}
    </Box>
  );
}
