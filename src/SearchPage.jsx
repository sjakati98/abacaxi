import React from 'react';

// This is a place holder for the initial application state.

class TrendingCard extends React.Component {
  render() {
    const item = this.props.item;
    const yturl = 'https://youtube.com/watch?v=' + item.ytId;
    const ytimg = 'http://i3.ytimg.com/vi/' + item.ytId + '/hqdefault.jpg';
    return (
      <div className="col">
        <div className="card card-body">
          <div className="card" style={{width: "18rem"}}>
            <img src={ytimg} className="card-img-top" alt="..."></img>
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text">Very Popular with {item.upvotes} likes!</p>
              <a href={yturl} className="btn btn-primary">Go to the Youtube page</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TrendingCardProt extends React.Component {
  render() {
    const trendingCards = this.props.trendingData.map(item => (
      <TrendingCard key={item.ytId} item={item} />
    ));
    return (
      <div className="row">
        <div className="col">
          <p>
            <a data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
              <h2>See Popular Sites</h2>
            </a>
          </p>
          <div className="collapse" id="collapseExample">
            <div className="row">
              {trendingCards}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


let InfoModal = (props) => (

  <div className="modal fade" id="howItWorksModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLongTitle">How Abacaxi Works</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <ul id='howItWorksList'>
            <li>Abacaxi works by taking your entered search term and attempting to match it to a content page stored in the database.</li>

            <li>Each content page is constructed from an existing Wiki Page's structure and populated with videos from the internet that Abacaxi's community feels best explains or describes the main topic and its subsequent subtopics or child topics.</li>

            <li>Users of Abacaxi can similarly submit their own suggestions and vote on such videos to provide their own input.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>

);

let SearchForm = (props) => (
      <form id='searchForm' onSubmit={props.handleSearch}>
        <div className="form-row justify-content-md-center">
          <div className="col-md-4">
            <input type='text' id='searchQuery' className="form-control" placeholder='Enter a search term here'/>
          </div>
          <button type="submit" id='search-btn' className="btn btn-success">Search</button>
          <button type="button" className="btn btn-outline-dark" data-toggle="modal" data-target="#howItWorksModal" id="howItWorksBtn">?</button>
          <InfoModal />
        </div>
      </form>
    );

let TitleLogo = (props) => (
  <div>
    <div id='bigtitle'>
      <p id='appname'>Abacaxi</p>
      <p id='appsubname'>The Spiky Fruit Of Knowledge</p>
    </div>
    <div id='logo'>
      <center><img src='/img/cool-pineapple.png'></img></center>
    </div>
  </div>
);

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
    let trendingBar = (this.state.trendingData != null) ? <TrendingCardProt trendingData={this.state.trendingData} /> : loadingTrending
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