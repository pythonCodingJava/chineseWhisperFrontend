import { React, useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import AccountTab from "./components/AccountTab";
import { Router, Routes, Route, BrowserRouter } from "react-router-dom";
import MainWindow from "./MainWindow";
import Login from "./Login";
import Register from "./Register";
import AddForum from "./addForum";
import ViewForum from "./ViewForum";
import { content } from "../utils/apiRoutes";

const Home = ({ token }) => {
  const [accountTab, setAccountTab] = useState(false);
  const [login, setLogin] = useState();

  const [retrieve, setRetrieve] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const initRender = useRef(false);

  useEffect(() => {
    const retrieved = async () => {
      let body = { date: new Date(), type: 1 };
      if (data[0]) body = { date: data[0].createdAt, type: -1 };
      const dat = await fetch(content, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        setLoading(false);
        return res.json();
      });
      if (!data[0]) setData([...dat.data]);
      else {
        dat.data.pop();
        setData([...dat.data, ...data]);
      }
    };
    if (initRender.current || window.location.pathname=='/') {
      setLoading(true);
      console.log('retrieving')
      retrieved();
    }else {
      initRender.current = true;
    }
  }, [retrieve]);

  return (
    <>
      <div style={{ position: "absolute", top: "65px", width: "100%" }}>
        <Routes>
          <Route
            path="/"
            element={<MainWindow data={data} token={token.token}></MainWindow>}
          />
          <Route
            path="/add"
            element={
              <AddForum
                token={token.token}
                setRetrieve={setRetrieve}
                setLogin={setLogin}
                login={login}
              />
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
        setRetrieve={setRetrieve}
        loading={loading}
      ></Navbar>

      <div style={{ position: "relative" }}>
        {accountTab ? (
          <>
            <AccountTab token={token} setAccountTab={setAccountTab} />
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Home;
