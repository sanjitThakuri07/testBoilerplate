import { Suspense } from "react";
import { ConnectedProps, connect } from "react-redux";
import { Loader } from "src/components/Spinner/Spinner";
import AppRoutes from "src/routes";
import { fetchMe, setSidebar } from "src/store/redux/app/actions";
import { AppState } from "src/store/redux/reducer";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

function App({ me }: PropsFromRedux) {
  return (
    <Suspense fallback={<Loader />}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={1500}
      >
        <AppRoutes />
      </SnackbarProvider>
    </Suspense>
  );
}

const mapStateToProps = ({ appState: { me, isLoading } }: AppState) => ({
  me,
  isLoading,
});

const mapDispatchToProps = { fetchMe, setSidebar };
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
