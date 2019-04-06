// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

function Result(props) {
  return (
    <div className="container" style={{paddingBottom: '8px', marginBottom: '12px', borderBottom: "1px solid grey"}}>
      <div className="row">
        <a href={`/wiki/${props.result.wikiPageId}`} className="col-12" ><h2>{props.result.title}</h2></a>
        {/*<Link to={`/wiki/${props.result.wikiPageId}`} className="col-12" ><h2>{props.result.title}</h2></Link>*/}
        <p className="col-12">{props.result.desc}</p>
      </div>
    </div>
  );
}

class SearchResultsPage extends React.Component {
  constructor() {
    super();
    this.state = { 
      search: "Algebra", // this will be passed via the router in phase 3
      results: null
    };
    this.wikiAPIBase = "https://en.wikipedia.org/w/api.php?format=json&origin=*";
    this.gen_search_url = () => { return `${this.wikiAPIBase}&action=opensearch&search=${encodeURIComponent(this.state.search)}`; };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch(this.gen_search_url()).then(response => {
      if (response.ok) {
        response.json().then(data => {
          let results = []
          for(let i=0; i < data[1].length; i++){
            results.push({
              title: data[1][i],
              desc: data[2][i],
              wikiLink: data[3][i],
              wikiPageId: ""
            });
          }
          this.setState({ results: results });
        });
      } else {
        response.json().then(error => {
          alert("Failed to fetch issues:" + error.message)
        });
      }
    }).catch(err => {
      alert("Error in fetching data from server:", err);
    });
  }

  render() {
    let resultComps = <h2>Loading...</h2>
    if(this.state.results === null){
      resultComps = <h2>Loading...</h2>
    } else if (this.state.results.length == 0){
      resultComps = <h2>No results found.</h2>
    } else if(this.state.results.length > 0){
      resultComps = this.state.results.map(result => (
        <Result key={result.title} result={result} />
      ));
    }
    return (
      <div className="container">
        <h1>Results for "{decodeURIComponent(this.state.search)}"</h1>
        <hr />
        {resultComps}
      </div>
    );
  }
}

// This renders the JSX component inside the content node:
ReactDOM.render(<SearchResultsPage />, contentNode);
