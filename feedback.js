
function feedback(session_id, title) {
  pjs.defineDisplay("display", "feedback.json");

  user = pjs.getUser();
  var userRecord = pjs.query("SELECT * FROM users WHERE user = ?", user)[0];
  var displayUser = user;
  if (userRecord && userRecord.name) displayUser = userRecord.name;
  welcomeMessage = "Welcome " + displayUser + "!";
  avatar = "/avatar/user/" + user + ".png";
  session_title = title;

  display.feedback.execute();

  if (submit && comment) {
    pjs.query("INSERT INTO feedback SET ?", { session_id, user, timestamp: new Date(), comment });
    pjs.messageBox("Thank you for your feedback!");
  }

}

exports.default = feedback;