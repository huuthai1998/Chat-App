import React, { useState } from "react";
import Landing from "./pages/landing/Landing";
import Chatroom from "./pages/chatroom/Chatroom";

export const UserContext = React.createContext({
  user: null,
  room: null,
  setUsername: () => {},
  setRoomName: () => {},
});

const App = () => {
  const userContext = React.useContext(UserContext);
  const [user, setUser] = useState(userContext.user);
  const [room, setRoom] = useState(userContext.room);
  const setUsername = (name) => {
    setUser(name);
  };

  const setRoomName = (name) => {
    setRoom(name);
  };
  return (
    <UserContext.Provider value={{ user, room, setUsername, setRoomName }}>
      <div className="App">{user === null ? <Landing /> : <Chatroom />}</div>
    </UserContext.Provider>
  );
};

export default App;
