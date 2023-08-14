import * as React from "react";
import { useEffect, useState } from "react";
import usePagination from "@mui/material/usePagination";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./pagination.scss";

const List = styled("div")({
  padding: 0,
  margin: 0,
  display: "flex",
  alignItems: "center",
});

type paginationProps = {
  pagination: {
    currentPage: number;
    pages: number;
    size: number;
    noOfPages: number;
    total: number;
    defaultPage?: number;
  };
  changePage: Function;
};

export default function UsePagination({ pagination, changePage }: paginationProps) {
  // changing the default page on tab change or api hit
  const [defaultPage, setDefaultPage] = useState(1);

  const { currentPage = 1, pages = 1, size = 9, noOfPages = 0, total = 0 } = pagination;

  // setting up for api
  const controller = new AbortController();
  const { signal } = controller;

  // creating no of pages from material ui usePagination hook
  const { items } = usePagination({
    count: noOfPages,
    page: defaultPage,
  });

  useEffect(() => {
    setDefaultPage(1);
  }, [total]);

  async function pageHandler(selected: number) {
    await changePage(signal, {
      page: selected,
      size: size,
    });
  }

  return (
    <nav className="pagination__container">
      <List>
        {items
          .slice(0, 1)
          .map(({ page, type, selected, onClick: defaultClick, ...item }, index) => {
            let children = null;

            children = (
              <button
                type="button"
                className="pagination__action-button"
                onClick={async (e) => {
                  defaultClick(e);
                  setDefaultPage(page ? page : 1);
                  pageHandler(page ? page : 1);
                }}
                {...item}
              >
                {type === "previous" ? <ArrowBackIcon /> : <></>} <p>{type}</p>
              </button>
            );

            return <div key={index}>{children}</div>;
          })}
        <div className="pagination__box">
          {items
            .slice(1, items.length - 1)
            .map(({ page, type, selected, onClick: defaultClick, ...item }, index) => {
              let children = null;

              if (type === "start-ellipsis" || type === "end-ellipsis") {
                children = <p className="pagination__button">…</p>;
              } else if (type === "page") {
                children = (
                  <button
                    type="button"
                    className={`pagination__button ${selected ? "active" : ""}`}
                    onClick={async (e) => {
                      defaultClick(e);
                      setDefaultPage(page ? page : 1);
                      pageHandler(page ? page : 1);
                    }}
                    {...item}
                  >
                    {page}
                  </button>
                );
              }
              return <div key={index}>{children}</div>;
            })}
        </div>
        {items
          .slice(items.length - 1, items.length)
          .map(({ page, type, selected, onClick: defaultClick, ...item }, index) => {
            let children = null;

            children = (
              <button
                type="button"
                className="pagination__action-button"
                onClick={async (e) => {
                  defaultClick(e);
                  setDefaultPage(page ? page : 1);
                  pageHandler(page ? page : 1);
                }}
                {...item}
              >
                <p>{type}</p>
                {<ArrowForwardIcon />}
              </button>
            );
            return <div key={index}>{children}</div>;
          })}
      </List>
    </nav>
  );
}
