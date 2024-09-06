import dotenv from 'dotenv';

// Constructs an absolute path to where your .env file is located
dotenv.config({ path: "../../.env" });

// Import the JSON data
const old_system = require('./systems/System.json');
const salmon_filleting = require('./systems/Salmon_Filleting_Line_v2.json');
const salmon_slicing = require('./systems/Salmon_Slicing_Line.json');

const displayProcessingLine = async (lineType: number) => {
  try {
    // Send the loadProject request to Marel DPP
    let DPP_IP = process.env.DPP_IP || '192.168.1.5'; // Default to a hardcoded IP if env var is not present
    console.log("Using DPP_IP:", DPP_IP);
    console.log('process.env:', process.env);
    const url = `http://${DPP_IP}:7878/api/loadProject`;

    let system_to_send = old_system;
    if (lineType == 1) {
      system_to_send = salmon_filleting;
    } else if (lineType == 2) {
      system_to_send = salmon_slicing;
    } else if (lineType == 3) {
      system_to_send = old_system;
    } else {
      console.error('Invalid lineType:', lineType);
      system_to_send = old_system;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(system_to_send),  // TODO: change to lineType dependent system
      mode: 'no-cors',
    });

    let data = response; // const data = await response.json();
    console.log('response: ', data);
    // return data;
    return { message: 'Success!' };   // While the 'no-cors' then the responce is opaque and not useful
  } catch (error) {
    console.error('Error in displayProcessingLine:', error);
    return { error: 'Failed to load project' };
  }


  // // chose a random temperature and condition
  // const randomTemperature = Math.floor(Math.random() * (80 - 50 + 1)) + 50;
  // const randomConditionIndex = Math.floor(Math.random() * 5);
  // const conditions = ["Cloudy", "Sunny", "Rainy", "Snowy", "Windy"];

  // return {
  //   location: lineType,
  //   temperature: randomTemperature,
  //   unit: "F",
  //   conditions: conditions[randomConditionIndex],
  // };
};

export { displayProcessingLine };
