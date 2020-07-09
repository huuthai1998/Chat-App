import React, { useState, useEffect, useRef } from "react";
import { UserContext } from "../../App";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

const Chatroom = () => {
  const userContext = React.useContext(UserContext);
  //Hooks variables
  const [chatText, setChatText] = useState("");
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(userContext.user);
  const [users, setUsers] = useState([]);
  const [room, setRoom] = useState(userContext.room);
  const [messages, setMessages] = useState([]);
  const [typers, setTypers] = useState([]);
  const typersRef = useRef(typers);
  const messagesRef = useRef(messages);
  const usersRef = useRef(users);
  const node = useRef(null);
  var i1 = { "--i": 1, color: "white" };
  var i2 = { "--i": 2, color: "white" };
  var i3 = { "--i": 3, color: "white" };
  const botName = "Mayushii☆";

  useEffect(() => {
    messagesRef.current = messages;
    usersRef.current = users;
    typersRef.current = typers;
    if (node.current !== null) node.current.scrollIntoView();
  });

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
      console.log("user ", u);
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
      <div>
        <span className="text-red-200 font-bold">{message.sender}</span>
        <span className="text-white ml-2">{`${message.hour}:${message.minute}`}</span>
      </div>
      <span className="text-white">{message.content}</span>
    </div>
  ));

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
        <div className="flex flex-col sm:flex-row bg-red-500 p-6 justify-between rounded">
          <p className="text-left text-xl text-white font-extrabold">
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
        <div className="flex flex-col sm:flex-row justify-between h-23-screen">
          <div className="w-1/4 bg-red-200 p-6 overflow-y-auto">
            <span className="text-blue-600 font-bold text-xl">
              <i className="fa fa-user" aria-hidden="true"></i> Users
            </span>
            {userList}
          </div>
          <div className="w-3/4 bg-white p-5 overflow-y-auto">
            {messageList}
            {typers.length !== 0 && (
              <div
                className="p-2 rounded mb-4 bg-gray-400 w-1/2 float-right"
                ref={node}
              >
                <p className="text-white text-right mr-2">
                  {typing} is typing{" "}
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
            )}
          </div>
        </div>
        <form
          className="flex flex-col sm:flex-row bg-red-500 p-6 space-between  rounded"
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
            className="ml-4 bg-blue-400 text-white font-bold py-2 px-4 rounded-md 
              focus:outline-none focus:shadow-outline hover:bg-blue-500"
          >
            <span>
              <i className="far fa-paper-plane mr-2"></i>
            </span>
            SEND
          </button>
        </form>
      </main>
    </div>
  );
};

export default Chatroom;
