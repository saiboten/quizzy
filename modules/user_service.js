var set_username = function(req,username) {
    req.session.username = username;
    console.log("Setting username to: ", username);
    console.log("Getting username: ", get_username(req));
};

var get_username = function(req) {
    console.log("Username is: ", req.session.username);
    return req.session.username;
};

exports.set_username = set_username;
exports.get_username = get_username;