var cc = DataStudioApp.createCommunityConnector();

function getAuthType() {
  var AuthTypes = cc.AuthType;
  return cc
    .newAuthTypeResponse()
    .setAuthType(AuthTypes.KEY)
    .setHelpUrl('https://sendgrid.com/docs/API_Reference/Web_API_v3/How_To_Use_The_Web_API_v3/authentication.html#-API-key-recommended')
    .build();
}

function resetAuth() {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.deleteProperty('dscc.key');
}

function isAuthValid() {
  var userProperties = PropertiesService.getUserProperties();
  var key = userProperties.getProperty('dscc.key');
  return checkForValidKey(key);
}

function setCredentials(request) {
  var key = request.key;
  var validKey = checkForValidKey(key);
  if (!validKey) {
    return {
      errorCode: 'INVALID_CREDENTIALS'
    };
  }
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('dscc.key', key);
  return {
    errorCode: 'NONE'
  };
}

function checkForValidKey(key) {
  var token = key;
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var baseURL = 'https://api.sendgrid.com/v3/stats?start_date=' + today;
  var options = {
    'method': 'GET',
    'headers': {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch(baseURL, options);
  if (response.getResponseCode() == 200) {
    return true;
  } else {
    return false;
  }
}
