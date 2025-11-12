import { useEffect, useRef, useState } from "react";
import "./App.css";
import { ZIM } from "zego-zim-web";
import { HiChatBubbleLeftRight, HiPaperAirplane } from "react-icons/hi2";
import { MdCircle } from "react-icons/md";

const App = () => {
  const [zimInstance, setzimInstance] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState("Aymane");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  // import app id from env
  // const appID = import.meta.env.VITE_APP_ID;
  const appID = 1419881113;

  // Token for chat users
  const token_Aymane =
    "04AAAAAGkWNAMADOyj1NxRMNXot/d26ACxDuuYu/bQbBquRPIn2nqC/lO0g6MiW0KiC97QPAw+QGLB3nfWgFc1/e1iqTehzserr1+l7X1XrfWR77a7I9z89GakNexha8mjqOGKF18nDBtIF4Fwr4F/0yzSur335LqlhGNAUXVwb5AevlIq299BaBjiy/25UTIeptIskxju/bppgzohp+vqSeu2Omb36S5p+sX1faldWzaenXxa4k/WqToimZ7NimMzn+8Bmo6nNS1IAQ==";

  const token_Hajhouj =
    "04AAAAAGkWNB8ADEa4j+MULAPR7LDaogCy1S92t4Cs9GpZLVOYpJnEvRjiLoGmy/DW4o0Fms+tj6LtNlUpo2boGl16oIDDTaI3a60bbyHfvzoo/ul72l9mLaPAfM2XI1pbBO+Gh3ECpcZ53F1qObTsfoUOe+bHbYd+leAm57Qod7S654yCYmcjNfiFRgFIHE8jufknP2NawmZaBUV7JaY4vv3Ke/cybfCiWwMwWZm+9C0V19UJcnF9janBEX/626U6A8vQ9sy3WGhqsgE=";

  const messageEndRef = useRef(null);

  useEffect(() => {
    const instance = ZIM.create(appID);
    setzimInstance(instance);

    // Set up and listen for the callback for receiving error codes.
    instance.on("error", function (zim, errorInfo) {
      console.log("error", errorInfo.code, errorInfo.message);
    });

    // Set up and listen for the callback for connection status changes.
    instance.on("connectionStateChanged", function (zim, { state, event }) {
      console.log("connectionStateChanged", state, event);
    });

    // Set up and listen for the callback for receiving one-to-one messages.
    instance.on("peerMessageReceived", function (zim, { messageList }) {
      setMessages((prev) => [...prev, ...messageList]);
      console.log("peerMessageReceived", messageList);
    });

    // Set up and listen for the callback for token expires.
    instance.on("tokenWillExpire", function (zim, { second }) {
      console.log("tokenWillExpire", second);
      // You can call the renewToken method to renew the token.
      // To generate a new Token, refer to the Prerequisites.
      zim
        .renewToken(selectedUser === "Aymane" ? token_Aymane : token_Hajhouj)
        .then(function () {
          console.log("Token renewed successfully");
        })
        .catch(function (err) {
          console.log("An error occured:", err);
        });
    });

    return () => {
      instance.destroy();
    };
  }, []);

  // Login
  const login = () => {
    setIsLogging(true);
    const info = {
      userID: selectedUser,
      username: selectedUser === "Aymane" ? "Aymane" : "Hajhouj",
    };
    setUserInfo(info);
    var login_token = selectedUser === "Aymane" ? token_Aymane : token_Hajhouj;

    if (zimInstance) {
      zimInstance
        .login(info, login_token)
        .then(function () {
          console.log("Login successfully");
          setIsLoggedIn(true);
          setIsLogging(false);
        })
        .catch(function (err) {
          console.log("An error occured:", err);
          setIsLogging(false);
        });
    } else {
      console.log("zim instance not intialized");
      setIsLogging(false);
    }
  };

  // Logout
  const logout = () => {
    if (zimInstance) {
      zimInstance.logout();
    }
    setIsLoggedIn(false);
    setUserInfo(null);
    setMessages([]);
  };

  // Send Messages
  const sendMessages = () => {
    if (!isLoggedIn) return;

    if (zimInstance) {
      const toConversationID = selectedUser === "Aymane" ? "Hajhouj" : "Aymane";
      const conversationType = 0;
      const config = {
        priority: 1,
      };

      const messageTextObj = { type: 1, message: messageText };

      zimInstance
        .sendMessage(messageTextObj, toConversationID, conversationType, config)
        .then(function ({ message }) {
          setMessages((prev) => [...prev, message]);
        })
        .catch(function (err) {
          console.log("Fail to send message:", err);
        });
    }
    setMessageText("");
  };

  // Message time format
  const format_time = (time) => {
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
    {/* Gradient background blob */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-20 w-96 h-96 bg-linear-to-r from-green-400/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse">
      </div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-linear-to-r from-purple-400/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay : "2s" }}>
      </div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 transform -translate-x-1/2 -translate-y-1/2 bg-linear-to-r from-blue-400/20 to-cyan-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay : "4s" }}>
      </div>
    </div>
      {/* Login */}
      {isLoggedIn === false ? (
        <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white flex flex-col items-center justify-center p-4 ">
          <div className="w-full max-w-md p-8 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-100 shadow-2xl shadow-black/5">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HiChatBubbleLeftRight className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">Login to continue chatting</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select User
                </label>
                <select
                  onChange={(e) => setSelectedUser(e.target.value)}
                  value={selectedUser}
                  className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl text-gray-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus::outline-none transition-all duration-200 backdrop-blur-sm cursor-pointer"
                >
                  <option value="Aymane">Aymane</option>
                  <option value="Hajhouj">Hajhouj</option>
                </select>
              </div>
              {/* Login Button */}
              <button
                onClick={login}
                disabled={isLogging}
                className="w-full p-4 bg-purple-500 text-white font-semibold rounded-xl transition-all duration-200 hover:bg-purple-600 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLogging ? "Logging..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-white p-4">
            <div className="max-w-6xl mx-auto h-[calc(100vh-2rem)]">
              {/* Header */}
              <header className="mb-6 p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg shadow-black/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 ">
                    <div className="w-10 h-10 bg-linear-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <HiChatBubbleLeftRight className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-950">{userInfo.username}'s Chat</h1>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <MdCircle className="w-3 h-3 text-green-400" />
                      <span className="text-sm text-gray-600">Online</span>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 text-white font-medium rounded-lg cursor-pointer hover:bg-amber-600" onClick={() => setMessages([])}>Clear Messages</button>
                    <button className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg cursor-pointer hover:bg-red-600" onClick={logout}>Logout</button>
                  </div>
                </div>
              </header>

              {/* Chat Container */}
              <div className="h-[calc(100vh-12rem)] rounded-2xl bg-white/60 backdrop-blur-xl border border-gray-100 shadow-lg shadow-black/5 flex flex-col">
                {/* Messages  */}
                <div className="flex-1 p-6 overflow-y-auto space-x-4">
                {messages.length > 0 ? (
                  messages.map((msg, index) => {
                    let isOwnMsg = msg.senderUserID === userInfo.userID;
                    return (
                      <div
                        className={`flex ${
                          isOwnMsg ? "justify-end" : "justify-start"
                        }`}
                        key={index}
                      >
                        <div className="flex flex-col ">
                          <div
                            className={`py-2 px-3.5 rounded-xl transition-all duration-200 hover:scale-[1.05] ${
                              isOwnMsg
                                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                                : "bg-purple-200 border border-white/70 text-black shadow-lg shadow-black/5"
                            } `}
                          >
                            <p className="text-sm leading-relaxed">
                              {msg.message}
                            </p>
                          </div>
                          <p
                            className={`text-xs mt-1 opacity-70 text-gray-500 px-2 ${
                              isOwnMsg ? "text-right" : "text-left"
                            }`}
                          >
                            {format_time(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 ">
                        <HiChatBubbleLeftRight className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Messages
                      </h3>
                      <p className="text-gray-600">
                        Start a conversation by sending a message.
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messageEndRef}></div>
              </div>
              {/* Message input */}
              <div className="p-6 border-t border-white/20 ">
                <div className="flex items-center space-x-4">
                  <input
                    onChange={(e) => setMessageText(e.target.value)}
                    value={messageText}
                    onKeyDown={(e) => e.key === "Enter" && sendMessages()}
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 p-3.5 bg-white/70 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none backdrop-blur-sm"
                  />
                  <button className="p-4 bg-purple-500 text-white rounded-xl transition-all duration-200 hover:bg-purple-600 cursor-pointer" onClick={sendMessages}>
                    <HiPaperAirplane className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default App;
