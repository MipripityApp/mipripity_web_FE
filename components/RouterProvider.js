import React from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * RouterProvider component
 *
 * This component wraps its children with React Router's BrowserRouter.
 * It's configured for production use with the Render server.
 */

const RouterProvider = ({ children }) => {
  return (
    <BrowserRouter basename="/">
      {children}
    </BrowserRouter>
  );
};

export default RouterProvider;
    