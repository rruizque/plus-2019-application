
function editSession(session_id) {
  pjs.defineDisplay("display", "editSession.json");

  user = pjs.getUser();
  var userRecord = pjs.query("SELECT * FROM users WHERE user = ?", user)[0];
  var displayUser = user;
  if (userRecord && userRecord.name) displayUser = userRecord.name;
  welcomeMessage = "Welcome " + displayUser + "!";
  avatar = "/avatar/user/" + user + ".png";

  var session = pjs.query("SELECT title, description, room FROM sessions WHERE session_id = ?", session_id)[0];
  if (!session) return;

  title = session.title;
  description = session.description;
  room = session.room;

  display.editSession.execute();

  var data = { title, description, room };

  if (update) {
    pjs.query("UPDATE sessions SET ? WHERE session_id = ?", [data, session_id]);
  }

  return data;

}

exports.default = editSession;