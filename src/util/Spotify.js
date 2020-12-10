const clientID = 'bb9b06f53c6f4e4a87c1881ac20cbda9';
const redirectURI =  'http://jam-webapp.surge.sh';

let accessToken;
let userId;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // checking for access token match

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
             accessToken = accessTokenMatch[1];
             const expiresIn = Number(expiresInMatch[1]);

            // This clears the parameters from the URL, so the app doesn’t try grabbing the access token after it has expired

             window.setTimeout(() => accessToken = '', expiresIn * 1000);
             window.history.pushState('Access Token', null, '/');

             return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessUrl;
        }
    },

    async search(term) {
        const accessToken = Spotify.getAccessToken()
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    },

    async removePlaylistTracks(tracks, playlistId) {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };

        const tracksUri = tracks.map(track => {
            return {
                uri: track.uri
            }
        })

        const removeResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'DELETE',
            body: JSON.stringify({ tracks: tracksUri })
        })

        return removeResponse;
    },

    async addPlaylistTracks(tracks, playListId) {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };

        const trackUris = tracks.map(track => track.uri)

        const addResponse = await fetch(`https://api.spotify.com/v1/playlists/${playListId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackUris })
        })

        return addResponse
    },

    async savePlaylist(playlistName, trackUris, playlistId, tracksToRemove, tracksToAdd) {
        console.log('2.playlist name>>>', playlistName);
        console.log('trackUris>>>', trackUris.length);
        if(!playlistName || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userID;

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: headers
        });
        const jsonResponse = await response.json();
        userID = jsonResponse.id;

        if (playlistId) {
            const nameResponse = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}`, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify({ name: playlistName })
            })

            if (tracksToRemove.length) {
                await Spotify.removePlaylistTracks(tracksToRemove, playlistId)
            }

            if (tracksToAdd.length) {
                await Spotify.addPlaylistTracks(tracksToAdd, playlistId)
            }

            return nameResponse;
        } else {
            const response_1 = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: playlistName })
            });
            const jsonResponse_1 = await response_1.json();
            const playlistID = jsonResponse_1.id;
            const response_2 = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackUris })
            });
            const jsonResponse_2 = await response_2.json();
            return jsonResponse_2
        }

    }, 

    getCurrentUserId() {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };

        if (userId) {
            return Promise.resolve(userId);
        }
        return fetch('https://api.spotify.com/v1/me', { headers: headers })
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id
            return userId
        })
    },

    async getUserPlaylists() {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const userId = await Spotify.getCurrentUserId();

        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, { headers: headers });
        const jsonResponse = await response.json();
        return jsonResponse.items.map(playlists => ({
            id: playlists.id,
            name: playlists.name
        }));

    },

    async getPlaylist(id) {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const userId = await Spotify.getCurrentUserId();

        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${id}/tracks`, { headers: headers});
        const jsonResponse = await response.json();

        const tracks = jsonResponse.items.map((playlistTrack) => ({
            id: playlistTrack.track.id,
            name: playlistTrack.track.name,
            artist: playlistTrack.track.artists[0].name,
            album: playlistTrack.track.album.name,
            uri: playlistTrack.track.uri
        }));

        return {
            id: id,
            tracks: tracks
        }
    },

    
};



export default Spotify;

