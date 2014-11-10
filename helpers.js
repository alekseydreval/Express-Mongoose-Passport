var _ = require('lodash');

/*
 This file contains helpers functions which
 will be directly available from views
 */


module.exports._formatDate = function(d) {
  return d.getDate() + '/' + d.getMonth() + '/' + d.getFullYear();
}

// Prettify errors output from mongoose
module.exports._showErrors = function(errorObject) {
  if(!errorObject.length)
    return "";
  else {
    errorObject = errorObject[0];
    if(typeof errorObject == 'string')
      return errorObject;
    else {
      var msgList = _.map(errorObject, function(v,_) { return [v.path, v.type].join(' '); });
      return msgList.join('<br/>');
    }
  }
}

module.exports._isActive = function(url, page) {
  if(url.match(page))
    return 'active';
  else
    return '';
}
