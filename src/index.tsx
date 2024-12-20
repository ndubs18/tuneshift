import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import ErrorPage from "./pages/Error-page";
import Playlists from "./pages/Playlists";
import Transferring from "./pages/Transferring";
import Results from "./pages/Results";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "transfer",
        element: <Playlists />,
        errorElement: <ErrorPage />,
      },
      {
        path: "transferring",
        element: <Transferring />,
        errorElement: <ErrorPage />,
      },
      {
        path: "results",
        element: <Results />,
        errorElement: <ErrorPage />
      }
    ]
  }
])
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(<RouterProvider router={router} />);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
