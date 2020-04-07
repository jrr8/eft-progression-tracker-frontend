import * as vis from 'vis-network';
import graph from '../assets/graph';

let defaultNodeBackgroundColor = '#631919';
let defaultNodeHoveBrackgroundColor = '#1b262c';
let defaultNodeBorderColor = '#919191';
let completedNodeBorderColor = '#3cc962';

let nodeColor = {
    background: defaultNodeBackgroundColor,
    border: defaultNodeBorderColor,
    hover: {
    background: defaultNodeHoveBrackgroundColor,
    border: defaultNodeBorderColor,
        },
    highlight: {
    background: defaultNodeHoveBrackgroundColor,
    border: defaultNodeBorderColor,
        }
};
let nodeOptions = {
    physics: false,
    shadow: true,
    shape: 'box',
    borderWidthSelected: 200, // Doesnt Work
    widthConstraint: 300,
    heightConstraint: 50,
    color: nodeColor,
    font: {
      size: 30,
      color: '#ffffff'
    },
};
let nodeOptionsCompleted = {
    physics: false,
    shape: 'box',
    borderWidth: 2,
    borderWidthSelected: 2,
    widthConstraint: 300,
    heightConstraint: 50,
    color: completedNodeColor,
    font: {
    size: 30,
    },
};
let completedNodeColor = {
    border: completedNodeBorderColor,
    background: defaultNodeBackgroundColor,

    hover: {
    background: defaultNodeHoveBrackgroundColor,
    border: completedNodeBorderColor,
    },
    highlight: {
    background: defaultNodeHoveBrackgroundColor,
    border: completedNodeBorderColor,
    },
};
let edgeOptions = {
  width: 3,
  shadow: true,
    arrows: 'to',
    color: {
    color: '#8c2020',
    highlight: '#e3d6ac',
    },
};

let network = null;
let visData = null;

let edges = new Map();


const options = {
    get userKey() { return 'user'; },
  };

export default {
    // class
    selectedModule: '',
    selectedModuleId: '',
    prevModulesForCurrentModule: [],
    getVisData(){
        return visData;
    },
    getNetwork(){
        return network;
    },
    getselectedModuleId(){
        return selectedModuleId;
    },
    highlightCompletedModule(id, highlightTrue, completedModules){
        var curNode = visData.nodes.get(id);
        if(highlightTrue){ //TODO: Check
            curNode.color = completedNodeColor;
            // curNode.borderWidth = 4;
            // curNode.borderWidthSelected = 1;
        }else{
            curNode.borderWidth = 1;
            curNode.color = nodeColor;
        }
        visData.nodes.update(curNode);
    },
    highlightCompletedModulesOnInit(completedModules){
        completedModules.forEach((module, moduleId, array) => {
            this.highlightCompletedModule(moduleId, true, completedModules);
        });
    },
    getModuleNameById(id){
        let moduleName = '';
        graph.data.nodes.forEach((module, index, array) => {
          if(module.id == id){
            moduleName = module.label;
          }
        });
        return moduleName;
    },
    setSelectOnClickHandler() {
      // TODO: Need to implement later
        // this.network.on('deselectNode', (params) => {
        //   if(this.inputFocused){
        //     this.network.setSelection(params.previousSelection);
        //   }else{
        //     console.log('skipping');
        //   }
        // });
        network.on('click', (params) => {
          if (params.nodes.length) {
            this.selectedModule = this.getModuleNameById(params.nodes[0]);
            this.selectedModuleId = params.nodes[0];
            this.selectAllChildren(params.nodes[0]);
          }else{
            this.selectedModule = '';
            this.selectedModuleId = '';
          }
        });
    },
    getAllChildrenNodesAndEdges(node){
      const visited = {
        nodes: new Set(),
        edges: new Set(),
      };
      const stack = [node];

      while (stack.length) {
        const current = stack.pop();
        visited.nodes.add(current);

        network.getConnectedNodes(current, 'from').forEach((child) => {
          stack.push(child);
        });

        network.getConnectedEdges(current).forEach((edgeId) => {
          const edge = visData.edges.get(edgeId);
          if (edge.to === current) {
            visited.edges.add(edgeId);
          }
        });
      }

      return visited;
    },
    selectAllChildren(node) {
        const visited = this.getAllChildrenNodesAndEdges(node)

        this.prevModulesForCurrentModule = Array.from(visited.nodes);

        network.setSelection({
          nodes: Array.from(visited.nodes),
          edges: Array.from(visited.edges),
        });
    },
    initVis(networkRef) {
        this.buildVisData();
        const container = networkRef;

        const data = visData;

        const options = {
            edges: {
            smooth: {
                type: 'cubicBezier',
                forceDirection: 'horizontal',
                roundness: 1,
            },
            },
            interaction: {
            hover: true,
            selectConnectedEdges: false,
            },
        };

        network = new vis.Network(container, data, options);

        network.moveTo({
            position: {
              x: 650,
              y: 300,
            },
        });

        network.fit();

        this.setSelectOnClickHandler();
    },
    buildVisData() {
        const nodes = graph.data.nodes.map((node) => ({
            ...node,
            ...nodeOptions,
        }));

        const edges = [];
        graph.data.edges.forEach((edge_, i) => {
            const id = `e_${String(i + 1).padStart(3, '0')}`;
            const edge = {
            id,
            ...edge_,
            ...edgeOptions,
            };

            edges.push(edge);
            // this.edges.set(id, edge);
        });

        visData = {nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges)}
    },
    searchModulesForMatch(question){
      let matchingModules = [];
      graph.data.nodes.forEach(item => {
        if(question && item.label.toLowerCase().includes(question.toLowerCase())){
          matchingModules.push(item.id);
        }
      });
      network.selectNodes(matchingModules, false);
    },

}
