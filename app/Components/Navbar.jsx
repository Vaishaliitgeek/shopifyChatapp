import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">My Shopify App</div>
      <ul className="nav-links">
        <li>
          {/* <Link >Home</Link> */}
        </li>
        <li>
          <Link to="/app/allProduct">Products</Link>
        </li>
        <li>
          <Link to="/app/chatbox">Chat</Link>
        </li>
        <li>
          <Link to="/app/dbProduct">Your Product</Link>
        </li>
        <li>
          <Link to="/app/order">Orders</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

