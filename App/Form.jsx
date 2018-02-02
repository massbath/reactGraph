import React from 'react';
import {Col,ControlLabel, FormControl, FormGroup} from 'react-bootstrap'

/**
* Composant stateless affichant un bloc bootstrap form-group
* props = {
*          label : message à afficher sur le button
*          htmlFor : attribut for du label du bloc
*         }
*/
export class FormGroupWithLabel extends React.Component{
  render(){
    const labelSize = this.props.labelSize? this.props.labelSize:4;
    const controlSize = this.props.controlSize? this.props.controlSize:8;

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
