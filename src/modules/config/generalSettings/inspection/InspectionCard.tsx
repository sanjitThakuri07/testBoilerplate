import { Button, Card, Grid, Typography } from "@mui/material";
import { RegionProps } from "src/interfaces/configs";
import { FC } from "react";

const InspectionCard: FC<
  RegionProps & {
    handleDeleteRegion: (id?: number) => void;
    editRegion: (id?: number) => void;
  }
> = ({ name, notification_email, id, status, handleDeleteRegion, editRegion }) => {
  const isActive = Number(status) === 1;
  return (
    <div className="region-card">
      <Card variant="outlined">
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={9}>
            <Typography variant="h5" component="h5">
              {name}{" "}
              <img
                src={`/assets/icons/${isActive ? "active" : "disable"}-polygon.svg`}
                alt="online"
                title={isActive ? "active" : "disable"}
              />
            </Typography>
            <Typography variant="body2" component="p">
              {notification_email}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <div className="actions-btns-holder">
              <Button
                startIcon={<img src="src/assets/icons/icon-edit.svg" alt="edit" />}
                onClick={() => editRegion(id)}
              />
              <Button
                startIcon={<img src="src/assets/icons/icon-trash.svg" alt="delete" />}
                onClick={() => handleDeleteRegion(id)}
              />
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default InspectionCard;
