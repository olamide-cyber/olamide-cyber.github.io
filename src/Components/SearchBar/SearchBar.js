import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchTerm: ''
        };

        this.search = this.search.bind(this);

        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search(event) {
        event.preventDefault();
        this.props.onSearch(this.state.searchTerm)
    }

    handleTermChange(event) {
        this.setState({
            searchTerm: event.target.value
        })
    }

    render() {
        return (
                <form  className="SearchBar" onSubmit={this.search}>
                    <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
                    <button type="submit" className="SearchButton" onClick={this.search}>SEARCH</button>
                </form>
        );
    }
}

export default SearchBar