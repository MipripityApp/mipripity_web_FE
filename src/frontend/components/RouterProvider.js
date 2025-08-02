import React from 'react';
import { BrowserRouter } from 'react-router-dom';

/**
 * RouterProvider component
 * 
 * This component wraps its children with React Router's BrowserRouter
 * It's dynamically imported to ensure it only runs on the client side
 * since BrowserRouter uses browser-specific APIs
 */
const RouterProvider = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

export default RouterProvider;