"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import Chat from "../../components/chat";
import MarelDppWidget from "../../components/marel-dpp-widget";
import { displayProcessingLine } from "../../utils/marel-dpp";
import FileViewer from "../../components/file-viewer";

const FunctionCalling = () => {
  const [imgSrc, setImgSrc] = useState(""); // Add a new state variable to store the image src

  const grabImage = async () => {
    const url = '/api/proxy';
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok.');
      const blob = await response.blob();
      const imgURL = URL.createObjectURL(blob);
      setImgSrc(imgURL);
    } catch (error) {
      console.error('Error fetching image:', error);
      setImgSrc("");
    }
  };

  useEffect(() => {
    // Call grabImage initially on mount and then set up the interval
    grabImage(); // Also grab the image immediately on component mount
    const interval = setInterval(grabImage, 10000); // Repeat every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

  const functionCallHandler = async (call) => {
    if (call?.function?.name === "display_processing_line") {
      const args = JSON.parse(call.function.arguments) as { line_number: number };
      const status = displayProcessingLine(args.line_number);
      grabImage(); // This will update the imgSrc state
      return JSON.stringify({ message: 'Success!' }); //JSON.stringify(status);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
           <MarelDppWidget img={imgSrc} isEmpty={!imgSrc} />
          {/*<img src="/dpp.jpg" alt="Descriptive Alt Text" className={styles.image} />*/}
          <FileViewer />
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chat}>
            <Chat functionCallHandler={functionCallHandler} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FunctionCalling;
