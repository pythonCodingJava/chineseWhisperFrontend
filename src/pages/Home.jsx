import { React, useState } from "react";
import Navbar from "./components/Navbar";
import AccountTab from "./components/AccountTab";
import { Router, Routes, Route, BrowserRouter } from "react-router-dom";
import MainWindow from "./MainWindow";
import Login from "./Login";
import Register from "./Register";
import AddForum from "./addForum";
import ViewForum from "./ViewForum";

const Home = ({ token }) => {
  const [accountTab, setAccountTab] = useState(false);
  const [login, setLogin] = useState();

  return (
    <>
      <div style={{ position: "absolute", top: "65px", width: "100vw" }}>
        <Routes>
          <Route
            path="/"
            element={<MainWindow token={token.token}></MainWindow>}
          />
          <Route
            path="/add"
            element={
              <AddForum token={token.token} setLogin={setLogin} login={login} />
            }
          />
          <Route
            path="/forum/:postId"
            element={<ViewForum token={token.token} />}
          />
        </Routes>
      </div>

      {accountTab ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0px",
            left: "0px",
          }}
          onClick={function () {
            setAccountTab(false);
          }}
        ></div>
      ) : (
        <></>
      )}

      <Navbar
        token={token}
        login={login}
        setLogin={setLogin}
        tab={function () {
          setAccountTab(!accountTab);
        }}
      ></Navbar>

      <div style={{ position: "relative" }}>
        {accountTab ? (
          <>
            <AccountTab token={token} tab={setAccountTab} />
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Home;
