// NotFound.jsx (or 404Page.jsx)
import React from 'react';
import './NotFound.css'; // Import the CSS file

const NotFound = () => {
  return (
    // Added a unique ID to the main container div
    <div id="not-found-page">
      <div className="container">
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <p>It might have been moved or deleted.</p>
        {/* Use a routing library Link component if available (e.g., react-router-dom) */}
        {/* <Link to="/">Go back to the homepage</Link> */}
        {/* Or a standard anchor tag */}
        <a href="/">Go back to the homepage</a>
      </div>
    </div>
  );
};

export default NotFound;