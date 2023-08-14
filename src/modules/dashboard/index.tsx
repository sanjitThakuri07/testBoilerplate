import { ConnectedProps, connect } from "react-redux";
import Table from "src/components/Table";
import sampleData from "src/components/Table/sampleData";
import { AppState } from "src/store/redux/reducer";
import { useReactTheme } from "src/theme/custom/ReactThemeProvider";
import muiStyled from "src/theme/mui/styled";
import styled from "src/theme/styled-component/styled";
import classes from "./index.module.css";

// import Layout from 'src/layouts/common/Index';

const MuiDiv = muiStyled("div")(({ theme }) => ({
  backgroundColor: theme?.palette?.primary?.main,
  color: theme?.palette?.primary?.contrastText,
  width: 300,
  fontWeight: 600,
}));
const StyledSpan = styled.span`
  color: ${({ theme }) => theme?.palette?.primary?.contrastText};
  background-color: ${({ theme }) => theme?.palette?.primary?.main};
  border-color: ${(props) => props.theme.palette.primary.light};
  width: 300;
`;

function Index({ me }: PropsFromRedux) {
  const { theme, switchTheme, toggleLightDarkTheme } = useReactTheme();
  return (
    <div>
      <p className={classes.testColor}>Test color</p>
      <MuiDiv>Welcome to Vite Development Server.</MuiDiv>
      <img src="vite.svg" alt="webpack-logo" style={{ width: 300, height: "auto" }} />

      <p>
        <input
          type="checkbox"
          // checked={theme?.themeName === "dark"}
          onChange={toggleLightDarkTheme}
          // onChange={() => (mode === "light" ? setMode("dark") : setMode("light"))}
        />
        <StyledSpan>Use Dark Theme</StyledSpan>
      </p>
      <button onClick={() => switchTheme("brand")}>Apply Brand Theme </button>
      <Table headers={sampleData.headers} items={sampleData.items} exclude={sampleData.exclude} />
    </div>
  );
}

const mapStateToProps = ({ appState: { me } }: AppState) => ({
  me,
});

const mapDispatchToProps = {};
type PropsFromRedux = ConnectedProps<typeof connector>;

const connector = connect(mapStateToProps, mapDispatchToProps);
const Dashboard = connector(Index);
export default Dashboard;
