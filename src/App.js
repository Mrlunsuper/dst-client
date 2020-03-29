import React,{useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import Product from './components/product';
function App() {
  useEffect(() => {
    document.title = 'DDTMMT Sync Product';
  });

  return (
    <div className="App container-fluid">
      <header className="App-header">
        <Product />
      </header>
    </div>
  );
}

export default App;
