import React, {useState, useContext} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';
import AppContext from '../context/AppContext';

const Sidebar = props => {
  const appContext = useContext(AppContext);

  return(
    <div className="sidebar">
      <div className="logo-cont">
        <Link to="/"><img src={'/src/assets/img/logo-w.png'} 
          alt="UğurSoft Yönetim Paneli" /></Link>
      </div>
      <div className="sb-list">
        
        
        
      </div>

      <div className="btn-add-panel">
        <Link to="/Panel">Panel Ekle</Link>
        <Link to="/crudList">Liste ve Form</Link>
      </div>
    </div>
  )
}
export default Sidebar;

