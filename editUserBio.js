
function editUserBio() {
  pjs.defineDisplay("display", "editUserBio.json");

  user = pjs.getUser();
  var userRecord = pjs.query("SELECT * FROM users WHERE user = ?", user)[0];
  var displayUser = user;
  if (userRecord && userRecord.name) displayUser = userRecord.name;
  welcomeMessage = "Welcome " + displayUser + "!";
  avatar = "/avatar/user/" + user + ".png";

  if (userRecord) {
    name = userRecord.name;
    about = userRecord.about;
  }

  display.editUserBio.execute();  

  if (update) {
    record = { user, name, about };
    if (userRecord) {
      pjs.query("UPDATE users SET ? WHERE user = ?", [record, user]);
    }
    else {
      pjs.query("INSERT INTO users SET ?", record);
    }
  }

}

exports.default = editUserBio;