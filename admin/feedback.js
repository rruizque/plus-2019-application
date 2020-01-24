
function feedback(request, response) {;
  let sessions = pjs.query("SELECT session_id, title, speaker1, speaker2 FROM sessions");

  sessions.forEach(session => {
    session.feedback = pjs.query("SELECT user, comment FROM feedback WHERE session_id = ?", session.session_id);
    session.ratings = pjs.query("SELECT user, rating FROM ratings WHERE session_id = ?", session.session_id);
  });

  // Must be admin
  let user = pjs.getUser();
  if (user && pjs.query("SELECT count(user) as count FROM admins WHERE user = ?", user)[0].count === 1) {
    response.render("admin/feedback.ejs", { sessions });
  }
  else {
    response.send("You are not authorized.");
  }

}

exports.default = feedback;