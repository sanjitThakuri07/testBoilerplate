import Skeleton from "@mui/material/Skeleton";
import { Card, CardContent, CardHeader, Divider } from "@mui/material";
import { Stack } from "@mui/system";

const CardSkeletonLoader = () => {
  return (
    <Card
      className="skeleton_card_container"
      sx={{
        maxWidth: 500,
        width: "100%",
      }}
    >
      <CardHeader
        avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
        title={<Skeleton animation="wave" height={20} width="80%" style={{ marginBottom: 6 }} />}
        subheader={<Skeleton animation="wave" height={15} width="40%" />}
      />
      <Stack direction="row" spacing={2} sx={{ padding: "10px 20px" }} alignItems="center">
        <Skeleton animation="wave" height={15} width="30%" />
        <Skeleton animation="wave" height={15} width="30%" />
      </Stack>
      <Divider />
      <CardContent>
        <Skeleton animation="wave" height={15} width="80%" />
      </CardContent>
    </Card>
  );
};

export default CardSkeletonLoader;
