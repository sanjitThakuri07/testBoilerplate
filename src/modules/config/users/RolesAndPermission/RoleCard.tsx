import ConfirmationModal from "src/components/ConfirmationModal/ConfirmationModal";
import { Button, Card, Grid, Typography } from "@mui/material";
import { UserRolesProps } from "src/src/interfaces/configs";
import { FC, useState } from "react";
import { useParams } from "react-router-dom";
import { lockFields } from "src/utils/url";

const RoleCard: FC<
  UserRolesProps & {
    handleDeleteRole: (id?: number) => void;
    editRole: (id?: number) => void;
    navigate: (id?: number) => void;
  }
> = ({ name, id, permissions, status, handleDeleteRole, editRole, navigate }: any) => {
  // const isActive = Number(status) === 1;
  const isActive = status === "Active" ? true : false;
  const { roleID } = useParams();
  const isCurrentRole = Number(roleID) === Number(id);
  const [openModal, setOpenModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  return (
    <div className="region-card">
      <ConfirmationModal
        openModal={openModal}
        setOpenModal={() => setOpenModal(!openModal)}
        handelConfirmation={() => {
          handleDeleteRole(id);
        }}
        confirmationHeading={`Do you want to delete role ${name}?`}
        confirmationDesc={`This ${name} role will be deleted`}
        status="warning"
        confirmationIcon="src/assets/icons/icon-feature.svg"
        loader={deleteLoading}
      />

      <Card variant="outlined" style={{ backgroundColor: isCurrentRole ? "#ccc" : "" }}>
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
          </Grid>
          <Grid item xs={3}>
            <div className="actions-btns-holder">
              <Button
                startIcon={<img src="/src/assets/icons/icon-edit.svg" alt="edit" />}
                onClick={() => {
                  editRole(id);
                  navigate(id);
                }}
              />
              {!lockFields.includes(name) && (
                <Button
                  startIcon={<img src="/src/assets/icons/icon-trash.svg" alt="delete" />}
                  onClick={() => {
                    setOpenModal(true);
                  }}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default RoleCard;
