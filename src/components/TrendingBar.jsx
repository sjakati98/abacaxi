import React from 'react';
import TrendingCard from './TrendingCard.jsx';

export default class TrendingBar extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
    }
    
    render() {
        const trendingCards = this.props.trendingData.map(item => (
          <TrendingCard key={item.ytId} item={item} />
        ));
        return (
          <div className="row">
            <div className="col">
              <p>
                <a className="btn btn-primary" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                  <h2>See Popular Sites</h2>
                </a>
              </p>
              <div className="collapse" id="collapseExample">
                <div className="row" style={{width: "95%"}}>
                  {trendingCards}
                </div>
              </div>
            </div>
          </div>
        );
      }
}