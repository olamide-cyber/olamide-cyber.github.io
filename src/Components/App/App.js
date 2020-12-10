import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import LocalPlaylist from '../LocalPlaylist/LocalPlaylist';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],

      playlistName: 'New Playlist',

      playlistTracks: [],

      playlistId: null,

      playListTracksToRemove: [],

      playListTracksToAdd: []
    };

    this.addTrack = this.addTrack.bind(this);

    this.removeTrack = this.removeTrack.bind(this);

    this.updatePlaylistName = this.updatePlaylistName.bind(this);

    this.savePlaylist = this.savePlaylist.bind(this);

    this.search = this.search.bind(this);

    this.selectPlaylist = this.selectPlaylist.bind(this);
  };

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    console.log('Add Track>>', tracks)
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      tracks.push(track)
    }
    this.setState({ playlistTracks: tracks});
    if (this.state.playlistId) {
      this.state.playListTracksToAdd.push(track);
      console.log('Tracks to Add 1>>', track)
    }
  };

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({ playlistTracks: tracks });
    if (this.state.playlistId) {
      this.state.playListTracksToRemove.push(track);
      console.log('Tracks to remove>>>', track)
    }
  };

  updatePlaylistName(name) {
    this.setState({ playlistName: name })
  };

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({
        searchResults: searchResults
      })
    })
  };

  savePlaylist() {
    let trackUris = this.state.playlistTracks.map(track => track.uri);
    console.log('1.savePlaylist>>>', trackUris, this.state.playlistName);
    Spotify.savePlaylist(this.state.playlistName, trackUris, this.state.playlistId, this.state.playListTracksToRemove, this.state.playListTracksToAdd)
    .then(() => {
      this.setState({ 
        playlistName: 'New Playlist',
        playlistTracks: [],
        playlistId: null,
        playListTracksToRemove: [],
        playListTracksToAdd: []
      })
    }).catch(error => {
      alert(error.message)
    })
  };

  async selectPlaylist(playlistId, playlistName) {
    const playlist = await Spotify.getPlaylist(playlistId) 
    // console.log('Tracks>>', playlist)
    // console.log('Track PlaylistName>>', playlistName)
    this.setState({
      playlistName: playlistName,
      playlistTracks: playlist.tracks,
      playlistId: playlistId
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <Playlist 
            playlistName={this.state.playlistName}
            playlistTracks={this.state.playlistTracks}
            onRemove={this.removeTrack}
            onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist}  />
            <LocalPlaylist selectPlaylist={this.selectPlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;


