import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PgDetails from './pages/PgDetails';
import PGs from './pages/PGs';
import Mybookings from './pages/Mybookings';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Footer from './components/Footer';
import Dashboard from './pages/owner/Dashboard';
import AddPg from './pages/owner/AddPg';
import ManagePgs from './pages/owner/ManagePgs';
import ManageBookings from './pages/owner/ManageBookings';
import Layout from './pages/owner/Layout';
import Login from './pages/Login';
import {Toaster} from 'react-hot-toast'
import { useAppContext } from '../context/useAppContext';
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const {showLogin} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')
  return (
    <>
    <Toaster/>
    {showLogin &&  <Login  />}
   
    {!isOwnerPath && <Navbar />}
    
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/pg-details/:id' element={<PgDetails/>} />
      <Route path='/pgs' element={<PGs/>} />
      <Route path='/my-bookings' element={<Mybookings/>} />
      
      <Route path='/owner' element={<Layout/>} >
          <Route index element={<Dashboard/>} />
         <Route path='dashboard' element={<Dashboard/>}/>
         <Route path='add-pg' element={<AddPg/>} />
         <Route path='manage-pg' element={<ManagePgs/>} />
         <Route path='manage-bookings' element={<ManageBookings/>} />
    </Route>
    
    </Routes>

  <Footer/>
    
    </>
  )
}

export default App