import React from 'react'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import {
  Grid,
  Row,
  Col,
  ControlLabel,
  Table,
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  ButtonGroup,
  Button,
  Glyphicon
} from 'react-bootstrap'
import { ActionRowTable } from './CommonComponents.jsx'

export class AddLinkComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h3>Ajout d'un lien entre les étapes de la configuration</h3>
        <FormGroup>
          <InputGroup>
            <Select
              options={this.props.steps}
              value={this.props.values.source}
              onChange={newValue => {
                this.props.onChange('addLinkSourceValue', newValue)
              }}
            />
            <br />
            <Select
              options={this.props.steps}
              value={this.props.values.target}
              onChange={newValue => {
                this.props.onChange('addLinkTargetValue', newValue)
              }}
            />
            <InputGroup.Button>
              <Button onClick={() => this.props.onValidation()}>
                Ajouter lien
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </div>
    )
  }
}

export class ListLinksComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    var listLinks = this.props.links.map((input, index) => (
      <tr key={index}>
        <td>
          #({input.source.id}) {input.source.label}
        </td>
        <td>
          #({input.target.id}) {input.target.label}
        </td>
        <td>
          <ActionRowTable
            showActionMoveUp={false}
            showActionMoveDown={false}
            actionDelete={() => this.props.deleteLink(index)}
          />
        </td>
      </tr>
    ))

    return (
      <div>
        <h3>Liste des liens entre les différents étapes</h3>
        <Table striped condensed bordered hover>
          <thead>
            <tr>
              <th>De</th>
              <th colSpan={2}>Vers</th>
            </tr>
          </thead>
          <tbody>{listLinks}</tbody>
        </Table>
      </div>
    )
  }
}
