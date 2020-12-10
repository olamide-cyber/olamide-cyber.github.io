import React from 'react';
import Spotify from '../../util/Spotify';
import 	LocalPlaylistItem from '../LocalPlaylistItem/LocalPlaylistItem';
import './LocalPlaylist.css'


class LocalPlaylist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: []
        }
    }

    componentWillMount() {
        Spotify.getUserPlaylists()
        .then(playlists => {
            this.setState({
                playlists: playlists
            })
        })
    }

    render() {
        return (
            <div className="LocalPlaylist">
                <h2>Local Playlists</h2>    
                {
                    this.state.playlists.map(playlist => {
                        return <LocalPlaylistItem id={playlist.id}
                        key={playlist.id}
                        name={playlist.name}
                        selectPlaylist={this.props.selectPlaylist} />
                    })
                }
            </div> 
        )
    }
}


export default LocalPlaylist;