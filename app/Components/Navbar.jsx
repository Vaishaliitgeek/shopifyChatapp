import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  

  return (
    <nav className="navbar">
      <div className="logo">My Shopify App</div>
      <ul className="nav-links">
      <li>
          <Link to="/app/chatbox">Chat</Link>
        </li>
        <li>
          <Link to="/app/dbProduct">Products</Link>
        </li>
       
        <li>
          <Link to="/app/order">Orders</Link>
        </li>
       
        <li> <Link to="/app/discountmain">Discount</Link></li>
        <li>
          <Link to="/app/giftCard">Gift Card</Link>
        </li>
       
      </ul>
    </nav>
  );
};

export default Navbar;

