// This is a place holder for the initial application state.
const exampleList = [
  {
    id: 1,
    title: "test item 1",
    url: "contentpage.html",
    description: "This is the first test item",
    imgUrl: "/img/cool-pineapple.png"
  },
  {
    id: 2,
    title: "test item 2",
    url: "contentpage.html",
    description: "This is the second test item",
    imgUrl: "/img/cool-pineapple.png"
  },
  {
    id: 3,
    title: "test item 3",
    url: "contentpage.html",
    description: "This is the third test item",
    imgUrl: "/img/cool-pineapple.png"
  }
];

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

class TrendingItem extends React.Component {
  render() {
    const item = this.props.item;
    return (
      <tr>
        <th style={{ padding: 10 }}><a href={item.url}>{item.title}</a></th>
      </tr>
    );
  }
}

class TrendingCard extends React.Component {
  render() {
    const item = this.props.item;
    return (
      <div className="col">
        <div className="card card-body">
          <div className="card" style={{width: "18rem"}}>
            <img src={item.imgUrl} className="card-img-top" alt="..."></img>
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p class="card-text">{item.description}</p>
              <a href={item.url} className="btn btn-primary">Go to the page</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class TrendingTableProt extends React.Component {
  render() {
    const trendingItems = this.props.exampleList.map(item => (
      <TrendingItem key={item.id} item={item} />
    ));
    return (
      <table style={{ width: '100%'}}>
        <thread>
          <tr>
          <th style={{ padding: 10 }}><h2>What's Popular</h2></th>
          </tr>
        </thread>
        <tbody>{trendingItems}</tbody>
      </table>
    );
  }
}

class TrendingCardProt extends React.Component {
  render() {
    const trendingCards = this.props.exampleList.map(item => (
      <TrendingCard key={item.id} item={item} />
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

  <div className="modal fade" id="howItWorksModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
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
  <form id='searchform'>
    <div className="form-row justify-content-md-center">
      <div className="col-md-4">
        <input type='text' className="form-control" placeholder='Enter a search term here'/>
      </div>
      <a href="/contentpage.html" id='search-btn' className="btn btn-success">Search</a>
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

class SearchPage extends React.Component {
  constructor() {
    super();
    this.state = {exampleList: exampleList};
  }

  render() {
    return (
      <div>
          <TitleLogo />
          <SearchForm />
          <TrendingTableProt exampleList={this.state.exampleList} />
          <hr />
          <TrendingCardProt exampleList={this.state.exampleList} />
      </div>
    );
  }
}

// This renders the JSX component inside the content node:
ReactDOM.render(<SearchPage />, contentNode);
