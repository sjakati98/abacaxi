import React from 'react';

export default class TitleLogo extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
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
    }
}