
function formatTime(time) {
  var parts = time.split(":");
  var ampm = "AM";
  parts[0] = Number(parts[0]);
  if (parts[0] >= 12) ampm = "PM";
  if (parts[0] >= 13) parts[0] -= 12;
  return parts[0] + ":" + parts[1] + " " + ampm;
}

function attend(flag, id) {
  pui.set("session_id", id);
  pui.click(flag ? "attend" : "unattend");
}

function showDetail(id) {
  pui.set("session_id", id);
  pui.click("showDetail");
}

function captureScrollTop() {
  var toScroll = getObj("scheduleHtml").parentElement;
  var scrollTop = toScroll.scrollTop;
  scrollTop = Math.round(scrollTop);
  pui.set("scrollTop", scrollTop);
}

function setScrollTop() {
  var toScroll = getObj("scheduleHtml").parentElement;
  if (!toScroll) return;
  var scrollTop = Number(pui.get("scrollTop"));

  if (!isNaN(scrollTop) && scrollTop > 0) {
    toScroll.scrollTop = scrollTop;
  }

  toScroll.addEventListener("scroll", captureScrollTop);
}
