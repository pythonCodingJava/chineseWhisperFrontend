import { TextField } from "@mui/material";
import React from "react";

export class Field extends React.Component {
  render() {
    return (
      <TextField
        variant="outlined"
        InputProps={{
          style: {
            color: "white",
            border: "solid rgba(255,255,255,0.1)",
            height: "50px",
          },
        }}
        InputLabelProps={{
          style: {
            color: "rgba(255,255,255,0.45)",
          },
        }}
        FormHelperTextProps={{
          sx: {
            color: "rgba(0,0,0,0)",
          },
        }}
        {...this.props}
        required
      ></TextField>
    );
  }
}

export const linkStyle = {
  textDecoration: "none",
  color: "rgb(220,220,220)",
};

export const boxstyle = {
  display: "flex",
  flexDirection: "column",
  bgcolor: "rgb(32,34,35)",
  p: 6,
  borderRadius:'20px 20px 8px 8px',
  color: "rgba(0,0,0,0)",
  marginBottom : "30px",
  width: "340px",
};
