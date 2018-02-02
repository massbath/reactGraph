import React from 'react';
import {Modal, Glyphicon,Button} from 'react-bootstrap';
import JSZip from 'jszip';
import FileSaver from  'file-saver';


String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

export class DownloadResult extends React.Component{

  constructor(props){
    super(props);
    this.makePath = this.addScenario.bind(this);
  }

  onClickCallback(){

    //On recherche le noeud "Racine"
    var steps= this.props.steps;
    var root;
    for(var i = 0; i<steps.length; i++){
          var links = this.props.links.filter(function(link){ return link.target.id == steps[i].id });
          //si aucun lien ne cible notre noeud, on déduit que c'est le noeud de départ de la config
          if(links.length == 0){
            root = steps[i];
            break;
          }
    }

    if(root != undefined){
      var zipScenarios = new JSZip();
      var arrayNodes = [root];
      this.addScenario(root, arrayNodes,zipScenarios);
      zipScenarios.generateAsync({type:"blob"}).then(function(content) {
          // see FileSaver.js
          FileSaver.saveAs(content, "scenarios.zip");
      });
    }

  }

  addScenario(currentNode, arrayNodes,archive){
    var links =  this.props.links.filter(function(link){ return link.source.id == currentNode.id });
    if(links.length){
        for(var i=0; i<links.length;i++){
            var nodeToAdd = links[i].target;
            var newBranche = arrayNodes.slice(0);
            newBranche.push(nodeToAdd);
            this.addScenario(nodeToAdd,newBranche,archive);
        }
    }else{

      let content = {
          scenario : { libelle : 'scenario', description :'description', stepNames : []}
      };
      var description="";
      var uniqueId ="";
      for(var i =0; i<arrayNodes.length; i++){
        content.scenario.stepNames.push(this.props.prefixeSteps + arrayNodes[i].value.replaceAll("/","\\"));
        let label = arrayNodes[i].label;
        description += label.substring(label.lastIndexOf('/'))+" ";
        uniqueId += arrayNodes[i].id;
      }

      content.scenario.description = description;
      let fileName = "scenario"+uniqueId+".json";



      archive.file(fileName, JSON.stringify(content));

    }


  }

  render(){
    return(<Button onClick={()=>this.onClickCallback()}>{this.props.label} <Glyphicon glyph="save"/></Button>);
  }


}
