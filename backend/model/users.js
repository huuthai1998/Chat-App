var users = [];

const userJoin = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

const userLeave = (id) => {
  console.log("before delete: ", users);
  const pos = users.findIndex((u) => u.id === id);
  console.log(pos);

  users.splice(pos, 1);
  console.log("users: ", users);
};

const getUser = (id) => {
  return users.find((u) => u.id === id);
};

const getParticipants = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  userJoin,
  getUser,
  userLeave,
  getParticipants,
};
