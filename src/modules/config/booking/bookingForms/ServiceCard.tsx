import { Button, Card, Grid, Typography } from "@mui/material";
import { commonTypeProps } from "src/interfaces/configs";
import { FC } from "react";
import { useLocation } from "react-router-dom";

const ServiceCard: FC<
  commonTypeProps & {
    handleDeleteService: (id?: number) => void;
    editService: (id?: number) => void;
    navigate: (id?: number) => void;
    setAddAnother: Function;
  }
> = ({ name, id, status, handleDeleteService, editService, navigate, setAddAnother }) => {
  // const isActive = Number(status) === 1;
  const location = useLocation();
  const isActive = status === "Active" ? true : false;
  let check =
    location.pathname.includes("general-status") &&
    ["Completed", "In Progress", "Cancelled", "Invoiced"]?.includes(name || "");
  return (
    <div className="region-card">
      <Card variant="outlined">
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={9}>
            <Typography variant="h5" component="h5">
              {name}{" "}
              <img
                src={`/src/assets/icons/${isActive ? "active" : "disable"}-polygon.svg`}
                alt="online"
                title={isActive ? "active" : "disable"}
              />
            </Typography>
            {/* <Typography variant="body2" component="p">
              {notification_email}
            </Typography> */}
          </Grid>
          <Grid item xs={3}>
            <div className="actions-btns-holder">
              <Button
                startIcon={<img src="/src/assets/icons/icon-edit.svg" alt="edit" />}
                onClick={() => {
                  editService(id);
                  navigate(id);
                  setAddAnother?.(false);
                }}
              />
              {check ? (
                <></>
              ) : (
                <Button
                  startIcon={<img src="/src/assets/icons/icon-trash.svg" alt="delete" />}
                  onClick={() => handleDeleteService(id)}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default ServiceCard;
