import React from 'react';
import {
    BiHome, 
    BiBookAlt, 
    BiMessage, 
    BiSolisReport, 
    Bistats, 
    BiTask,
    BiHelpCirle, 
} from 'react-icons/bi';

import './sidebar.css';

const Sidebar = () => {
  return <div className='menu'>
    <div className="logo">
        <BiBookAlt className="logo-icon" />
        <h2>RedOven</h2>
    </div>

    <div className="menu-list">
        <a href="#" className="item">
            <BiHome className="icon" />
            Assignment
        </a>
        <a href="#" className="item">
            <BiSolisReport className="icon" />
            Report
        </a>
        <a href="#" className="item">
            <BiMessage className="icon" />
            Message
        </a>
        <a href="#" className="item">
            <BiHelpCirle className="icon" />
            Help
        </a>
    </div>
  </div>
};

export default Sidebar;