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
  
  if(!isAuthenticated) return <Navigate to={redirect}/>  

  if((isAuthenticated && adminRoute) && !isAdmin) return <Navigate to={redirect}/>;
  
  return children ? children : <Outlet/>    
  
}

export default ProtectedRoute