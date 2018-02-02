import React from 'react';
import PropTypes from 'prop-types';
import {Col,ControlLabel, FormGroup,Glyphicon, Modal,Button,Form,FormControl} from 'react-bootstrap';



/**
* Composant stateless affichant un bloc bootstrap form-group
* props = {
*          label : message à afficher sur le button
*          htmlFor : attribut for du label du bloc
*         }
*/
export class FormGroupWithLabel extends React.Component{
  render(){
    const labelSize = this.props.labelSize||5;
    const controlSize = this.props.controlSize||7;

    return (<FormGroup>
                <Col componentClass={ControlLabel} sm={labelSize}>
                    {this.props.label}
                </Col>
                <Col sm={controlSize}>
                    {this.props.children}
                </Col>
            </FormGroup>
           );
  }
}

/**
* Composant stateless affichant une ligne sourlignée
**/
export class FormSeparator extends React.Component{
  render(){
    return (<div><div className="row has-border-bottom"/><br></br></div>);
  }
}

/**
*Sticky footer
**/
export class StickyFooter extends React.Component{
 render(){
  return (
      <div className="navbar navbar-default navbar-fixed-bottom" >
        <div className="row">
           {this.props.children}
       </div>
    </div>);
  }
}

export class ActionRowTable extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
         { this.props.showActionMoveUp &&  <Glyphicon glyph="menu-up" onClick={()=>this.props.actionMove('up')} />}
         { this.props.showActionMoveDown && <Glyphicon glyph="menu-down" onClick={()=>this.props.actionMove('down')}/>}
         <Glyphicon glyph="remove" onClick={()=>this.props.actionDelete()}/>
      </div>
  );
  }
}

export class ModalConfirmation extends React.Component {
    constructor(props){
      super(props);
    }

    render(){
      return(
        <Modal show={this.props.show}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                  <p>{this.props.question}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button  onClick={()=>this.props.validateCallback() } >Valider</Button>
              <Button  onClick={()=>this.props.cancelCallback()}>Annuler</Button>
          </Modal.Footer>
        </Modal>

      );
    }


}

/**
* Bouton de téléchargement
**/
export class DownloadButton extends React.Component{
  constructor(props){
    super(props);
    this.onClickCallback = this.onClickCallback.bind(this);
  }

  onClickCallback(){
    var fileDownload = require('react-file-download');
    fileDownload(JSON.stringify(this.props.dataToDownload), this.props.defaultFileName);
  }

  render(){
    return(<Button onClick={()=>this.onClickCallback()}>{this.props.label} <Glyphicon glyph="save"/></Button>);
  }
}

export class UploadButton extends React.Component{

  constructor(props){
    super(props);

    this.loadFile = this.loadFile.bind(this);
    this.fileReadCallback = this.fileReadCallback.bind(this);
  }

  loadFile(event){
    var file = event.target.files[0];
    var  reader = new FileReader();
    reader.addEventListener("load", this.fileReadCallback, false);
    reader.readAsText(file);
  }

  fileReadCallback(event){
    var data = event.target.result;
    this.props.onChange(JSON.parse(data));
  }



  render(){
    return (<FormControl type="file"  onChange= {(event)=>this.loadFile(event)} accept={this.props.accept}/>);
  }


}

UploadButton.propTypes = {
    onChange : PropTypes.func.isRequired,
    accept : PropTypes.string.isRequired
}
