import React from 'react';
import './LocalPlaylistItem.css';

class LocalPlaylistItem extends React.Component {
    constructor(props) {
      super(props);
      this.handleSelectPlaylist = this.handleSelectPlaylist.bind(this);
    }

    handleSelectPlaylist() {
      this.props.selectPlaylist(this.props.id, this.props.name);
    }

    render() {
      return (
      <div className="LocalPlaylistItems" onClick={this.handleSelectPlaylist}>
        <div className="LocalplaylistItem-info">
          <h3>{this.props.name}</h3>
        </div>
      </div>
      )
    }
}

export default LocalPlaylistItem;