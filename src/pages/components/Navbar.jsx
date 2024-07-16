import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import styled from "styled-components";
import Add from "@mui/icons-material/Add";
import Account from "./Account";
import { Link, Navigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import Favorite from "@mui/icons-material/Favorite";
import ModeComment from "@mui/icons-material/ModeComment";

const Login = lazy(() => import("../Login"));
const Register = lazy(() => import("../Register"));

const Diiv = styled.div`
  transition: opacity 0.5s;
  opacity: ${(props) => (props.$a ? 1 : 0)};
`;

function Navbar({
  tab,
  token,
  login,
  loading,
  notifTab,
  setRetrieve,
  setLogin,
  likeNotif,
  cmtNotif,
}) {
  const [appear, setAppear] = useState();
  const [register, setRegister] = useState();
  const [redirect, setRedirect] = useState(false);
  const matches = useMediaQuery("(min-width:850px)");
  const ref = useRef(null);

  const [appearLike, setAppearLike] = useState(false);
  const [appearCmt, setAppearCmt] = useState(false);
  const initRender = useRef();

  useEffect(() => {
    let timeoutId;
    if (initRender.current) {
      setAppearLike(true);
      timeoutId = setTimeout(() => {
        setAppearLike(false);
      }, 2000);
    }

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [likeNotif]);

  useEffect(() => {
    let timeoutId;
    if (initRender.current) {
      setAppearCmt(true);
      timeoutId = setTimeout(() => {
        setAppearCmt(false);
      }, 2000);
    } else {
      initRender.current = true;
    }
    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [cmtNotif]);

  useEffect(() => {
    if (loading) {
      setRedirect(true);
      ref.current.continuousStart();
    } else {
      ref.current.complete();
    }
  }, [loading]);

  useEffect(() => {
    setRedirect(false);
  }, [redirect]);

  useEffect(() => {
    setAppear(login);
  }, [login]);

  return (
    <div
      style={{ position: "fixed", width: "100vw", backgroundColor: "#0E1113" }}
    >
      <LoadingBar color="rgb(200,50,50)" ref={ref} />
      {redirect && <Navigate to="/" />}
      <Box
        sx={{
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          color: "white",
        }}
      >
        <Box
          style={{ textDecoration: "none", marginRight: "auto" }}
          sx={{ "&:hover": { cursor: "pointer" } }}
          onClick={function () {
            setRetrieve((v) => !v);
          }}
        >
          <div
            style={{
              marginLeft: "15px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                float: "left",
                color: "white",
                width: "40px",
                backgroundColor: "rgb(200,50,50)",
                padding: "10px 8px",
                textAlign: "center",
                fontWeight: "900",
                fontSize: "18px",
                marginLeft: "5px",
                borderRadius: "50%",
              }}
            >
              中文
            </div>
            <Typography
              style={{
                fontSize: "30px",
                marginLeft: "10px",
                color: "rgb(215,218,220)",
                fontWeight: "600",
              }}
            >
              {matches ? "whisper" : ""}
            </Typography>
          </div>
        </Box>

        {/* <TextField
          placeholder="Search"
          sx={{ maxWidth: "650px", width: "100%", px: "20px" }}
          InputProps={{
            style: {
              margin: "10px",
              height: "40px",
              borderRadius: "24px",
              border: "none",
              backgroundColor: "rgb(30,35,40)",
              color: "white",
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "white" }} />
              </InputAdornment>
            ),
          }}
        /> */}
        {!token.token ? (
          <Button
            onClick={function () {
              setLogin(true);
            }}
            sx={{
              marginLeft: "auto",
              marginRight: "10px",
              float: "right",
              width: "125px",
              bgcolor: "rgb(200,50,50)",
              px: "10px",
              color: "white",
              borderRadius: "20px",
            }}
          >
            Sign in
          </Button>
        ) : (
          <>
            <Link
              to="/add"
              style={{ textDecoration: "none", marginLeft: "auto" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: "10px",
                  bgcolor: "rgb(20,25,30)",
                  borderRadius: "25px",
                  marginRight: "10px",
                  color: "rgb(220,225,230)",
                  height: "40px",
                  "&:hover": { bgcolor: "rgb(40,45,50)", cursor: "pointer" },
                }}
              >
                <Add sx={{ width: "30px", height: "30px" }} />
                <Typography sx={{ paddingRight: "10px" }}>Create</Typography>
              </Box>
            </Link>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {appearLike && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "30px",
                    bgcolor: "rgb(200,50,50)",
                    borderRadius: "5px",
                    p: "25px 8px 3px 8px",
                    zIndex: 1,
                  }}
                  className="anim"
                >
                  <Favorite />
                </Box>
              )}
              {appearCmt && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "30px",
                    bgcolor: "rgb(50,150,200)",
                    borderRadius: "5px",
                    p: "25px 8px 3px 8px",
                    zIndex: 1,
                  }}
                  className="anim"
                >
                  <ModeComment />
                </Box>
              )}

              <Box
                sx={{
                  bgcolor: "rgb(20,25,30)",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    bgcolor: "rgb(40,45,50)",
                    cursor: "pointer",
                  },
                  zIndex: 2,
                }}
                onClick={notifTab}
              >
                <NotificationsIcon />
              </Box>
            </div>
            <div style={{ marginRight: "15px" }}>
              <Account onClick={tab} token={token.token} />
            </div>
          </>
        )}
      </Box>
      <div
        style={{
          width: "100vw",
          height: "2px",
          backgroundColor: "rgb(80,81,82)",
        }}
      />

      {login ? (
        <Diiv
          $a={appear}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.65)",
          }}
        />
      ) : (
        <></>
      )}

      {register ? (
        <Suspense>
          <Register
            func={setRegister}
            login={() => {
              setRegister(false);
              setLogin(false);
            }}
          />
        </Suspense>
      ) : login ? (
        <Suspense>
          <Login
            func={token.setToken}
            log={function () {
              setLogin(false);
            }}
            register={setRegister}
          />
        </Suspense>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Navbar;
