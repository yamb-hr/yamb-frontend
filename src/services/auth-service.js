const API_URL = process.env.REACT_APP_API_URL + "/auth";

const AuthService = {

    getCurrentPlayer: function() {
        try {
            return JSON.parse(localStorage.getItem("player"));
        } catch (error) {
            console.error(error);
            this.logout();
        }
    },

    logout: function() {
        localStorage.clear();
    },

    login: function(authRequest) {
        return fetch(API_URL + '/login', {
            body: JSON.stringify(authRequest),
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors'
        })
        .then(response => {
            if (response.ok) {
                return response.json().then(body => body.data);
            }
            return response.json().then(error => { 
                console.error(error);
                throw new Error(error.message);
            });
        });
    },

    register: function(authRequest) {
        return fetch(API_URL + '/register', {
            body: JSON.stringify(authRequest),
            credentials: 'same-origin',
            headers: {
                'Authorization': 'Bearer ' + AuthService.getCurrentPlayer()?.token, // in case a user was already logged in as a temp player
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors'
        })
        .then(response => {
            if (response.ok) {
                return response.json().then(body => body.data);
            }
            return response.json().then(error => { 
                console.error(error);
                throw new Error(error.message);
            });
        });
    },

    createTempPlayer: function(tempPlayerRequest) {
        return fetch(API_URL + '/temp-player', {
            body: JSON.stringify(tempPlayerRequest),
            credentials: 'same-origin',
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST',
            mode: 'cors'
        })
        .then(response => {
            if (response.ok) {
                return response.json().then(body => body.data);
            }
            return response.json().then(error => { 
                console.error(error);
                throw new Error(error.message);
            });
        });
    }
}

export default AuthService;
