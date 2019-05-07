import React from 'react';

export default class TrendingCard extends React.Component{
    constructor(props){
        super(props);
        this.props = props;
    }

    render(){
        const item = this.props.item;
        const yturl = 'https://youtube.com/watch?v=' + item.ytId;
        const ytimg = 'http://i3.ytimg.com/vi/' + item.ytId + '/hqdefault.jpg';
        return (
          <div className="col" style={{width: "33%"}}>
            <div className="card card-body">
              <div className="card">
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