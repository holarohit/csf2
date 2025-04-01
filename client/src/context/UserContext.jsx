import React, { createContext, useState } from 'react'
import run from '../config/gemini2';
export const datacontext=createContext()

function UserContext({children}) {
let [speaking, setSpeaking] = useState(false)
let [prompt,setPrompt]=useState("listening...")
let [response, setResponse] = useState(false)

    function speak(text){
let text_speak=new SpeechSynthesisUtterance(text)
text_speak.volume=1;
text_speak.rate=1;
text_speak.pitch=1;
text_speak.lang="hi-GB"
window.speechSynthesis.speak(text_speak)
    }
async function aiResponse(prompt) {
    let text= await run(prompt)
    let newText=text.split("**")&&text.split("*")&&
    text.replace("google","Chatsphere creator")&&text.replace("Google","Chatsphere creator")
    setPrompt(newText)
    speak(newText) 
    setResponse(true)
    setTimeout(()=>{   
        setSpeaking(false)
    },5000)
}
let speechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition
let recognition=new speechRecognition()

recognition.onresult=(e)=>{
    let currentIndex=e.resultIndex
    let transcript=e.results[currentIndex][0].transcript
    setPrompt(transcript)
    //aiResponse(transcript)
    takeCommand(transcript.toLowerCase())
}

function takeCommand(command){
    if(command.includes("open") && command.includes
("youtube")){
window.open("https://www.youtube.com/","_blank")
speak("opening Youtube")
//setResponse(true)
setPrompt("opening youtube...")
setTimeout(()=>{   
    setSpeaking(false)
},5000)
}
else if(command.includes("open") && command.includes
("samarth")){
    window.open("https://ggv.samarth.edu.in/index.php/site/login","_blank")
    speak("opening ggv samarth")
   // setResponse(true)
    setPrompt("opening ggv samarth")
    setTimeout(()=>{   
        setSpeaking(false)
    },5000)
}
else{
    aiResponse(command)
}
}
let value={
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse
    }
  return (
    <div>
        <datacontext.Provider value={value}>
            {children}
        </datacontext.Provider>
    </div>
  )
}

export default UserContext