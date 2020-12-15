import * as vis from 'vis-network';
import graph from '../assets/graph';
import questGraph from '../assets/questGraph'
import quests from '../assets/quests'

const defaultNodeBackgroundColor = '#631919';
const defaultNodeHoveBrackgroundColor = '#1b262c';
const defaultNodeBorderColor = '#919191';
const completedNodeBorderColor = '#3cc962';

const nodeColor = {
  background: defaultNodeBackgroundColor,
  border: defaultNodeBorderColor,
  hover: {
    background: defaultNodeHoveBrackgroundColor,
    border: defaultNodeBorderColor,
  },
  highlight: {
    background: defaultNodeHoveBrackgroundColor,
    border: defaultNodeBorderColor,
  },
};
const nodeOptions = {
  physics: false,
  shadow: true,
  shape: 'box',
  borderWidthSelected: 200, // Doesnt Work
  widthConstraint: 300,
  heightConstraint: 50,
  color: nodeColor,
  font: {
    size: 30,
    color: '#ffffff',
  },
};
const nodeOptionsCompleted = {
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
let praporNodeColor = "#f7d76d";
let thearapistNodeColor = "#b02bb5";
let skierNodeColor = '#c7820c';
let peacekeeperNodeColor = '#0e32e8';
let ragmanNodeColor = '#009933';
let mechanicNodeColor = '#cc003a';
let jaegerNodeColor = '#00dbd0';

const edgeOptions = {
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
let graphData = null;

const edges = new Map();


const options = {
  get userKey() { return 'user'; },
};

export default {
  // class
  selectedDragginNodeId: '',
  hoveredModuleId: '',
  selectedModule: '',
  selectedModuleId: '',
  prevModulesForCurrentModule: [],
  network2: null,
  getVisData() {
    return visData;
  },
  getNetwork() {
    return network;
  },
  getselectedModuleId() {
    return selectedModuleId;
  },
  highlightCompletedModule(id, highlightTrue, completedModules) {
    const curNode = visData.nodes.get(id);
    if (highlightTrue) { // TODO: Check
      curNode.color = completedNodeColor;
      // curNode.borderWidth = 4;
      // curNode.borderWidthSelected = 1;
    } else {
      curNode.borderWidth = 1;
      curNode.color = nodeColor;
    }
    visData.nodes.update(curNode);
  },
  highlightCompletedModulesOnInit(completedModules) {
    completedModules.forEach((module, moduleId, array) => {
      this.highlightCompletedModule(moduleId, true, completedModules);
    });
  },
  fillNodeColorForTrader() {
    graphData.data.nodes.forEach((item) => {
      if (quests[item.id].trader === 'Prapor') {
        const curNode = visData.nodes.get(item.id);
        curNode.color.background = praporNodeColor;
        curNode.font.color = '#000000';
        visData.nodes.update(curNode);
      }
      if (quests[item.id].trader === 'Thearapist') {
        const curNode = visData.nodes.get(item.id);
        curNode.color.background = thearapistNodeColor;
        curNode.font.color = '#ffffff';
        visData.nodes.update(curNode);
      }
      if (quests[item.id].trader === 'Skier') {
        const curNode = visData.nodes.get(item.id);
        curNode.color.background = skierNodeColor;
        curNode.font.color = '#ffffff';
        visData.nodes.update(curNode);
      }
      if (quests[item.id].trader === 'Peacekeeper') {
        const curNode = visData.nodes.get(item.id);
        curNode.color.background = peacekeeperNodeColor;
        curNode.font.color = '#ffffff';
        visData.nodes.update(curNode);
      }
      if (quests[item.id].trader === 'Ragman') {
        const curNode = visData.nodes.get(item.id);
        curNode.color.background = ragmanNodeColor;
        curNode.font.color = '#ffffff';
        visData.nodes.update(curNode);
      }
      if (quests[item.id].trader === 'Mechanic') {
        const curNode = visData.nodes.get(item.id);
        curNode.color.background = mechanicNodeColor;
        curNode.font.color = '#ffffff';
        visData.nodes.update(curNode);
      }
      if (quests[item.id].trader === 'Jaeger') {
        const curNode = visData.nodes.get(item.id);
        curNode.color.background = jaegerNodeColor;
        curNode.font.color = '#000000';
        visData.nodes.update(curNode);
      }
      
    });
  },
  getModuleNameById(id) {
    console.log(graphData);
    const foundModule = graphData.data.nodes.find((module) => module.id === id);
    return foundModule.label;
  },
  getModuleIdByName(moduleName) {
    const foundModule = graphData.data.nodes.find((module) => module.label === moduleName);
    return foundModule.id;
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
      } else {
        this.selectedModule = '';
        this.selectedModuleId = '';
      }
    });
  },
  setDragStartHandler() {
    network.on('dragStart', (params) => {
      if (params.nodes && params.nodes.length > 0 && params.events) {
        console.log(params)

        this.selectedDragginNodeId = params.nodes[0];

        params.nodes.forEach((nodeId) => {
          network.moveNode(nodeId, (nodePos.x%400), (nodePos.y%100));
        });
      }
    });
  },
  setDragReleaseHandler() {
    network.on('dragEnd', (params) => {
      if (params.nodes && params.nodes.length > 0 && params.event) {
        console.log(params)
        const nodePos = params.event.center;

        params.nodes.forEach((nodeId) => {
          let newCanvasPos = this.convertDOMtoCanvas(nodePos);
          let node = this.getNodeById(nodeId);
          console.log(node.x + ' ' + node.y);
          let x = this.convertDOMtoCanvas(node)
          console.log(x.x + ' ' + x.y);

          console.log(newCanvasPos.x +'     ' +  newCanvasPos.y)
          console.log((newCanvasPos.x - newCanvasPos.x%400) + ' ' + (newCanvasPos.y - newCanvasPos.y%100));
          network.moveNode(nodeId, (newCanvasPos.x - newCanvasPos.x%400), (newCanvasPos.y - newCanvasPos.y%100));
        });
      }
    });
  },
  setSelectHoverHandler() {
    network.on("hoverNode", (params) => {
      this.hoveredModuleId = params.node;
    })
    network.on("blurNode", (params) => {
      this.hoveredModuleId = '';
    })
  },
  getAllChildrenNodesAndEdges(node) {
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
    const visited = this.getAllChildrenNodesAndEdges(node);

    this.prevModulesForCurrentModule = Array.from(visited.nodes);

    network.setSelection({
      nodes: Array.from(visited.nodes),
      edges: Array.from(visited.edges),
    });
  },
  initVis(networkRef) {
    const container = networkRef || document.createElement('div');

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

    network.on()

    network.fit();
    network.setOptions({interaction: {
      hover: true
    }})
  },
  generateGraph(graphType, networkRef) {
    this.buildVisData(graphType);
    this.initVis(networkRef);
    this.fillNodeColorForTrader();

    this.setDragReleaseHandler();
    this.setSelectOnClickHandler();
    if(graphType === 'hideout') {
      this.setSelectHoverHandler();

    }
  },
  buildVisData(graphType) {
    if(graphType === 'hideout') {
      graphData = graph;
    }

    if (graphType === 'quest') {
      graphData = questGraph
    }


    const nodes = graphData.data.nodes.map((node) => ({
      ...node,
      ...nodeOptions,
    }));

    const edges = [];
    graphData.data.edges.forEach((edge_, i) => {
      const id = `e_${String(i + 1).padStart(3, '0')}`;
      const edge = {
        id,
        ...edge_,
        ...edgeOptions,
      };

      edges.push(edge);
      // this.edges.set(id, edge);
    });

    visData = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
  },
  searchModulesForMatch(question) {
    const matchingModules = [];
    graphData.data.nodes.forEach((item) => {
      if (question && item.label.toLowerCase().includes(question.toLowerCase())) {
        matchingModules.push(item.id);
      }
    });
    network.selectNodes(matchingModules, false);
  },
  getNodeById(nodeId) {
    // network.getPostion(nodeId); Doesnt work
    return graphData.data.nodes.find((node) => node.id === nodeId);

  },
  convertCanvasToDom(corr) {
    return network.canvasToDOM(corr);
  },
  convertDOMtoCanvas(corr) {
    return network.DOMtoCanvas(corr);
  },
};
