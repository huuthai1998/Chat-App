import React, { useState } from "react";
import { UserContext } from "../../App";

const Landing = () => {
  const userContext = React.useContext(UserContext);
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");

  const onChangeHandler = (e) => {
    const { name, value } = e.currentTarget;
    if (name === "room") setRoom(value);
    else setUserName(value);
  };
  const submit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (userName !== "" && room !== "") {
      userContext.setUsername(userName);
      userContext.setRoomName(room);
      setUserName("");
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 p-8">
      <main className="container mx-auto max-w-md">
        <div className="flex bg-red-500 p-6 text-4xl text-white font-extrabold items-center justify-center">
          <i
            className="align-baseline fa fa-envelope mr-4"
            aria-hidden="true"
          ></i>
          <p className="align-middle">Online Chatroom</p>
        </div>
        <form
          className="bg-red-500 p-8"
          onSubmit={(e) => {
            submit(e);
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 w-full">
            <label
              className="text-white font-bold text-xl mb-2 sm:mb-0"
              htmlFor="room"
            >
              Room
            </label>
            <select
              className="flex-grow sm:ml-4 rounded-md focus:outline-none focus:shadow-outline p-2"
              name="room"
              id="room"
              onChange={onChangeHandler}
              required
            >
              <option value="">-- select a room --</option>
              <option value="D-Mail">D-Mail</option>
              <option value="Time Machine">Time Machine</option>
              <option value="Okabe Rintaro">Okabe Rintaro</option>
              <option value="Makise Kurisu">Makise Kurisu</option>
              <option value="Steins;Gate">Steins;Gate</option>
              <option value="Steins;Gate 0">Steins;Gate 0</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-4 w-full">
            <label
              className="text-white  font-bold text-xl mb-2 sm:mb-0"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="flex-grow sm:ml-4 p-2 w-full sm:w-auto rounded-md focus:outline-none focus:shadow-outline"
              placeholder="Enter your name"
              onChange={onChangeHandler}
            ></input>
          </div>
          <button
            className="w-full bg-blue-400 text-white font-bold py-2 px-4 rounded-md 
              focus:outline-none focus:shadow-outline hover:bg-blue-500"
          >
            Go!
          </button>
        </form>
      </main>
    </div>
  );
};

export default Landing;
