import React from "react";
import './Metronome.css';

import click_1 from "./click1.wav";
import click_2 from "./click2.wav";
import minusSign from "./minus-image.png";
import plusSign from "./plus-image.png";

class Metronome extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          active: false,
          bpm: 140,
          perMeasure: 4,
          currentBeat: 0,
          calculating: false,
          times: [],
          measure: "",
        };
      };
    
    
      
      // BPM slider
      changeBPM = event => {
        const bpm = event.target.value;
        this.setState({
          bpm: bpm,
          currentBeat: 0,
        }, this.resetPlay); 
      }
    
   
      selectChange = event => {
        this.setState({perMeasure: event.target.value});
        this.restartPlay();
      }
    
      // Pause/Play handler
      startStop(){
        const {active, bpm} = this.state;
        //pause
        if(active){
          clearInterval(this.interval);
          this.setState({
            active: false,
            currentBeat: 0,
            measure: "",
          });
        }
        //play
        else{
          this.setState({
            active: true,
            currentBeat: 0,
            measure: "",
          });
          this.interval = setInterval(() => {
            this.playClick();
          }, ((60/bpm)*1000));
        }
      }
    
      // Click sound with visual represenation for emphasis
      playClick(){
        const {perMeasure, currentBeat, measure} = this.state;
        let temp = "";
        
        if (currentBeat % perMeasure === 0) {
          const click1 = new Audio(click_1);
          click1.play();
          
          if (currentBeat % (perMeasure*2) === 0) {
            temp = "● ";
          }
          else{
            temp = measure + "●";
          }
        }
        else{
          const click2 = new Audio(click_2);
          click2.play();
          if (perMeasure == 0 && measure.length > 10){
            temp = "○";
          }
          else{
            temp = measure + "○ ";
          }
        }
        this.setState({
          // increase symbol
          measure: temp,
          // increase beat
          currentBeat: currentBeat + 1,
        });
      }
    
      // Calulating BPM
      setBPM(){
        // play sound when button is pressed
        this.playClick();
        // get time
        const date = new Date();
        const time = date.getTime();
        // add time to times array at the end
        const {times, perMeasure} = this.state;
        let newTimes = times;
        newTimes.push(time);
        newTimes = newTimes.slice((perMeasure * 2) * -1);
        this.setState({
          calculating: true,
          times: newTimes,
        });
        this.calculateBPM();
        setTimeout(() => this.checkTimeout(time), 2000);
      }
    
      
      checkTimeout(time){
        const {active, times} = this.state;
        let lastTime = times.at(-1);
        if(time === lastTime){
          this.setState({
            calculating: false,
            // reset times array
            times: [],
          });
          if(!active){
            this.setState({
              currentBeat: 0,
              measure: "",
            });
          }
    
        }
      }
    
      // calculate BPM
      calculateBPM(){
        const {times} = this.state;
        if (times.length > 1){
          let sumOfGaps = 0;
          for (let i = 1; i < times.length; i++){
            sumOfGaps = sumOfGaps + (times[i] - times[i-1]);
          }
          let average = sumOfGaps/(times.length-1)
          let bpm = Math.round((1000/average)*60);
          if(bpm > 240){bpm = 240;}
          if(bpm < 35){bpm = 35;}
          this.setState({bpm: bpm});
          //^boundaries set
        }
      }
    
      // BPM Adjustment 
      plusMinus(x){
        const {bpm} = this.state;
        let temp = parseInt(bpm) + x; //
        if(temp > 240){temp = 240;}
        if(temp < 35){temp = 35;}
        this.setState({bpm: temp});
        this.resetPlay();
        //boundaries set
      }
    
      restartPlay(){
        const {active, bpm} = this.state;
        if(active){
          // StartNewInterval
          clearInterval(this.interval);
          this.interval = setInterval(() => {
            this.playClick();
          }, ((60/bpm)*1000));
        }
      }

  render(){
    const {active, bpm, perMeasure, calculating, measure} = this.state;
    return (
      <div className = "metronome">
        <div className = "bpm">
          <div><span className = {calculating ? "activeBPM" : null}>{bpm}</span> BPM</div>
          <div className = "sliderContainer">
            <input type="image" src={minusSign} className = "plusMinus" onClick = {() => this.plusMinus(-1)}/>
            <input type = "range" min = "35" max = "240" className = "slider" value = {bpm} onChange = {this.changeBPM}/>
            <input type="image" src={plusSign} className = "plusMinus" onClick = {() => this.plusMinus(1)}/>
          </div>
        </div>
        <button onClick = {() => this.setBPM()}>
        {active ? "Tap Tempo": 'Tap Tempo'} 
        </button>
        <button onClick = {() => this.startStop()}>
        {active ? 'Stop' : 'Start'}
      </button>
        <div className = "timeSignature">
          Beat Emphasis: &nbsp;
          <select className = "beatEmphasis" onChange = {this.selectChange} value = {perMeasure}>
            <option value = "0">0</option>
            <option value = "2">2</option>
            <option value = "3">3</option>
            <option value = "4">4</option>
            <option value = "5">5</option>
            <option value = "6">6</option>
            <option value = "7">7</option>
            <option value = "8">8</option>
            <option value = "9">9</option>
          </select>
        </div>
        <span className = "Emphasis">{measure}</span>
      </div>
    );
  }
}






export default Metronome;
