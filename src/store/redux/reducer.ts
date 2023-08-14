import { combineReducers } from "redux";
import appState from "src/store/redux/app/reducers";


const rootReducer = combineReducers({
  // themeState,
  appState,
  
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
