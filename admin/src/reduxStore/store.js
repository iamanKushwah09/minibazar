const storage = {
  getItem: (key) => {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem: (key, value) => {
    window.localStorage.setItem(key, value);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import dynamicDataReducer from "./slice/dynamicDataSlice";
import settingReducer from "./slice/settingSlice";
import { shippingApiSlice } from "./slice/shippingApiSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage: storage,
  whitelist: ["setting"], // Only persist settings, don't persist API cache
};

const rootReducer = combineReducers({
  setting: settingReducer,
  data: dynamicDataReducer,
  [shippingApiSlice.reducerPath]: shippingApiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const reduxStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(shippingApiSlice.middleware),
});

export default reduxStore;
