import React from "react";
import FileUpload from "./FileUpload";
import UploadedFiles from "./UploadedFiles";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-3xln my-10">Hello, this is home</h1>
      <FileUpload />
      <UploadedFiles />
    </div>
  );
};

export default Home;