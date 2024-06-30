import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Home from './pages/Home.jsx';

function App() {
  const [token, useToken] = useState();
  
  useEffect(()=>{
    var storedToken = sessionStorage.getItem("chineseWhisperToken");
    if(storedToken) useToken(JSON.parse(storedToken));
    console.log(JSON.parse(storedToken))
  },[])

  return(
    <BrowserRouter>
      <Home token={{token:token, setToken:useToken}}></Home>
    </BrowserRouter>
  )
}

export default App
