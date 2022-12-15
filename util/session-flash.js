// save data to session
function flashDataToSesion(req, data, action) {
  req.session.flashedData = data;
  req.session.save(action);
}

// get data from session
function getSessionData(req) {
  const sessionData = req.session.flashedData;
  req.session.flashedData = null;
  return sessionData;
}

module.exports = { flashDataToSesion, getSessionData };
