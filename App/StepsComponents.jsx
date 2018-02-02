import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {Modal, Grid,Row,Col,ControlLabel,Table, Form, FormControl, FormGroup,InputGroup,ButtonGroup,Button, Glyphicon} from 'react-bootstrap';
import {ActionRowTable,ModalConfirmation} from './CommonComponents.jsx'
import {FormGroupWithLabel} from './Form.jsx'


export class AddStepComponent extends React.Component{
  constructor(props){
    super(props);

    this.state = {
        stepSelected : ""
    }

    this.onChangeStepSelected = this.onChangeStepSelected.bind(this);
    this.addValidateStepSelected = this.addValidateStepSelected.bind(this);

  }

  onChangeStepSelected(newValue){

    this.setState({stepSelected : newValue});
  }

  addValidateStepSelected(){
    this.props.onClick(this.state.stepSelected);
    this.setState({stepSelected : ""});
  }

  render(){
    return ( <FormGroupWithLabel label="Ajouter une étape à la configuration">
                          <Col sm={8}>
                            <Select
                                  options={this.props.steps}
                                  value= {this.state.stepSelected}
                                  onChange = {(newValue)=>{this.onChangeStepSelected(newValue)}}
                              />
                            </Col>
                            {'  '}
                            <Button bsStyle="primary" onClick={()=>this.addValidateStepSelected() }>Ajouter étape</Button>
                  </FormGroupWithLabel>);
    }
}


export class ModalStep extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      valueStep : props.stepToShow,
      stepsLinked : props.stepsLinked,
      showConfirmation : false
    };

    this.onChangeStepHandler = this.onChangeStepHandler.bind(this);

    this.showConfirmationDeleteNodeModal = this.showConfirmationDeleteNodeModal.bind(this);
    this.cancelConfirmationDeleteNodeModal = this.cancelConfirmationDeleteNodeModal.bind(this);
    this.validateConfirmationDeleteNodeModal = this.validateConfirmationDeleteNodeModal.bind(this);
  }


  onChangeStepHandler(val,attribut){
    var newValue = this.state[attribut];
    var value;

    if(Array.isArray(val)){
     value=[];
      for(let i=0;i< val.length;i++){
        value.push(val[i].id);
      }
    }else{
      value = val;
    }


    newValue = value;
    this.setState({[attribut] : newValue});
  }

  showConfirmationDeleteNodeModal(){
      this.setState({showConfirmation : true});
  }

  cancelConfirmationDeleteNodeModal(){
    this.setState({showConfirmation : false});
  }

  validateConfirmationDeleteNodeModal(){
      this.setState({showConfirmation : false});
      this.props.deleteStepCallback();
  }



  render(){
    var idStepSelected = this.props.stepToShow.id;
    var linkableSteps = this.props.steps.filter(function(step){
        return step.id != idStepSelected;
    });

    var detailStep = { stepId :this.props.stepToShow.id,
                      valueStep : this.state.valueStep,
                      linkedStepsId  : this.state.stepsLinked
                      }


    const space = detailStep.linkedStepsId.map( (stepId) =>
         <br key ={stepId}></br>  );



    return (
      <div>
        <Modal show={!this.state.showConfirmation} onHide={()=>this.props.cancelCallback()}   bsSize="lg">
            <Modal.Header closeButton>
                <Modal.Title>Etape :#{this.props.stepToShow.id}  </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroupWithLabel label="Etape">
                <Select
                      options={this.props.allSteps}
                      value= {this.state.valueStep}
                      name = 'currentStep' onChange= {(newVal) => this.onChangeStepHandler(newVal,'valueStep')}
                    />
              </FormGroupWithLabel>
                  <br></br>
                  <br></br>
                <FormGroupWithLabel label="Etape(s) suivante(s)">
                    <Select
                          options={linkableSteps}
                          value= {this.state.stepsLinked}
                          name = 'nextSteps'
                          multi={true}
                          valueKey ='id'
                          onChange = {(newVal)=>this.onChangeStepHandler(newVal,'stepsLinked')}
                      />
                  </FormGroupWithLabel>
                  <br></br>
                  {space}
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="danger" onClick={()=>this.showConfirmationDeleteNodeModal()}>Supprimer l'étape</Button>
              <Button bsStyle="primary" onClick={()=>this.props.validateChangeOnNode(detailStep) } >Valider les changements</Button>
              <Button  onClick={()=>this.props.cancelCallback()}>Annuler</Button>
          </Modal.Footer>
        </Modal>
        <ModalConfirmation
            title="Suppression d'une étape"
            question = "Souhaitez vous confirmer la suppression de cette étape ainsi que de tous ces liens avec les autre étapes ?"
            show={this.state.showConfirmation}
            validateCallback= {() => this.validateConfirmationDeleteNodeModal()}
            cancelCallback={() => this.cancelConfirmationDeleteNodeModal()}
            />


      </div>
      )  ;
  }
}

export class ModalLink extends React.Component {

    constructor(props){
      super(props);
      this.state = { showConfirmation : false};

      this.showConfirmationDeleteLink = this.showConfirmationDeleteLink.bind(this);
      this.cancelConfirmationDeleteModal = this.cancelConfirmationDeleteModal.bind(this);
      this.validateCallback = this.validateDelete.bind(this);
    }

    showConfirmationDeleteLink(){
      this.setState({showConfirmation : true});
    }
    cancelConfirmationDeleteModal(){
      this.setState({showConfirmation :false});
    }

    validateDelete(){
      this.setState({showConfirmation :false});
      this.props.deleteLink();
    }

    render(){
      return (
        <div>
          <Modal show={!this.state.showConfirmation} onHide={()=>this.props.cancelCallback()}   bsSize="lg">
              <Modal.Header closeButton>
                  <Modal.Title>Détail du lien</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  Lien entre les étapes <b>{this.props.source.label}</b> et <b>{this.props.target.label}</b>
              </Modal.Body>
              <Modal.Footer>
                <Button bsStyle="danger" onClick={()=>this.showConfirmationDeleteLink()}>Supprimer le lien</Button>
                <Button  onClick={()=>this.props.cancelCallback()}>Annuler</Button>
            </Modal.Footer>
          </Modal>
          <ModalConfirmation
              title="Suppression d'un lien"
              question = "Souhaitez vous confirmer la suppression de ce lien ?"
              show={this.state.showConfirmation}
              validateCallback= {() => this.validateDelete()}
              cancelCallback={() => this.cancelConfirmationDeleteModal()}
              />


        </div>
        )
    }
}
