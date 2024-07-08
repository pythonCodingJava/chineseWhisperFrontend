import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home.jsx";
import { socket } from "./socket.js";

function App() {
  const [token, useToken] = useState();

  useEffect(() => {
    var storedToken = sessionStorage.getItem("chineseWhisperToken");
    if (storedToken) {
      const data = JSON.parse(storedToken);
      socket.emit("login", data.id);
      useToken(data);
    }
  }, []);

  return (
    <BrowserRouter>
      <Home token={{ token: token, setToken: useToken }}></Home>
    </BrowserRouter>
  );
}

export default App;
