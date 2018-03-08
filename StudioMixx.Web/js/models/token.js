var token = (function () {

    var token = '';

    var getToken = function () {
        return token;
    }

    var setToken = function (tk) {
        token = tk;
    }


    return {
        getToken: getToken,
        setToken : setToken
    };
});