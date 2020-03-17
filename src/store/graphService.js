import * as vis from 'vis-network';
import graph from '../assets/graph';

let nodeColor = {
    background: '#bbe1fa',
    border: '#3282b8',
    hover: {
    background: '#a5d2eb',
    border: '#305e92',
        },
    highlight: {
    background: '#fa322f',
    border: '#2eb81e',
        }
};
let nodeOptions = {
    physics: false,
    shape: 'box',
    widthConstraint: 300,
    heightConstraint: 50,
    color: nodeColor,
    font: {
    size: 30,
    },
};
let completedNodeColor = {
    border: '#000000',
    background: '#000000',
    hover: {
    background: '#a5d2eb',
    border: '#305e92',
    },
    highlight: {
    background: '#fa322f',
    border: '#2eb81e',
    },
};
let edgeOptions = {
    arrows: 'to',
    color: {
    color: nodeColor.hover.background,
    highlight: nodeColor.highlight.border,
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
        console.log("in getter");
        console.log(visData);
        return visData;
    },
    getNetwork(){
        return network;
    },
    getselectedModuleId(){
        return selectedModuleId;
    },
    highlightCompletedModule(id, highlightTrue, completedModules){ 
        console.log(completedModules);
        debugger;
        var curNode = visData.nodes.get(id);
        if(highlightTrue){ //TODO: Check
            curNode.color = completedNodeColor;
        }else{
            console.log("unhighlight");
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
    selectAllChildren(node) {
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
  
        this.prevModulesForCurrentModule = Array.from(visited.nodes);
  
        network.setSelection({
          nodes: Array.from(visited.nodes),
          edges: Array.from(visited.edges),
        });
    },
    getScale() {
        // TODO: Set dynmaically based on screen size
        return 0.3;
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
            scale: this.getScale(),
            position: {
            x: 650,
            y: 300,
            },
        });

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
    searchModulesForMatch(){
        const vm = this;
        let matchingModules = [];
        graph.data.nodes.forEach(item => {
            if(vm.question && item.label.toLowerCase().includes(vm.question.toLowerCase())){
            matchingModules.push(item.id);
            }
        });
        vm.network.selectNodes(matchingModules, false);
    },

}