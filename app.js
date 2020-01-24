
const day1Key = "11/12";
const day2Key = "11/13";
const day3Key = "11/14";

var today = new Date();
today = (today.getMonth() + 1) + "/" + today.getDate();


function app() {
  pjs.defineDisplay("display", "app.json");

  setup();

  // initial values  
  if (day2Key === today) day2 = true;
  else if (day3Key === today) day3 = true;
  else day1 = true;
  fullSchedule = true;

  var schedule = loadSchedule();

  while (true) {
    showSchedule();
    handleMenu();
    handleAttend();
    if (showDetail) {
      var updated = pjs.call("sessionInfo.js", Number(session_id));
      animation = "slide-right";
      if (updated) schedule = loadSchedule();
    }
  }

  function setup() {
    user = pjs.getUser();
    var userRecord = pjs.query("SELECT * FROM users WHERE user = ?", user)[0];
    var displayUser = user;
    if (userRecord && userRecord.name) displayUser = userRecord.name;
    welcomeMessage = "Welcome back, " + displayUser + "!";
    avatar = "/avatar/user/" + user + ".png";
  }

  function showSchedule() {
    var day1Saved = day1;
    var day2Saved = day2;
    var day3Saved = day3;
    var daySchedule = {};
    if (day1) daySchedule = schedule[day1Key];
    if (day2) daySchedule = schedule[day2Key];
    if (day3) daySchedule = schedule[day3Key];
    data = JSON.stringify({
      daySchedule
    });
    display.schedule.execute();
    animation = "fade";
    if (!day1 && !day2 && !day3) {
      day1 = day1Saved;
      day2 = day2Saved;
      day3 = day3Saved;
    }
  }

  function handleMenu() {
    if (menuIcon) {
      display.menu.execute();
      animation = "slide-left";
      if (setFullSchedule) {
        fullSchedule = true;
        mySchedule = false;
      }
      if (setMySchedule) {
        fullSchedule = false;
        mySchedule = true;
      }
    }
    if (editProfile) {
      pjs.call("editUserBio.js");
      animation = "slide-right";
      setup();
      editProfile = false;
    }
  }

  function handleAttend() {
    if (!attend && !unattend) return;
    if (attend) {
      pjs.query("INSERT INTO attendance SET ?", { session_id, user });
    }
    else {
      pjs.query("DELETE FROM attendance WHERE session_id = ? AND user = ?", [session_id, user]);
    }
    schedule = loadSchedule();
  }

}

function loadSchedule() {
  var user = pjs.getUser();
  var schedule = {};
  var sessions = pjs.query("SELECT * FROM sessions ORDER BY day, start_time, end_time");
  sessions.forEach(session => {
    session.attending = (pjs.query("SELECT session_id FROM attendance WHERE user = ? and session_id = ?", [user, session.session_id]).length > 0);
    var speaker1 = session.speaker1;
    var speakerRecord = pjs.query("SELECT name FROM users WHERE user = ?", session.speaker1)[0];
    if (speakerRecord) speaker1 = speakerRecord.name;
    var speaker2 = session.speaker2;
    if (speaker2) {
      var speakerRecord = pjs.query("SELECT name FROM users WHERE user = ?", session.speaker2)[0];
      if (speakerRecord) speaker2 = speakerRecord.name;
    }
    session.speakers = speaker1;
    if (session.speakers === "PLUS") session.speakers = "";
    if (speaker2) session.speakers += " + " + speaker2;
    var dayKey = (session.day.getMonth() + 1) + "/" + session.day.getDate();
    if (!schedule[dayKey]) schedule[dayKey] = {};
    var time = String(session.start_time);
    if (!schedule[dayKey][time]) schedule[dayKey][time] = [];
    !schedule[dayKey][time].push(session);
  });
  return schedule;
}

exports.default = app;
