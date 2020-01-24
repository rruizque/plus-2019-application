
function info(session_id) {
  pjs.defineDisplay("display", "sessionInfo.json");

  var data = pjs.query("SELECT * FROM sessions WHERE session_id = ?", session_id)[0];
  if (!data) return false;

  data.user = pjs.getUser();
  var userRecord = pjs.query("SELECT * FROM users WHERE user = ?", data.user)[0];
  data.displayUser = data.user;
  if (userRecord && userRecord.name) data.displayUser = userRecord.name;
  data.welcomeMessage = "Welcome " + data.displayUser + "!";
  data.avatar = "/avatar/user/" + data.user + ".png";
  getSpeakers(data);
  getTime(data);
  initRating(data);
  data.animation = "slide-left";
  data.animatedScreen = "new";

  while (!data.back1 && !data.back2) { 
    data.desc = data.description.replace(/\n/g, "<br/>");
    display.sessionInfo.execute(data);
    data.animation = "slide-left";
    data.animatedScreen = "new";
    if (data.feedback) {
      pjs.call("feedback.js", session_id, data.title);
      data.animation = "slide-down";
      data.animatedScreen = "previous";
    }
    if (data.edit) {
      editSession(data);
      data.animation = "slide-right";
      data.animatedScreen = "previous";
    }
    if (data.stars1) updateRating(data, 1);
    if (data.stars2) updateRating(data, 2);
    if (data.stars3) updateRating(data, 3);
    if (data.stars4) updateRating(data, 4);
    if (data.stars5) updateRating(data, 5);
  }

  return data.updated;
}

function editSession(data) {
  var newData = pjs.call("editSession.js", data.session_id);
  Object.assign(data, newData);
  data.updated = true;
}

function getSpeakers(data) {
  data.speaker1Name = data.speaker1;
  data.speaker1Avatar = "/avatar/user/" + data.speaker1 + ".png";
  var speakerRecord = pjs.query("SELECT name, about FROM users WHERE user = ?", data.speaker1)[0];
  if (speakerRecord) {
    data.speaker1Name = speakerRecord.name;
    data.speaker1Bio = speakerRecord.about.replace(/\n/g, "<br/>");
  }
  else {
    data.speaker1Avatar = "/avatar/user/profound-logic.png";
  }

  if (data.speaker2) {
    data.speaker2Avatar = "/avatar/user/" + data.speaker2 + ".png";
    data.showSpeaker2 = true;
    data.speaker2Name = data.speaker2;
    var speakerRecord = pjs.query("SELECT name, about FROM users WHERE user = ?", data.speaker2)[0];
    if (speakerRecord) {
      data.speaker2Name = speakerRecord.name;
      data.speaker2Bio = speakerRecord.about.replace(/\n/g, "<br/>");
    }
  }
  else {
    data.showSpeaker2 = false;
  }

  data.showEdit = (data.user === data.speaker1 || data.user === data.speaker2);
  if (!data.showEdit && pjs.query("SELECT count(user) as count FROM admins WHERE user = ?", data.user)[0].count === 1) {
    // admins can edit any session
    data.showEdit = true;
  }
}

function initRating(data) {
  var ratingRecord = pjs.query("SELECT rating FROM ratings WHERE session_id = ? AND user = ?", [data.session_id, data.user])[0];
  var rating = 0;
  if (ratingRecord) rating = ratingRecord.rating;
  for (var x = 1; x <= 5; x++) {
    data["star" + x] = (rating >= x);    
  }
}

function updateRating(data, rating) {
  var ratingRecord = pjs.query("SELECT rating FROM ratings WHERE session_id = ? AND user = ?", [data.session_id, data.user])[0];
  if (ratingRecord) {
    if (ratingRecord.rating === rating) {
      pjs.query("DELETE FROM ratings WHERE session_id = ? AND user = ?", [data.session_id, data.user]);
    }
    else {
      pjs.query("UPDATE ratings SET ? WHERE session_id = ? AND user = ?", [{ rating }, data.session_id, data.user]);
    }
  }
  else {
    pjs.query("INSERT INTO ratings SET ?", { session_id: data.session_id, user: data.user, rating });
  }
  initRating(data);
  data.animation = "fade";
  data.animatedScreen = "new";
}

function formatTime(time) {
  var parts = time.split(":");
  var ampm = "AM";
  parts[0] = Number(parts[0]);
  if (parts[0] >= 12) ampm = "PM";
  if (parts[0] >= 13) parts[0] -= 12;
  return parts[0] + ":" + parts[1] + " " + ampm;
}

function getTime(data) {
  data.time = formatTime(data.start_time) + " to " + formatTime(data.end_time);
}

exports.default = info;