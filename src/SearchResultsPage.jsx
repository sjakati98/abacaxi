import React from 'react';
import { Link } from 'react-router';


function Result(props) {
  return (
    <div className="container" style={{paddingBottom: '8px', marginBottom: '12px', borderBottom: "1px solid grey"}}>
      <div className="row">
        <Link to={`/wiki/${props.result.wikiPageId}`} className="col-12" ><h2>{props.result.title}</h2></Link>
        <p className="col-12">{props.result.desc}</p>
      </div>
    </div>
  );
}

export default class SearchResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: decodeURIComponent(this.props.params.query),
      results: null
    };
    this.wikiAPIBase = "https://en.wikipedia.org/w/api.php?format=json&origin=*";
    this.gen_search_url = () => { return `${this.wikiAPIBase}&action=opensearch&search=${encodeURIComponent(this.state.search)}`; };
    this.gen_query_url = (title) => { return `${this.wikiAPIBase}&action=query&redirects=1&titles=${title}`; };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch(this.gen_search_url()).then(response => {
      if (response.ok) {
        response.json().then(parsedata => {
          if (parsedata[1].length == 0){ // handle no search results found
            this.setState({ results: [] });
            return;
          } 

          let results = [];
          for(let i=0; i < parsedata[1].length; i++){
            fetch(this.gen_query_url(parsedata[1][i])).then(response => {
              if (response.ok) {
                response.json().then(querydata => {
                  results.push({
                    title: parsedata[1][i],
                    desc: parsedata[2][i],
                    wikiLink: parsedata[3][i],
                    wikiPageId: Object.keys(querydata.query.pages)[0]
                  });
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

SearchResultsPage.propTypes = {
  params: React.PropTypes.object.isRequired,
};
