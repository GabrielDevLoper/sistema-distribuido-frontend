import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import { loadModels, getFullFaceDescription } from '../../services/face';
import api from '../../services/api';
import { Redirect } from 'react-router'
import './App.css';


const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

 

class VideoInput extends Component {
  
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.contador = 0;
    this.state = {
      fullDesc: null,
      detections: null,
      descriptors: null,
      match: null,
      facingMode: null,
      img:null,
      found:null,
      Redirect: false
    };
  }


  componentWillMount = async () => {
    await loadModels();

    
    
    this.setInputDevice();
  };


  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === 'videoinput'
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: 'user'
        });
      } else {
        await this.setState({
          facingMode: { exact: 'environment' }
        });
      }
      this.startCapture();
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
   
    if (!!this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then(fullDesc => {
        if (!!fullDesc) {
          this.setState({
            detections: fullDesc.map(fd => fd.detection),
          });
        }
        /*Condição tira um foto em base64 e enviar para rota '/procurar'*/
        if(fullDesc.length !== 0 && this.contador === 0 ){
          this.img = this.webcam.current.getScreenshot();
          const image = this.img;
         
            const data = new FormData();
            data.append('myfile_procurar', image);
            api.post('/show-users', data).then(async response => {
            const responseResult = response.data.message;

            if(responseResult){
              await this.setState({
                found:response.data.message
                
              }); 
            }else {
              await this.setState({
                found:response.data[0].name
                
              }); 
            }
            });

          this.contador+=1;
    
          setTimeout(() => {
            this.setState({
              redirect: true
            })
         }, 4000); 
         
        }
        
        /*Fim da condição tirar foto*/
      });
    }
  };

  render() {
    const { detections, match, facingMode, found } = this.state;
    let videoConstraints = null;

    if(this.state.redirect) {
      return <Redirect to="/" />
    }

    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode
      };
    }

    let drawBox = null;
    if (!!detections) {
      drawBox = detections.map((detection, i) => {
        let _H = detection.box.height;
        let _W = detection.box.width;
        let _X = detection.box._x;
        let _Y = detection.box._y;
        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                border: 'solid',
                borderColor: 'red',
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`
              }}
            >
              {!!match && !!match[i] ? (
                <p
                  style={{
                    backgroundColor: 'blue',
                    border: 'solid',
                    borderColor: 'blue',
                    width: _W,
                    marginTop: 0,
                    color: '#fff',
                    transform: `translate(-3px,${_H}px)`
                  }}
                >
                  {match[i]._label}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
    }

    return (
      <div
        className="Camera"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop:20
        }}
      >
          <div>
              <h1 className="found">
              {
                
                found ? found : "Posicione o rosto"
              }
            </h1>
          </div>

          <div
          style={{
            width: WIDTH,
            height: HEIGHT
          }}
        >
          <div style={{ position: 'relative', width: WIDTH }}>
            {!!videoConstraints ? (
              <div style={{ position: 'absolute' }}>
                <Webcam
                  audio={false}
                  width={WIDTH}
                  height={HEIGHT}
                  ref={this.webcam}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
              </div>
            ) : null}
            {!!drawBox ? drawBox : null}
          </div>
        </div>
        <Link to="/form" className="btnCadastrarCliente">Cadastrar Cliente</Link>
      </div>
    );
  }
}

export default withRouter(VideoInput);
