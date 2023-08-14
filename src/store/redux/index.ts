import { Store, applyMiddleware, compose, legacy_createStore as createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
// import { createLogger } from 'redux-logger';

const initialStoreState = {};

export function initializeStore(defaultState = initialStoreState): Store {
  const middleware = [
    thunkMiddleware,
    // createLogger()
  ];

  const store = createStore(
    reducer,
    defaultState,
    composeWithDevTools
      ? composeWithDevTools(applyMiddleware(...middleware))
      : compose(applyMiddleware(...middleware)),
  );

  // our callback is fired everytime when the store is updated
  // subscribe is used to listen for changes to the store and react to them.
  store.subscribe(() => {
    // console.log("Redux store got updated");
  });

  return store;
}

export type IAppStore = ReturnType<typeof initializeStore>;
export const getStore = initializeStore;
