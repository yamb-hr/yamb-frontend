import AuthService from "./auth-service";

const API_URL = process.env.REACT_APP_API_URL + "/scores";

const ScoreService = {

    getByInterval: function(interval) {
        return fetch(API_URL + '/interval', {
            body: JSON.stringify({ interval: interval }),
            credentials: 'same-origin',
            headers: {
                'Authorization': 'Bearer ' + AuthService.getCurrentPlayer()?.token
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

    getDashboardData: function() {
        return fetch(API_URL + '/dashboard', {
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

    getScoreById: function(scoreId) {
        return fetch(API_URL + '/' + scoreId, {
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

    getScores: function(size = 10, page = 0, order = 'id', direction = 'asc') {
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

export default ScoreService;