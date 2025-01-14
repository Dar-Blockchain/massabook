import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import MassaInitializer from "./components/MassaInitializer";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <MassaInitializer>
          <ToastContainer />
          <App />
        </MassaInitializer>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
