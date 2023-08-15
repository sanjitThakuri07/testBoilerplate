import { Button, Card, Grid, Typography } from "@mui/material";
import { RegionProps } from "interfaces/configs";
import { useLocation } from "react-router-dom";
import { FC } from "react";

const RegionCard: FC<
  RegionProps & {
    handleDeleteRegion: (id?: number, fieldKey?: string) => void;
    editRegion: (id?: number) => void;
    navigate: (id?: number) => void;
    fieldKey?: string;
  }
> = ({
  name,
  notification_email,
  id,
  status,
  handleDeleteRegion,
  editRegion,
  navigate,
  fieldKey,
}) => {
  // const isActive = Number(status) === 1;
  const isActive = status === "Active" ? true : false;
  const location = useLocation();
  let check =
    location.pathname.includes("inspection-status") &&
    ["Completed", "In Progress", "Open"]?.includes(name);

  return (
    <div className="region-card">
      <Card variant="outlined">
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={9}>
            <Typography variant="h5" component="h5">
              {name}
              <img
                src={`/assets/icons/${isActive ? "active" : "disable"}-polygon.svg`}
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
                startIcon={<img src="src/assets/icons/icon-edit.svg" alt="edit" />}
                onClick={() => {
                  // console.log('clicked', { id });
                  editRegion(id);
                  navigate(id);
                }}
              />

              {check ? (
                <></>
              ) : (
                <Button
                  startIcon={<img src="src/assets/icons/icon-trash.svg" alt="delete" />}
                  onClick={() => handleDeleteRegion(id, fieldKey)}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default RegionCard;
