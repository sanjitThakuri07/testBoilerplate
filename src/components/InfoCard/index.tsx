import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CustomBadgeCreator from "components/CustomBadgeCreator/index";
import { RadioOptions } from "src/utils/FindingsUtils";

const useStyles = makeStyles(() => ({
  card: {
    border: `1px solid #EAECF0`,
    borderRadius: "12px !important",
    boxShadow: "none !important",
    minHeight: "8rem",
    minWidth: "12rem",
  },
  badge: {
    marginRight: "10px",
  },

  title: {
    color: "#384874",
    fontSize: "2rem",
  },
}));

const Index = ({
  title,
  subtitle,
  badgeContent = { value: "", status: "Medium" },
  customClassName = "",
}: {
  title: string;
  subtitle: string;
  badgeContent?: any;
  customClassName?: string;
}) => {
  const classes = useStyles();

  return (
    <Card className={`${classes.card} ${customClassName ? customClassName : ""}`}>
      <CardContent>
        <Typography variant="subtitle1">{subtitle}</Typography>
        <Typography variant="h5" className={classes?.title}>
          {title}
        </Typography>
      </CardContent>
      <CardContent sx={{ paddingTop: "0", paddingBottom: "0" }}>
        <Divider />
      </CardContent>
      <CardContent>
        <CustomBadgeCreator styleChoice={badgeContent?.status} value={badgeContent?.value} />
      </CardContent>
    </Card>
  );
};

export const ActivityAnalyticCard = ({ title, count }: { title: string; count: any }) => {
  const classes = useStyles();

  return (
    <Card
      sx={{
        minHeight: 0,
        padding: 1.5,
        marginRight: 1,
        marginBottom: 1,
      }}
      className={`${classes.card}`}
    >
      <Box>
        <div
          style={{
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            background: "transparent",
            padding: "8px 12px",
            paddingLeft: "30px",
            borderRadius: "20px",
            position: "relative",
            // color: '#000',
            color:
              title === ("Done" || "Completed")
                ? RadioOptions?.Completed?.textColor
                : RadioOptions?.default?.textColor,
            // border: '1px solid #bdbdbd',
          }}
          className="badge__creator"
        >
          <span
            style={{
              background:
                title === ("Done" || "Completed")
                  ? RadioOptions?.Completed?.dotColor
                  : RadioOptions?.default?.dotColor,
              // background: color_code === '#FFFFFF' ? '#b0adad' : color_code || 'red',
            }}
          ></span>

          <Typography sx={{ marginLeft: "1ch" }}>{title}</Typography>
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          height: 80,
        }}
      >
        <Typography style={{ width: "fit-content" }} variant="h6" className={classes?.title}>
          {count}
        </Typography>
      </Box>
    </Card>
  );
};
export default Index;
