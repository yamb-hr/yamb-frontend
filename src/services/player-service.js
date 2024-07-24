import AuthService from "./auth-service";

const API_URL = process.env.REACT_APP_API_URL + "/players";

const PlayerService = {

    getPrincipalById: function(playerId) {
        return fetch(API_URL + "/" + playerId + "/principal", {
            body: null,
            credentials: 'same-origin',
            headers: {
                'Authorization': 'Bearer ' + AuthService.getCurrentPlayer()?.token
            },
            method: 'GET',
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

    getPlayerById: function(playerId) {
        return fetch(API_URL + '/' + playerId, {
            body: null,
            credentials: 'same-origin',
            headers: {
                'Authorization': 'Bearer ' + AuthService.getCurrentPlayer()?.token
            },
            method: 'GET',
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

    getPlayers: function(size = 10, page = 0, order = 'id', direction = 'asc') {
        return fetch(API_URL + '?size=' + size +'&page=' + page + '&sort=' + order + '&direction=' + direction, {
            body: null,
            credentials: 'same-origin',
            headers: {
                'Authorization': 'Bearer ' + AuthService.getCurrentPlayer()?.token
            },
            method: 'GET',
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

}

export default PlayerService;