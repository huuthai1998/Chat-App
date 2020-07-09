import React, { useState, useEffect, useRef } from "react";
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
    userContext.setUsername(userName);
    userContext.setRoomName(room);
    setUserName("");
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
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-4 w-full">
            <label className="text-white font-bold text-xl" htmlFor="room">
              Room
            </label>
            <select
              className="flex-grow ml-4 rounded-md focus:outline-none focus:shadow-outline p-2"
              name="room"
              id="room"
              onChange={onChangeHandler}
            >
              {/* <option disabled selected value>
                -- select a room --
              </option> */}
              <option value="JavaScript">D-Mail</option>
              <option value="El Psy Congroo">El Psy Congroo</option>
              <option value="PHP">PHP</option>
              <option value="C#">C#</option>
              <option value="Ruby">Ruby</option>
              <option value="Java">Java</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-4 w-full">
            <label className="text-white  font-bold text-xl" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              className="flex-grow ml-4 p-2 rounded-md focus:outline-none focus:shadow-outline"
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
