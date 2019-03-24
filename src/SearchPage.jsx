// This is a place holder for the initial application state.
const state = [

];

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

class MyComponent extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        
        <div id='bigtitle' style={titlestyle}>
          <h1>Abacaxi</h1>
        </div>

        <div id='logo'>
          <center><img src='/img/pineapple-512.jpg'></img></center>
        </div>

        <div id='search-bar' style={searchbarstyle}>
          <form name='search-form'>
            <input type='text' name='search-text' style={searchtextstyle} placeholder='Enter a search term here'/>
            <button id='search-btn'>Search</button>
          </form>
        </div>

        <div id='trending-bar'>
          <table style={{ width: '100%'}}>
            <tr>
              <th style={{ padding: 10 }}><h2>What's New</h2></th>
              <th style={{ padding: 10 }}><h2>What's Popular</h2></th>
              <th style={{ padding: 10 }}><h2>Something Random</h2></th>
            </tr>
            <tr>
              <th style={{ padding: 10 }}>Link1</th>
              <th style={{ padding: 10 }}>Link1</th>
              <th style={{ padding: 10 }}>Link1</th>
            </tr>
            <tr>
              <th style={{ padding: 10 }}>Link2</th>
              <th style={{ padding: 10 }}>Link2</th>
              <th style={{ padding: 10 }}>Link2</th>
            </tr>
            <tr>
              <th style={{ padding: 10 }}>Link3</th>
              <th style={{ padding: 10 }}>Link3</th>
              <th style={{ padding: 10 }}>Link3</th>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}



//Manual CSS Styles, need to change later
//TODO: Use stylesheet or more elegant solution for css styling

const titlestyle = {
  'text-align': 'center'
};

const logostyle = {
  'display': 'block',
  'margin-left': 'auto',
  'margin-right': 'auto',
  'width': '25%',
  'height': 'auto',
  'border-radius': '20px'
};

const searchtextstyle = {
  'width': '20%'
}

const searchbarstyle = {
  'text-align': 'center'
}


// This renders the JSX component inside the content node:
ReactDOM.render(<MyComponent />, contentNode);
