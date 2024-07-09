import React from "react";
import Forum from "./components/forum";

function MainWindow({ data, setData, token }) {

  const deletePost = (item)=>{
    setData(data.filter((i)=>{
      return i._id != item._id; 
    }))
  }
  return (
    <>
      <title>Chinese Whisper</title>
      {data[0] ? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              padding: "10px",
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {data.map((item, index) => {
              return <Forum key={item._id} deleteFunc={deletePost} item={item} updateWindow={function(){}} setLoadCmnt={function(){}} token={token} />;
            })}
          </div>
        </div>
      ) : (
        <div
          style={{
            color: "white",
            fontSize: "60px",
            left: "50vw",
            top: "50vh",
            transform: "translate(-50%,-50%)",
          }}
        >
          ...
        </div>
      )}
    </>
  );
}

export default MainWindow;
