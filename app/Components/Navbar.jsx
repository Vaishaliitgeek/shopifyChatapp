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
        
        {/* <li>
          <Link to="/app/dbProduct">Your Product</Link>
        </li> */}
        <li>
          <Link to="/app/order">Orders</Link>
        </li>
       
        <li> <Link to="/app/discountmain">Discount</Link></li>
        <li>
          <Link to="/app/giftCard">Gift Card</Link>
        </li>
        {/* <li className="dropdown">
          <select className="nav-dropdown" onChange={handleDiscountChange} defaultValue="">
            <option value="" disabled>Discount</option>
            <option value="/app/discount">Amount OFF Order</option>
            <option value="/app/ProdDiscount">Amount OFF Products</option>
            <option value="/app/BuyXgetYdiscount">Buy X get Y</option>
            <option value="/app/freeshipDiscount">Free Shipping</option>

          </select>
        </li> */}
        {/* <li>
          <Link to="/app/flow">Flow</Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default Navbar;

