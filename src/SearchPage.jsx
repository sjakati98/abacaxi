// This is a place holder for the initial application state.
const state = [

];

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

let TrendingTable = (props) => (

  <div id='trending-bar'>
    <table style={{ width: '100%'}}>
      <tr>
        <th style={{ padding: 10 }}><h2>What's New</h2></th>
        <th style={{ padding: 10 }}><h2>What's Popular</h2></th>
        <th style={{ padding: 10 }}><h2>Something Random</h2></th>
      </tr>
      <tr>
        <th style={{ padding: 10 }}><a href="contentpage.html">Link1</a></th>
        <th style={{ padding: 10 }}><a href="contentpage.html">Link1</a></th>
        <th style={{ padding: 10 }}><a href="contentpage.html">Link1</a></th>
      </tr>
      <tr>
        <th style={{ padding: 10 }}><a href="contentpage.html">Link2</a></th>
        <th style={{ padding: 10 }}><a href="contentpage.html">Link2</a></th>
        <th style={{ padding: 10 }}><a href="contentpage.html">Link2</a></th>
      </tr>
      <tr>
        <th style={{ padding: 10 }}><a href="contentpage.html">Link3</a></th>
        <th style={{ padding: 10 }}><a href="contentpage.html">Link3</a></th>
        <th style={{ padding: 10 }}><a href="contentpage.html">Link3</a></th>
      </tr>
    </table>
  </div>

);

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
        <button id='search-btn' className="btn btn-success">Search</button>
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
  }

  render() {
    return (
      <div>
          <TitleLogo />
          <SearchForm />
          <TrendingTable />
      </div>
    );
  }
}

// This renders the JSX component inside the content node:
ReactDOM.render(<SearchPage />, contentNode);
