<template>
 <div id="nodeDetailCard" style="position: absolute; z-index: 2;">
        <v-card
          class="mx-auto"
          max-width="350"
        >
          <v-card-text class="font-weight-medium mt-12 text-center subtitle-1">
            {{graphService.getModuleNameById(hoveredModuleId)}}
          </v-card-text>
          <div v-for="item in requiredItems" :key="item.name" style="margin-bottom: 10px;">
            {{item.name}}
            <div style="display: flex">
              <v-img 
                max-width="64"
                :src=item.imgUrl
                @load=incImgLoadedCount()
              ></v-img>
              <h4>{{item.numRequired}}</h4>
            </div>
          </div>
        </v-card>
      </div>
</template>

<script>
import graphService from "../store/graphService"
import itemService from "../store/ItemService"
import modules from '../assets/modules';
import items from '../assets/items';

export default {
  name: 'HideoutModulePopup',
  props: ['hoveredModuleId'],
  components: {
  },
  data() {
    return {
      graphService,
      itemService,
      imgUrl: '',
      moduleName: '',
      requiredItems: {},
      imgLoadedCount: 0
    }
  },
  computed: {
   
  },
  created() {
    this.imgLoadedCount = 0;
  },
  mounted() {
   this.moduleName = this.graphService.getModuleNameById(this.hoveredModuleId);
   this.setCardPos();
   this.requiredItems = this.itemService.getRequiredItemsForHideoutModule(this.moduleName);
  },
  methods: {
    setCardPos() {
      let node = this.graphService.getNodeById(this.hoveredModuleId);
      var d = document.getElementById('nodeDetailCard');
      if (d) {
        let nodeDetailCardPos = this.graphService.convertCanvasToDom({x: node.x, y: node.y})
        d.style.position = "absolute";
        d.style.left =  nodeDetailCardPos.x  + 'px';
        d.style.top = nodeDetailCardPos.y + 'px';

        let myRe = new RegExp('(.*?)(?=px)', 'g');
        let styleTop = parseFloat(myRe.exec(d.style.top)[0]);
        let windowHeight = window.innerHeight;
        let isOOB =  styleTop + d.offsetHeight > windowHeight;
        if(isOOB) {
          let offset = styleTop + d.offsetHeight - windowHeight;
          let newTop = styleTop - offset + 'px'
          d.style.top = newTop;
        }
      }
    },
    incImgLoadedCount() {
      this.imgLoadedCount++;

      if(this.imgLoadedCount  === Object.keys(this.requiredItems).length) {
        this.setCardPos();
      }
    },
    allElementsFromPoint(x, y) {
      var element, elements = [];
      var old_visibility = [];
      while (true) {
          element = document.elementFromPoint(x, y);
          if (!element || element === document.documentElement) {
              break;
          }
          elements.push(element);
          old_visibility.push(element.style.visibility);
          element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
      }
      for (var k = 0; k < elements.length; k++) {
          elements[k].style.visibility = old_visibility[k];
      }
      elements.reverse();
      return elements;
    }
  },
};
</script>


<style scoped lang="less">


</style>
