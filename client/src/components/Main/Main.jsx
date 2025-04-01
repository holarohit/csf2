import React, { useContext, useState, useEffect } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const HF_TOKEN = "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"; // Replace with your actual Hugging Face token

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    recognition,
    speaking,
    setSpeaking,
    prompt,
    response,
    setPrompt,
    setResponse,
  } = useContext(Context);

  const [generatedImage, setGeneratedImage] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Zero key functionality for voice interaction
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "0" && !speaking) {
        startListening();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [speaking]);

  const startListening = () => {
    setPrompt("Listening...");
    setSpeaking(true);
    setResponse(false);
    recognition.start();
  };

  const handleImageGeneration = async () => {
    if (!input) return;

    setIsImageLoading(true);
    setGeneratedImage(null);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/kothariyashhh/GenAi-Texttoimage",
        {
          headers: { Authorization: `Bearer ${HF_TOKEN}` },
          method: "POST",
          body: JSON.stringify({ inputs: input }),
        }
      );
      const blob = await response.blob();
      setGeneratedImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsImageLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && input) {
      onSent();
    }
  };

  return (
    <div className="main">
      {/* Navigation */}
      <div className="nav">
        <p className="nav-title">Chatsphere Fusion</p>
        <img src={assets.user_icon} alt="User Icon" className="nav-user-icon" />
      </div>

      <div className="main-container">
        {/* Result Section */}
        {(showResult || speaking) && (
          <div className="result">
            {/* Listening Indicator */}
            {speaking && (
              <div className="listening-indicator">
                <img
                  src={assets.gemini_icon}
                  alt="Listening"
                  className="listening-wave"
                />
                <p>{prompt}</p>
              </div>
            )}

            {/* Display Speaking GIF */}
            {speaking && (
              <div className="speaking-gif-container">
                {/* Uncomment if you have a speaking GIF */}
                {/* <img src={assets.speaking_gif} alt="Speaking..." className="speaking-gif" /> */}
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="loader">
                <hr className="animated-bg" />
                <hr className="animated-bg" />
                <hr className="animated-bg" />
              </div>
            )}

            {/* ✅ User Question - Added after loading animation */}
            {!loading && recentPrompt && (
              <div className="result-header">
                <img src={assets.user_icon} alt="User" />
                <p>{recentPrompt}</p>
              </div>
            )}

            {/* ✅ AI Response - Added after loading animation */}
            {!loading && resultData && (
              <div className="result-header bot-response">
                <img src={assets.gemini_icon} alt="Bot" />
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              </div>
            )}
          </div>
        )}

        {/* Greeting Section */}
        {!showResult && !speaking && (
          <div className="greet">
            <h2>Hello, Boss!</h2>
            <p>How can I assist you today?</p>
          </div>
        )}

        {/* Input Section */}
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
              onKeyPress={handleKeyPress}
              className="search-input"
            />
            <div className="search-actions">
              {!speaking ? (
                <div onClick={startListening} style={{ cursor: "pointer" }}>
                  <img
                    src={assets.mic_icon}
                    width={30}
                    alt="Mic"
                    aria-label="Start voice interaction"
                  />
                </div>
              ) : null}

              {input && (
                <>
                  <img
                    onClick={onSent}
                    src={assets.send_icon}
                    width={40}
                    alt="Send"
                    style={{ cursor: "pointer" }}
                  />
                  <img
                    onClick={handleImageGeneration}
                    src={assets.gallery_icon}
                    width={30}
                    alt="Generate Image"
                    style={{ cursor: "pointer" }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Image Loading and Generated Image */}
          {isImageLoading && (
            <div className="image-loading">
              <p>Loading image...</p>
            </div>
          )}
          {generatedImage && (
            <div className="generated-image">
              <img src={generatedImage} alt="Generated" />
            </div>
          )}

          {/* Footer */}
          <div className="bottom-info">
            <p>Holarohit Studio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
