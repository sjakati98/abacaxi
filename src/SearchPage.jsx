import React from 'react';
import TitleLogo from './components/TitleLogo.jsx';
import SearchForm from './components/SearchForm.jsx';
import TrendingBar from './components/TrendingBar.jsx';

// This is a place holder for the initial application state.

export default class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSearch = this.handleSearch.bind(this);
    this.loadRendingData = this.loadRendingData.bind(this);
  }

  componentDidMount() {
    this.loadRendingData();
    console.log("component mounted");
    console.log(this.state.trendingData);
  }

  loadRendingData() {
    fetch('/api/trending', {
      method: 'get'
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.setState({ trendingData: json.videos });
          console.log("Data should be saved");
        }
        else {
          alert('Failed to get trending videos.\n Error description: ' + json.msg);
        }
      });
  }

  handleSearch(e){
    e.preventDefault();
    let form = document.forms.searchForm;
    this.props.router.push({ pathname: '/search/'+encodeURIComponent(form.searchQuery.value)});
  }

  render() {
    let loadingTrending = <h1>......Loading......</h1>
    let trendingBar = (this.state.trendingData != null) ? <TrendingBar trendingData={this.state.trendingData} /> : loadingTrending
    return (
      <div>
          <TitleLogo />
          <SearchForm handleSearch={this.handleSearch}/>
          <hr />
          {trendingBar}
      </div>
    );
  }
}