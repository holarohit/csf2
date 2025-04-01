import React, { createContext, useState } from "react";
import runChat from "../config/gemini";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  // Chat States
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Voice Interaction States
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("listening...");
  const [response, setResponse] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
  
    // Find a female voice (Microsoft Zira, Google UK English Female, etc.)
   const femaleVoice =
      voices.find((voice) => voice.name.includes("Female")) ||
      voices.find((voice) => voice.name.includes("Zira")) || // Windows default female voice
      voices.find((voice) => voice.name.includes("Google UK English Female")) ||
      voices[0]; // Fallback to the first available voice
  
    utterance.voice = femaleVoice;
    utterance.volume = 1; // Volume: 0 to 1
    utterance.rate = 1.3; // Speed: 0.1 to 10
    utterance.pitch = 1.2; // Higher pitch for a more feminine tone
    utterance.lang = "hi-GB"; // British English


    // Mark speaking start
    setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false); // Mark speaking end
    };

  
    window.speechSynthesis.speak(utterance);
  };
  

  // Handle AI Chat Response
  const onSent = async (userPrompt) => {
    setLoading(true);
    setShowResult(true);
    setResultData(" ");

    const finalPrompt = userPrompt || input;
    const responseText = await runChat(finalPrompt);
    setRecentPrompt(finalPrompt);
    setPrevPrompts((prev) => [...prev, finalPrompt]);

    // Format Response
    const formattedText = responseText
      .split("**")
      .map((chunk, i) => (i % 2 === 1 ? `<b>${chunk}</b>` : chunk))
      .join("")
      .split("*")
      .join("</br>");
      
    const words = formattedText.split(" ");
    words.forEach((word, index) => {
      setTimeout(() => setResultData((prev) => prev + word + " "), 75 * index);
    });

    setInput("");
    setLoading(false);
  };

  // Voice AI Response
  const aiResponse = async (userPrompt) => {
    const responseText = await run(userPrompt);
    const formattedText = responseText
      .replace(/google/gi, "Chatsphere creator")
      .split("**")
      .join("")
      .split("*")
      .join("");

    setPrompt(formattedText);
    speak(formattedText);
    setResponse(true);
    setTimeout(() => setSpeaking(false), 40000);
  };

  // Voice Recognition Setup
  const speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new speechRecognition();

  recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
    setPrompt(transcript);
    handleCommand(transcript);
  };

  // Handle Voice Commands
  const handleCommand = (command) => {
    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("Opening YouTube");
      setPrompt("Opening YouTube...");
    } else if (command.includes("open") && command.includes("samarth")) {
      window.open("https://ggv.samarth.edu.in/index.php/site/login", "_blank");
      speak("Opening GGV Samarth");
      setPrompt("Opening GGV Samarth...");
    } else {
      aiResponse(command);
    }
    setTimeout(() => setSpeaking(false), 40000);
  };

  // Reset Chat
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };
    
  // Context Values
  const contextValue = {
    // Chat
    prevPrompts,
    setPrevPrompts,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    // Voice
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
    isSpeaking,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
