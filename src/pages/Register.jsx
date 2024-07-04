import { React, useState, useEffect, useRef } from "react";
import {useTransition,animated} from 'react-spring';
import { Link, redirect, Navigate } from "react-router-dom";
import "../styles/Register.css";
import {styled} from 'styled-components';
import { Box, Button, Typography } from "@mui/material";
import { register } from "../utils/apiRoutes";
import { Field, linkStyle, boxstyle } from "../styles/formComponents.jsx";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

const Diiv = styled.div`
  transition: opacity 0.5s;
  opacity: ${(props) => (props.$a ? "1" : "0")};
`;

function Register({ func , login}) {
  const [inputs, setInputs] = useState({
    Username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [valid, setValid] = useState({
    pass: false,
    uname: false,
    emailExist: false,
    emailValid: false,
    redirect: false,
  });

  const refContainer = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [appear, setAppear] = useState(false);
  const [visible, setVisible] = useState();
  
  var transition;

  transition = useTransition(visible, {
    from: {
      height: 0,
      y: dimensions.height,
      x: dimensions.height,
      width: 0,
      opacity: 0,
    },
    enter: (item) => async (next) => {
      await next({
        height: dimensions.height,
        y: 0,
        x: dimensions.height,
        width: 0,
        opacity: 1,
      });
      await next({
        height: ref2.current.offsetHeight,
        x: dimensions.height - ref3.current.offsetHeight,
        width: ref3.current.offsetHeight,
        opacity: 1,
      });
      setAppear(!appear);
      await next({ opacity: 1 });
    },
    config: {
      mass:1, tension:700, friction:50
    },
  });
  
  useEffect(() => {
    if (refContainer.current && dimensions.width == 0) {
      setDimensions({
        width: refContainer.current.offsetWidth,
        height: refContainer.current.offsetHeight,
      });
    } else {
      setVisible(true);
    }

  }, [dimensions]);


  const handleChange = (value) => {
    const name = value.target.name;
    const val = value.target.value;
    if (name == "confirm") {
      if (val != inputs["password"]) setInvalidity("pass", true);
      else setInvalidity("pass", false);
    }
    if (name == "Username" && valid["uname"]) {
      setInvalidity("uname", false);
    }
    if (name == "email" && valid["emailExist"]) {
      setInvalidity("emailExist", false);
    }
    setInputs((values) => ({ ...values, [name]: val }));
  };

  const setInvalidity = function (name, val) {
    setValid((i) => ({ ...i, [name]: val }));
  };

  const handleSubmit = () => {
    const data = {
      Username: inputs["Username"],
      Password: inputs["password"],
      email: inputs["email"],
    };
    if (inputs["password"] === inputs["confirm"]) {
      fetch(register, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.status == "ui") {
            setInvalidity("uname", true);
          }
          if (json.status == "ei") {
            setInvalidity("emailExist", true);
          }
          if (json.status == "ee") {
            setInvalidity("emailValid", true);
            setInvalidity("emailExist", true);
          }
          if (json.status == "success") {
            func(false);
          }
        });
    }
  };

  return (
    <>
    {transition
      ? transition((style, item) =>
          item ? (
            <>
              <animated.div
                className="box"
                style={{
                  height: dimensions.height,
                  width: dimensions.width,
                }}
              >
                <animated.div
                  className="appear"
                  style={{
                    width: dimensions.width,
                    height: style.height,
                    top: style.y,
                    borderRadius: "20px 20px 8px 8px",
                  }}
                />
                <animated.div
                  className="appear"
                  style={{
                    width: dimensions.width,
                    height: style.width,
                    top: style.x,
                    borderRadius: "8px 8px 20px 20px",
                  }}
                />
              </animated.div>
            </>
          ) : (
            <></>
          )
        )
      : "hi"}

      <Diiv className="box" $a={appear} ref={refContainer}>
        <HighlightOffRoundedIcon onClick={login} sx={{position:'absolute', top:'2%', right:'2%',color:'rgb(90,90,90)', '&:hover':{cursor:'pointer'}}} fontSize="large"/>
        
        <Box sx={boxstyle} ref={ref2}>
          <Typography
            variant="h3"
            align="center"
            sx={{ color: "rgb(200,200,200)", fontWeight:700, marginBottom: "20px" }}
          >
            REGISTER
          </Typography>
          <Field
            type="textbox"
            name="Username"
            value={inputs["Username"]}
            onChange={handleChange}
            label="Username"
            error={valid["uname"]}
            helperText={valid["uname"] ? "Username already exists" : ""}
          />
          1
          <Field
            type="textbox"
            name="email"
            value={inputs["email"]}
            onChange={handleChange}
            label="Student ID"
            error={valid["emailExist"]}
            helperText={
              valid["emailExist"]
                ? valid["emailValid"]
                  ? "Account with this address already exists"
                  : "Invalid Student ID"
                : ""
            }
          />
          1
          <Field
            type="password"
            name="password"
            value={inputs["password"]}
            onChange={handleChange}
            error={valid["pass"]}
            label="Password"
          />
          1
          <Field
            type="password"
            name="confirm"
            value={inputs["confirm"]}
            onChange={handleChange}
            label="Confirm Password"
            error={valid["pass"]}
            sx={{ marginBottom: "0px" }}
            helperText={valid["pass"] ? "Passwords don't match" : ""}
          />
          1
          <Button
            type="submit"
            variant="contained"
            sx={{ my: "10px", height: "45px", width: "100%" }}
            onClick={handleSubmit}
          >
            SIGN UP
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            bgcolor: "rgb(35,35,35)",
            p: 3,
            color: "rgba(255,255,255,0.4)",
            width: "inherit",
            marginTop: "30px",
            borderRadius:"8px 8px 20px 20px"
          }}
          ref={ref3}
        >
          <span id="text">
            Already have an account?
            <Typography
              display="inline"
              onClick={function () {
                func(false);
              }}
              sx={{ "&:hover": { cursor: "pointer" } }}
              style={linkStyle}
            >
              Sign in
            </Typography>
          </span>
        </Box>
      </Diiv>
    </>
  );
}

export default Register;
