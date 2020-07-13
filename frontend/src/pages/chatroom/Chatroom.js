import React, { useState, useEffect, useRef } from "react";
import { UserContext } from "../../App";
import io from "socket.io-client";

const ENDPOINT = "https://chat-app-reactjs-nodejs.herokuapp.com/";

const Chatroom = () => {
  const userContext = React.useContext(UserContext);
  //Hooks variables
  const [showUsers, setShowUsers] = useState(false);
  const [chatText, setChatText] = useState("");
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(userContext.user);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState(userContext.room);
  const [messages, setMessages] = useState([]);
  const [typers, setTypers] = useState([]);
  const typersRef = useRef(typers);
  const [shouldScroll, setShouldScroll] = useState(false);
  const messagesRef = useRef(messages);
  const usersRef = useRef(users);
  const node = useRef(null);
  const chatDiv = useRef(null);
  const scrollPos = useRef(null);
  var i1 = { "--i": 1, color: "white" };
  var i2 = { "--i": 2, color: "white" };
  var i3 = { "--i": 3, color: "white" };
  const botName = "Bot Mayushii☆";

  useEffect(() => {
    usersRef.current = users;
    if (
      node.current !== null &&
      Math.floor(chatDiv.current.scrollTop) >= scrollPos.current - 4
    )
      node.current.scrollIntoView();

    scrollPos.current =
      chatDiv.current.scrollHeight - chatDiv.current.clientHeight;
  });

  useEffect(() => {
    messagesRef.current = messages;
    setShouldScroll(false);
    if (shouldScroll) node.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    typersRef.current = typers;
  }, [typers]);

  const onChangeHandler = (e) => {
    socket.emit("typing", user);
    setChatText(e.currentTarget.value);
  };

  const onSent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    socket.emit("stop typing");
    socket.emit("chat", chatText);
    setChatText("");
    setShouldScroll(true);
  };

  useEffect(() => {
    const socketIo = io(ENDPOINT);
    setSocket(socketIo);

    socketIo.emit("join room", { username: user, room });

    socketIo.on("get users", (u) => {
      setUsers(u);
    });

    socketIo.on("bot message", (m) => {
      const message = {
        sender: botName,
        content: m,
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
      };
      setMessages([...messagesRef.current, message]);
    });

    socketIo.on("bubble", (u) => {
      if (typersRef.current.find((e) => e === u) === undefined)
        setTypers([...typersRef.current, u]);
    });

    socketIo.on("stop bubble", (u) => {
      typersRef.current.splice(
        typersRef.current.find((e) => e === u),
        1
      );
      setTypers(typersRef.current);
    });

    socketIo.on("message", ({ sender, content }) => {
      const message = {
        sender,
        content,
        hour: new Date().getHours(),
        minute: new Date().getMinutes(),
      };
      setMessages([...messagesRef.current, message]);
    });
  }, [user, room, ENDPOINT]);

  const disconnect = () => {
    userContext.setUsername(null);
    userContext.setRoomName(null);
    socket.emit("disconnect");
    socket.disconnect();
  };

  const messageList = messages.map((message, key) => (
    <div
      key={key}
      className={`p-2 rounded mb-4 ${
        message.sender === botName
          ? "bg-black"
          : user === message.sender
          ? "bg-blue-500"
          : "bg-gray-600"
      }`}
      ref={key === messages.length - 1 ? node : null}
    >
      <div className="flex w-full">
        <span className="text-red-200 font-bold">{message.sender}</span>
        <span className="text-white ml-2">{`${message.hour}:${message.minute}`}</span>
      </div>
      <span className="text-white break-words">{message.content}</span>
    </div>
  ));

  const typingBubble = (
    <div className="p-2 rounded mb-4 bg-gray-400 w-1/2 float-right" ref={node}>
      <p className="text-white text-right mr-2">
        {typing} is typing
        <span className="wavy">
          <span className="text-white" style={i1}>
            .
          </span>
          <span className="text-white" style={i2}>
            .
          </span>
          <span className="text-white" style={i3}>
            .
          </span>
        </span>
      </p>
    </div>
  );

  var typing = "";
  typers.map((t, i) => {
    if (t !== undefined) {
      if (i !== typers.length - 1) typing += `${t}, `;
      else typing += t;
    }
  });

  const userList = users.map((user, key) => {
    return (
      <div className="text-lg" key={key}>
        {user.username}
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <main className="container mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row bg-red-500 p-4 sm:p-6 justify-between rounded">
          <p className="text-left text-xl text-white font-extrabold mb-4 sm:mb-0">
            {`Room: ${userContext.room}`}
          </p>
          <button
            className=" bg-blue-400 text-white font-bold py-2 px-4 rounded-md 
              focus:outline-none focus:shadow-outline hover:bg-blue-500"
            onClick={() => {
              disconnect();
            }}
          >
            <span>
              <i className="fas fa-sign-out-alt mr-2"></i>
            </span>
            Leave session
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between h-23-screen">
          <div className="sm:w-1/4 w-full  bg-red-200 p-6 overflow-y-auto">
            <span className="text-blue-600 font-bold text-xl">
              <i className="fa fa-user" aria-hidden="true"></i> Users
            </span>
            <div className="hidden sm:block">{userList}</div>
            <button
              className="float-right sm:hidden"
              onClick={() => setShowUsers(!showUsers)}
            >
              <i className="fa fa-bars" aria-hidden="true"></i>
            </button>
            <div className={`sm:hidden ${showUsers ? "block" : "hidden"}`}>
              {userList}
            </div>
          </div>
          <div
            className="sm:w-3/4 w-full bg-white p-5 overflow-y-auto h-23-screen sm:h-auto"
            ref={chatDiv}
          >
            {messageList}
            {typers.length !== 0 && typingBubble}
          </div>
        </div>
        <form
          className="flex bg-red-500 p-4 sm:p-6 space-between rounded"
          onSubmit={(e) => {
            onSent(e);
          }}
        >
          <input
            type="text"
            name="chat"
            id="chat"
            className="flex-grow p-2 rounded-md focus:outline-none focus:shadow-outline"
            placeholder="Enter your message"
            onChange={onChangeHandler}
            value={chatText}
          ></input>
          <button
            type="submit"
            className="flex sm:flex-row flex-col ml-4 bg-blue-400 text-white font-bold py-2 px-4 rounded-md 
              focus:outline-none focus:shadow-outline hover:bg-blue-500"
          >
            <span>
              <i className="far fa-paper-plane sm:mr-2"></i>
            </span>
            <p className="hidden sm:block">SEND</p>
          </button>
        </form>
      </main>
    </div>
  );
};

export default Chatroom;
