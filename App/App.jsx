import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import {
  Grid,
  Row,
  Col,
  Panel,
  ControlLabel,
  Table,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  ButtonGroup,
  Button,
  Glyphicon,
  Modal
} from 'react-bootstrap'
import { AddStepComponent, ModalStep, ModalLink } from './StepsComponents.jsx'
import { ListLinksComponent } from './LinksComponents.jsx'
import { GraphConfiguration } from './GraphComponent.jsx'
import {
  DownloadButton,
  UploadButton,
  FormGroupWithLabel
} from './CommonComponents.jsx'
import { DownloadResult } from './DownloadResultComponent.jsx'

export default class AppWatGenerator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stepsOfApplication: [],
      currentIdSteps: 0,
      steps: [],
      links: [],
      showModalNodeSelected: false,
      showModalLinkSelected: false,
      prefixeSteps: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.addStep = this.addStep.bind(this)
    this.deleteStep = this.deleteStep.bind(this)
    this.changeStep = this.changeStep.bind(this)
    this.deleteLink = this.deleteLink.bind(this)
    this.closeModalStep = this.closeModalStep.bind(this)
    this.showDetailStepSelected = this.showDetailStepSelected.bind(this)
    this.showDetailLinkSelected = this.showDetailLinkSelected.bind(this)
    this.closeModalLink = this.closeModalLink.bind(this)
    this.loadConfig = this.loadConfig.bind(this)
    this.loadSteps = this.loadSteps.bind(this)
  }

  handleChange(event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  showDetailStepSelected(idStep) {
    var nodeSelected = this.state.steps.filter(function(step) {
      return step.id == idStep
    })[0]

    this.setState({
      showModalNodeSelected: true,
      nodeSelected: nodeSelected
    })
  }

  showDetailLinkSelected(source, target) {
    let sourceStep
    let targetStep
    for (let step of this.state.steps) {
      if (step.id == source) {
        sourceStep = step
      } else if (step.id == target) {
        targetStep = step
      }
      if (sourceStep != undefined && targetStep != undefined) {
        break
      }
    }

    this.setState({
      showModalLinkSelected: true,
      sourceStep: sourceStep,
      targetStep: targetStep
    })
  }

  changeStep(detailStep) {
    var nodeSelected = this.state.steps.find(function(step) {
      return step.id == detailStep.stepId
    })

    var newSteps = this.state.steps
    //Changement sur la valeur de l'étape
    if (nodeSelected.value != detailStep.valueStep.value) {
      var nodeSelectedIndex = this.state.steps.find(function(step) {
        return step.id == detailStep.stepId
      })

      nodeSelected.value = detailStep.valueStep.value
      nodeSelected.label = detailStep.valueStep.label
      newSteps[nodeSelectedIndex] = nodeSelected
    }

    //Gestion des changements sur les liens de l'étape aux autres
    var oldLinks = this.state.links
    var newLinks = []

    for (var i = 0; i < oldLinks.length; i++) {
      var indexIdTarget = detailStep.linkedStepsId.indexOf(
        oldLinks[i].target.id
      )

      //Il s'agit dun lien prenant comme source un autre noeud on le conserve
      if (oldLinks[i].source.id != nodeSelected.id) {
        newLinks.push(oldLinks[i])
      }
      //Sinon si il s'agit d'un lien concernant le noeud que l'on souhaite modifié et que la liste des noeuds cibles contient un id d'un noeud sélectionné alors on le conserve
      else if (
        oldLinks[i].source.id == nodeSelected.id &&
        indexIdTarget != -1
      ) {
        newLinks.push(oldLinks[i])
        //on retire des noeud cibles sélectionné l'id qui existe déja dans les liens
        detailStep.linkedStepsId.splice(indexIdTarget, 1)
      }
    }

    //on traite les noeuds cibles restant pour créer les nouveaux liens potentiels
    for (var i = 0; i < detailStep.linkedStepsId.length; i++) {
      var nodeTarget = this.state.steps.filter(function(step) {
        return step.id == detailStep.linkedStepsId[i]
      })[0]

      newLinks.push({ source: nodeSelected, target: nodeTarget })
    }

    //trier les links pour qu'ils apparaissent dans l'ordre des noeuds sources dans le tableau
    newLinks.sort(function(link1, link2) {
      return link1.source.id - link2.source.id
    })

    this.setState({
      links: newLinks,
      showModalNodeSelected: false,
      steps: newSteps
    })
  }

  closeModalStep() {
    this.setState({ showModalNodeSelected: false })
  }

  closeModalLink() {
    this.setState({ showModalLinkSelected: false })
  }

  /**
    Méthode permettant l'ajout d'une étape à la liste des étapes disponibles pour les scénarios
  **/
  addStep(stepToAdd) {
    var oldState = this.state

    if (stepToAdd != '') {
      var newStep = Object.assign({}, stepToAdd)
      newStep['id'] = oldState.currentIdSteps

      oldState.steps.push(newStep)

      this.setState({
        currentIdSteps: oldState.currentIdSteps + 1,
        steps: oldState.steps
      })
    }
  }

  //Méthode permettant de supprimer une étape de la collection recensant toutes les étapes et par cascade les liens qui lui sont attachés
  deleteStep(nodeSelected) {
    var oldState = this.state
    var newSteps = oldState.steps
    var index = newSteps.indexOf(nodeSelected)
    var stepToDelete = newSteps.splice(index, 1)[0]
    var newLinks = oldState.links.filter(function(link) {
      return (
        link.source.id != stepToDelete.id && link.target.id != stepToDelete.id
      )
    })

    this.setState({
      steps: newSteps,
      links: newLinks
    })
    this.closeModalStep()
  }

  deleteLink(sourceStep, targetStep) {
    var newLinks = this.state.links.filter(function(link) {
      return link.source.id != sourceStep.id && link.target.id != targetStep.id
    })
    this.setState({
      links: newLinks
    })
    this.closeModalLink()
  }

  loadConfig(data) {
    this.setState(data)
  }

  loadSteps(data) {
    this.setState({ stepsOfApplication: data })
  }

  render() {
    var valuesLink = {
      source: this.state.addLinkSourceValue,
      target: this.state.addLinkTargetValue
    }
    var stepsLinked = []
    if (this.state.showModalNodeSelected) {
      for (var i = 0; i < this.state.links.length; i++) {
        if (this.state.links[i].source.id == this.state.nodeSelected.id) {
          stepsLinked.push(this.state.links[i].target.id)
        }
      }
    }

    return (
      <div>
        <br />
        <Grid>
          <Row>
            <Panel>
              <Form>
                <Col sm={6}>
                  <FormGroupWithLabel label="Charger les étapes">
                    <UploadButton
                      onChange={data => this.loadSteps(data)}
                      accept=".steps"
                    />
                  </FormGroupWithLabel>
                </Col>
                <Col sm={6}>
                  <FormGroupWithLabel label="Charger une configuration existante">
                    <UploadButton
                      onChange={data => this.loadConfig(data)}
                      accept=".config"
                    />
                  </FormGroupWithLabel>
                </Col>
              </Form>
            </Panel>
            {this.state.stepsOfApplication.length > 0 && (
              <Panel>
                <Col sm={12}>
                  <AddStepComponent
                    steps={this.state.stepsOfApplication}
                    onClick={stepToAdd => this.addStep(stepToAdd)}
                  />
                </Col>
              </Panel>
            )}
          </Row>
          <Row>
            {this.state.steps.length > 0 && (
              <Panel>
                <Col sm={6}>
                  <GraphConfiguration
                    steps={this.state.steps}
                    links={this.state.links}
                    selectNodeCallback={idStep =>
                      this.showDetailStepSelected(idStep)
                    }
                    selectLinkCallback={(source, target) =>
                      this.showDetailLinkSelected(source, target)
                    }
                  />
                </Col>
                <Col sm={6}>
                  {this.state.links.length > 0 && (
                    <Form horizontal>
                      <FormGroupWithLabel label="Préfixe des chemins des étapes dans les scénarios">
                        <FormControl
                          name="prefixeSteps"
                          value={this.state.prefixeSteps}
                          type="text"
                          onChange={this.handleChange}
                        />
                      </FormGroupWithLabel>
                      <FormGroupWithLabel label="Télécharger">
                        <DownloadButton
                          label="La configuration"
                          dataToDownload={this.state}
                          defaultFileName="config.config"
                        />
                        {'  '}
                        <DownloadResult
                          label="Les scénarios"
                          links={this.state.links}
                          steps={this.state.steps}
                          prefixeSteps={this.state.prefixeSteps}
                        />
                      </FormGroupWithLabel>
                    </Form>
                  )}
                </Col>
              </Panel>
            )}
          </Row>
        </Grid>
        {this.state.showModalNodeSelected && (
          <ModalStep
            steps={this.state.steps}
            allSteps={this.state.stepsOfApplication}
            cancelCallback={() => this.closeModalStep()}
            stepToShow={this.state.nodeSelected}
            deleteStepCallback={() => this.deleteStep(this.state.nodeSelected)}
            validateChangeOnNode={detailStep => this.changeStep(detailStep)}
            stepsLinked={stepsLinked}
          />
        )}

        {this.state.showModalLinkSelected && (
          <ModalLink
            source={this.state.sourceStep}
            target={this.state.targetStep}
            cancelCallback={() => this.closeModalLink()}
            deleteLink={() =>
              this.deleteLink(this.state.sourceStep, this.state.targetStep)
            }
          />
        )}
      </div>
    )
  }
}
