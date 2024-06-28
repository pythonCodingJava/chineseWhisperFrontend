import React, {useEffect, useState} from "react";
import { TextareaAutosize, Button, Typography } from "@mui/material";
import {createURL} from '../utils/apiRoutes';
import {Navigate} from 'react-router-dom';

function AddForum({token, setLogin, login}) {
    const [inputs, setInputs] = useState({
        title:"",
        body:""
    });
    const [redirect, setRedirect] = useState(false);

    const handleChange = (value)=>{
        const name = value.target.name;
        const val = value.target.value;
        setInputs((v)=> ({...v,[name]:val}))
    }

    useEffect(()=>{
      if(!token)setLogin(true);
    }, [login])

    const handleSubmit = () => {
      const data = {
        title:inputs['title'],
        body:inputs['body'],
        date:new Date(),
        createdBy:token.Username
      }
      fetch(createURL, {
        method:"POST",
        body:JSON.stringify(data),
        headers:{
          "Content-Type":"application/json"
        }
      }).then((res)=>{
        if(res.status == 201){
          setRedirect(true);
        }
      })
    }

  return (
    <div
      style={{
        borderRadius: "20px",
        padding: "25px",
        position: "absolute",
        left: "50%",
        transform: "translate(-50%,0%)",
      }}
    >
      {redirect? <Navigate to="/" />:<></>}
      <Typography variant="h3" sx={{ color: "rgb(225,230,235)", m: "10px" }}>
        Create Post
      </Typography>

      <TextareaAutosize
        style={{
          backgroundColor: "rgba(40,45,50,0)",
          border: "solid rgb(45,50,55)",
          color: "rgb(225,230,235)",
          fontSize: "20px",
          height: "40px",
          width: "550px",
          resize: "none",
          borderRadius: "15px",
          padding: "10px 0px 0px 10px",
          fontFamily: "Roboto",
          marginBottom: "20px",
        }}
        name="title"
        placeholder="title"
        value={inputs["title"]}
        onChange={handleChange}
      />

      <TextareaAutosize
        style={{
          backgroundColor: "rgba(40,45,50,0)",
          border: "solid rgb(45,50,55)",
          color: "rgb(225,230,235)",
          fontSize: "18px",
          height: "200px",
          width: "550px",
          resize: "none",
          borderRadius: "15px",
          padding: "10px 0px 0px 10px",
          fontFamily: "Roboto",
        }}
        name="body"
        value={inputs["body"]}
        placeholder="body"
        onChange={handleChange}
      />

      <Button
        variant="contained"
        sx={{
          width: "80px",
          backgroundColor: "rgb(200,50,50)",
          marginTop: "15px",
          marginLeft: "8px",
          borderRadius: "15px",
          "&:hover":{
            backgroundColor: "rgb(230,80,80)"
          }
        }}
        onClick={handleSubmit}
      >
        Post
      </Button>
    </div>
  );
}

export default AddForum;
