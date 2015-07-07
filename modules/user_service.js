var theusername = "synne";

var set_username = function(username) {
    console.log("Setting username to: ", username);
    theusername = username;
};

var get_username = function() {
    return theusername;
};

exports.set_username = set_username;
exports.get_username = get_username;