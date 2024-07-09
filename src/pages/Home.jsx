import { React, useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import AccountTab from "./components/AccountTab";
import { Routes, Route } from "react-router-dom";
import MainWindow from "./MainWindow";
import AddForum from "./addForum";
import ViewForum from "./ViewForum";
import { content } from "../utils/apiRoutes";
import Notification from "./components/Notification";
import { socket } from "../socket";
import { Typography, useMediaQuery } from "@mui/material";

const Home = ({ token }) => {
  const [accountTab, setAccountTab] = useState(false);
  const [notifTab, setNotifTab] = useState(false);
  const [login, setLogin] = useState();

  const [retrieve, setRetrieve] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);
  const initRender = useRef(false);

  const [notifications, setNotifications] = useState(new Map());
  const order = useRef(new Array());
  const [likeNotif, setLikeNotif] = useState(false);
  const [cmtNotif, setCmtNotif] = useState(false);

  const matches = useMediaQuery("(min-width:500px)");

  const [updateToken, setUpdateToken] = useState({ index: -1, item: {} });

  useEffect(() => {
    order.current = [];
    if (token.token)
      token.token.notifications.forEach((item, index) => {
        order.current.push(item.id);
        setNotifications(notifications.set(item.id, item));
      });
    setLikeNotif((v) => !v);
  }, [token.token == null]);

  useEffect(()=>{
    const item = updateToken.item;
    const index = updateToken.index;
    if(token.token && initRender.current){
      token.setToken((prev)=>{
        let temp = prev;
        if(index!=-1)temp.notifications.splice(index,1);
        temp.notifications.unshift(item);
        return temp;
      })
      sessionStorage.setItem('chineseWhisperToken',JSON.stringify(token.token))
    }
  },[updateToken])

  useEffect(() => {
    if (!initRender.current) {
      socket.on("notify", function (arg) {
        if (arg.type == "like") setLikeNotif((v) => !v);
        else setCmtNotif((v) => !v);

        let index = -1;
        if (order.current.includes(arg.id)) {
          index = order.current.indexOf(arg.id);
          order.current.splice(index, 1);
        }

        order.current.unshift(arg.id);

        setNotifications(notifications.set(arg.id, arg));

        setUpdateToken({ index: index, item: arg });
      });
    }
  }, []);

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

    if (initRender.current || window.location.pathname == "/") {
      setLoading(true);
      retrieved();
    }
    if(!initRender.current){
      initRender.current = true;
    }
  }, [retrieve]);

  return (
    <>
      <div style={{ position: "absolute", top: "58px", width: "100%" }}>
        <Routes>
          <Route
            path="/"
            element={<MainWindow data={data} setData={setData} token={token.token}></MainWindow>}
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

      {accountTab || notifTab ? (
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
            setNotifTab(false);
          }}
        ></div>
      ) : (
        <></>
      )}

      <Navbar
        token={token}
        login={login}
        cmtNotif={cmtNotif}
        likeNotif={likeNotif}
        setLogin={setLogin}
        tab={function () {
          setAccountTab((v) => !v);
          setNotifTab(false);
        }}
        notifTab={() => {
          setNotifTab((v) => !v);
          setAccountTab(false);
        }}
        setRetrieve={setRetrieve}
        loading={loading}
      ></Navbar>

      <div style={{ position: "relative" }}>
        {accountTab && (
          <AccountTab token={token} setAccountTab={setAccountTab} />
        )}
        {notifTab && (
          <>
            <Notification
              setTab={setNotifTab}
              order={order}
              notifications={notifications}
            />
            <div
              style={{
                backgroundColor: "rgb(50,55,60)",
                width: "350px",
                borderRadius: "8px 8px 20px 20px",
                position: "fixed",
                right: matches ? "55px" : "50vw",
                transform: `translate(${matches ? "0" : "50%"},0)`,
                top: "461px",
              }}
            >
              <Typography
                sx={{
                  color: "rgb(220,230,240,0.7)",
                  fontSize: "12px",
                  m: "3px",
                  textAlign: "center",
                }}
              >
                Notifications stay for 3 days after which they are removed
              </Typography>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
