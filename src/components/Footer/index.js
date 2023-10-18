


import React from 'react';
import ReactDOM from 'react-dom';
let year = new Date().getFullYear();
const Footer=()=>
{
  return <footer class="main_footer">
  <div class="container">
     <p>Domaintobe Social © {year} All rights reserved</p>
  </div>
  </footer>;
}
 
export default Footer;