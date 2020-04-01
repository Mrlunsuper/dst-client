import React,{useEffect, Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import PrivateRoute from './components/privateroute';
function App() {
  useEffect(() => {
    document.title = 'DDTMMT Sync Product';
   
  });
  return (
    <div className="App">
       <PrivateRoute />
    </div>
  );
}

export default App;
