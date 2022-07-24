import { createContext, useReducer } from "react";
import "../styles/globals.css";

const StoreContext = createContext();
const ACTION_TYPES = {
  SET_LAG_LONG: "SET_LAG_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};
const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_COFFEE_STORES:
      return { ...state, coffeeStores: action.payload.coffeeStores };
    case ACTION_TYPES.SET_LAG_LONG:
      return { ...state, latLong: action.payload.latLong };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    coffeeStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
