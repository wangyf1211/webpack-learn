'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './css/search.css';
import './css/global.css';
import logo from './img/logo.png'

class Search extends React.Component {
  render () {
    return <div> Hello webpack react test HMR
      <img src={logo} alt="logo" />
    </div>;
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);