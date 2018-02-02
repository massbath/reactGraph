import React from 'react';
import Graph from 'react-graph-vis';

export class GraphConfiguration extends React.Component{

  constructor(props){
    super(props);



  }

  render(){

    const {selectNodeCallback,selectLinkCallback} = this.props;

    var nodes = this.props.steps.map((step) =>  {
          var node = {};
          node['id']= step.id;
          node['label'] = "#"+step.id + " "+ step.label.substring(step.label.lastIndexOf('/')+1);
           return node;
         });
    var edges = this.props.links.map((link) =>  {
        var edge = {};
        edge['from'] = link.source.id;
        edge['to'] = link.target.id;
        edge['id'] = link.source.id.toString()+"-" + link.target.id.toString();
        return edge;
      });




    var graph = {
            nodes: nodes,
            edges: edges
        };

var options = {

    layout: {
      hierarchical : {
            direction :'UD',
            parentCentralization : false,
            sortMethod : 'directed'
          }
    },
    nodes : {
      shape : 'box',
      color : '#FFFFFF'
    },
    edges: {
        color: "#000000"
    }
};
  var events = {

    doubleClick : function(event){

      var nodes  = event.nodes;
      var edges = event.edges;

      //sélection d'un edge
      if(nodes.length == 0){
        let link = edges[0].split('-');
        let source = parseInt(link[0]);
        let target = parseInt(link[1])
        selectLinkCallback(source, target);
      }else {
        selectNodeCallback(nodes[0]);
      }


    }


  }

  return (<Graph graph={graph} options={options} events={events}/>)
  }


}
