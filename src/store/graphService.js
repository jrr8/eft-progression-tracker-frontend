import * as vis from 'vis-network';
import graph from '../assets/graph';

const options = {
    get userKey() { return 'user'; },
    get nodeColor() {
        return {
          background: '#bbe1fa',
          border: '#3282b8',
          hover: {
            background: '#a5d2eb',
            border: '#305e92',
          },
          highlight: {
            background: '#fa322f',
            border: '#2eb81e',
          },
        };
      },
      get nodeOptions() {
        return {
          physics: false,
          shape: 'box',
          widthConstraint: 300,
          heightConstraint: 50,
          color: this.nodeColor,
          font: {
            size: 30,
          },
        };
      },
      get completedNodeColor(){
        return {
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
      },
      get edgeOptions() {
        return {
          arrows: 'to',
          color: {
            color: this.nodeColor.hover.background,
            highlight: this.nodeColor.highlight.border,
          },
        };
      },
  };
  
export default {
    printTest(){
        console.log("test");
    },
    highlightCompletedModule(id, highlightTrue){ 
        var curNode = this.visData.nodes.get(id);
        if(this.completedModules.get(id)){
          if(highlightTrue){
            curNode.color = this.completedNodeColor;
          }else{
            curNode.color = this.nodeColor;
          }
        }
        this.visData.nodes.update(curNode);
    },
    highlightCompletedModulesOnInit(){
        this.completedModules.forEach((module, moduleId, array) => {
            this.highlightCompletedModule(moduleId, true);
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
  
          this.network.getConnectedNodes(current, 'from').forEach((child) => {
            stack.push(child);
          });
  
          this.network.getConnectedEdges(current).forEach((edgeId) => {
            const edge = this.edges.get(edgeId);
            if (edge.to === current) {
              visited.edges.add(edgeId);
            }
          });
        }
  
        this.prevModulesForCurrentModule = Array.from(visited.nodes);
  
        this.network.setSelection({
          nodes: Array.from(visited.nodes),
          edges: Array.from(visited.edges),
        });
    },
    getScale() {
        // TODO: Set dynmaically based on screen size
        return 0.3;
      },
      initVis() {
        const container = this.$refs.vis;
        // const data = {
        //   nodes: this.nodeSet,
        //   edges: this.edgeSet};
        const data = this.visData;
        debugger;
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
  
        this.network = new vis.Network(container, data, options);
        // this.network.on("click", function(params) {
        //   if (params.edges.length > 0) {
        //     console.log(params.nodes[0]);
        //     this.getPrevModule("103");
        //   }
        // });
        console.log("here");
        this.network.moveTo({
          scale: this.getScale(),
          position: {
            x: 650,
            y: 300,
          },
        });
      },
      getVisData() {
        const nodes = graph.data.nodes.map((node) => ({
          ...node,
          ...this.nodeOptions,
        }));
  
        const edges = [];
        graph.data.edges.forEach((edge_, i) => {
          const id = `e_${String(i + 1).padStart(3, '0')}`;
          const edge = {
            id,
            ...edge_,
            ...this.edgeOptions,
          };
  
          edges.push(edge);
          this.edges.set(id, edge);
        });
  
        this.nodeSet = new vis.DataSet(nodes);
        this.edgeSet = new vis.DataSet(edges)
  
        // return {
        //   nodes: new vis.DataSet(nodes),
        //   edges: new vis.DataSet(edges),
        // };
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