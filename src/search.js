'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import './css/search.css';

class Search extends React.Component {
  render () {
    return <div> Hello webpack react test HMR</div>;
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);