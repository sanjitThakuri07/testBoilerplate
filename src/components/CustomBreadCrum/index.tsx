import { Box, Breadcrumbs, Typography } from "@mui/material";
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const location = useLocation();

  return items?.length ? (
    <div className="custom__breadcrum-container">
      <Typography className="back__to">Back To: </Typography>
      <Box id="my__own-breadcrumb">
        {items.map((item, index) => {
          const isCurrentPage = location.pathname === item.path;
          const isLastItem = index === items.length - 1;

          const listItemClasses = ["breadcrumb-item"];
          if (isCurrentPage) {
            listItemClasses.push("active");
          }

          return (
            <Breadcrumbs aria-label="breadcrumb" className="custom__breeadcrum-findings">
              <Link to={item.path}>{item.label}</Link>
            </Breadcrumbs>
          );
        })}
      </Box>
    </div>
  ) : (
    <></>
  );
};

export default Breadcrumb;
