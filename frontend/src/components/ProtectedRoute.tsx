import React, { ReactElement } from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import Loader from './Loader';

interface Props {
  isAuthenticated?: boolean;
  children?: ReactElement;
  adminRoute?: boolean;
  isAdmin?: boolean;
  redirect?: string;
}

function ProtectedRoute({isAuthenticated, children, adminRoute, isAdmin, redirect = "/"}: Props) {
  console.log("protected route isAuthenticated>>> ", isAuthenticated);

  if(!isAuthenticated){
  return (
  <Navigate to={redirect}/>
  );
  }else{
    return (children ? children : <Outlet/>    )
  }
  
}

export default ProtectedRoute