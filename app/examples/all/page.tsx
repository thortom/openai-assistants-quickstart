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
    const interval = setInterval(grabImage, 500); // Repeat every 0.5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const activate = async (url) => {
    try {
      let DPP_IP = process.env.DPP_IP || '192.168.52.1'; // Default IP if environment variable is not set
      console.log("Using DPP_IP:", DPP_IP);
  
      const fullUrl = `http://${DPP_IP}:7878/api/${url}`;
  
      const response = await fetch(fullUrl, {
        method: 'POST',
        mode: 'no-cors',
      });
  
      let data = response; // Using the response directly as the response is opaque due to 'no-cors'
      console.log('response: ', data);
      return { message: 'Success!' };   // Standard response as the actual response is not readable
    } catch (error) {
      console.error('Error in activate function:', error);
      return { error: `Failed to activate ${url}` };
    }
  };
  
  const functionCallHandler = async (call) => {
    if (call?.function?.name === "display_processing_line") {
      const args = JSON.parse(call.function.arguments) as { line_number: number };
      const status = displayProcessingLine(args.line_number);
      grabImage(); // Updates the imgSrc state
      return JSON.stringify({ message: 'Success!' });
    }
    if (call?.function?.name === "start_line") {
      console.log("toggleSimulation");
      activate("toggleSimulation"); // Using the activate function for toggleSimulation
    }
    if (call?.function?.name === "move_camera") {
      console.log("toggleCameraLoop");
      activate("toggleCameraLoop"); // Using the activate function for toggleCameraLoop
    }
    return JSON.stringify({ message: 'Success!' });
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.column}>
           <MarelDppWidget img={imgSrc} isEmpty={!imgSrc} />
          {/*<img src="/dpp.jpg" alt="Descriptive Alt Text" className={styles.image} />*/}
          {/* <FileViewer /> */}
          {/* Styled gray box with formatted text */}
          <div className={styles.infoBox}>
            <p className={styles.highlightText}>
              <strong>Marel Fish Processing Sales Expert</strong>
            </p>
            <p>
              <strong>Display Processing Line</strong>: Displays a specific fish processing line. You can select from:
            </p>
            <ul>
              <li>Salmon Filleting Line</li>
              <li>Salmon Slicing Line</li>
              <li>Whitefish Filleting Line</li>
            </ul>
            <p>
              <strong>Start Line</strong>: This initiates a simulation of a displayed processing line to showcase its operation.
            </p>
            <p>
              <strong>Move Camera</strong>: Triggers the camera to move around.
            </p>
          </div>
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
