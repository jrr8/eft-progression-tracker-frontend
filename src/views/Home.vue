<template>
  <div class="flex fd-col viewport-height">
    <div ref="header" class="disp-flex bg-3a0f0f bx-shdw-black algn-itms-center p-lr-10px hght-auto">
      <div :class="[graphService.selectedModuleId != '' ? 'hideout-module-info-active' : 'hideout-module-info-inactive']" class="hideout-module-info">
        <div v-if="graphService.selectedModuleId != ''" style="display: flex; margin-left: 50px; ">
          <h1 class="selected-module-header color-e3d6ac">{{graphService.getModuleNameById(graphService.selectedModuleId)}}</h1>
          <div class="checkbox-container">
            <v-checkbox hide-details class="checkbox" color="#e3d6ac" :disabled="graphService.selectedModuleId == ''" v-model="isModuleCompletedForCheckbox" :label="'Module Completed'"></v-checkbox>
            <v-checkbox hide-details class="checkbox" color="#e3d6ac" :disabled="graphService.selectedModuleId == ''" v-model="isModuleTrackedForCheckbox" :label="'Module Tracked'"></v-checkbox>
          </div>
        </div>
      </div>
      <v-text-field color="#e3d6ac" hide-details class="search-input" label="Search Module"
        v-model="question" @input="graphService.searchModulesForMatch(question)" @focus="onInputFocused()" @blur="onInputBlurred()"
      ></v-text-field>
      <tracked-modules-dialog></tracked-modules-dialog>
      <hideout-module-popup v-if="hoveredModuleId != ''" v-bind:hoveredModuleId="hoveredModuleId"></hideout-module-popup>
    </div>
    <div ref="vis" class="no-focus bkg-img" :style="graphStyle"></div>
  </div>

</template>

<script>
import trackedModulesDialog from '../components/TrackedModulesDialog.vue';
import hideoutModulePopup from '../components/HideoutModulePopup.vue'
import graphService from '../store/graphService';


export default {
  name: 'Home',
  components: {
    trackedModulesDialog,
    hideoutModulePopup

  },
  data() {
    return {
      dialog: false,
      edges: new Map(),
      question: '',
      inputFocused: false,
      graphStyle: null,
      graphService
    };
  },
  computed: {
    hoveredModuleId() {
      console.log("hovered id: " + this.graphService.hoveredModuleId);
      return this.graphService.hoveredModuleId;
    },
    visData() {
      return this.$store.state.visData;
    },
    isDisabled() {
      return this.selectedModuleId === '';
    },
    trackedModules() {
      return this.$store.state.user.trackedModules;
    },
    completedModules() {
      return this.$store.state.user.hideoutModulesCompleted;
    },
    isNavDrawerActive() {
      return this.$store.state.isNavDrawerActive;
    },
    isModuleCompletedForCheckbox: {
      get() {
        if (this.graphService.selectedModuleId !== '' && this.completedModules) { return !!this.completedModules.get(this.graphService.selectedModuleId); }
        return false;
      },
      set() {
        this.toggleCompletedModule();
      },
    },
    isModuleTrackedForCheckbox: {
      get() {
        if (this.graphService.selectedModuleId !== '' && this.trackedModules) { return !!this.trackedModules.get(this.graphService.selectedModule); }
        return false;
      },
      set() {
        this.toggleModuleToTrackedMap();
      },
    },
  },
  created() {

  },
  mounted() {
    this.$ga.page('/home');
    //   TODO: This works for now, need to investigate why app.vue is not loading user before this page is loaded when reloading this page. (Maybe navigation gaurd)
    //  TODO: Move to created
    this.$store.dispatch('fetchUser').then(() => {
      graphService.initVis(this.$refs.vis);
      this.network = graphService.getNetwork();
      graphService.highlightCompletedModulesOnInit(this.completedModules);
    });

    this.graphStyle = { height: `calc(100% - ${this.$refs.header.clientHeight}px)` };
  },
  methods: {
    toggleIsNavDrawerActive() {
      this.$store.commit('setNavDrawerIsActive', { isNavDrawerActive: !this.isNavDrawerActive });
    },
    toggleCompletedModule() {
      this.$ga.event('checkbox', 'toggleModuleCompletedCheckbox', 'clicked', 3);
      if (!this.completedModules.get(this.graphService.selectedModuleId)) {
        this.$store.dispatch('updateUserCompletedModules', { moduleId: this.graphService.selectedModuleId, isCompleted: true }).then(() => {
          graphService.highlightCompletedModule(this.graphService.selectedModuleId, true, this.completedModules);
        });
      } else {
        this.$store.dispatch('updateUserCompletedModules', { moduleId: this.graphService.selectedModuleId, isCompleted: false }).then(() => {
          graphService.highlightCompletedModule(this.graphService.selectedModuleId, false, this.completedModules);
        });
      }
    },
    onInputFocused() {
      this.inputFocused = true;
      graphService.searchModulesForMatch(this.question);
    },
    onInputBlurred() {
      setTimeout(() => {
        this.inputFocused = false;
      }, 200);
    },
    toggleModuleToTrackedMap() {
      this.$ga.event('checkbox', 'toggleModuleTrackedCheckbox', 'clicked', 4);
      if (this.graphService.selectedModule !== '' && !this.trackedModules.get(this.graphService.selectedModule)) {
        this.$store.dispatch('updateUserTrackedModules', { name: this.graphService.selectedModule, isTracked: true });
      } else {
        this.$store.dispatch('updateUserTrackedModules', { name: this.graphService.selectedModule, isTracked: false });
      }
    },
    saveGraph() {
      this.download(
        JSON.stringify(this.network.getPositions()),
        'graph.json',
        'application/json',
      );
    },
    download(content, fileName, contentType) {
      const a = document.createElement('a');
      const file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    },
  },
};
</script>


<style scoped lang="less">
.disp-flex {
  display: flex;
}

.fd-col {
  flex-direction: column;
}

.user-interaction-header {
  display: flex;
  background: #3a0f0f;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  align-items: center;
  padding: 10px 10px;
  height: auto;
}

.bg-3a0f0f {
  background: #3a0f0f;
}
.bx-shdw-black {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.algn-itms-center {
  align-items: center;
}

.p-lr-10px {
  padding: 10px 10px;
}

.hght-auto {
  height: auto;
}

.hideout-module-info-inactive {
  height:56px;
  // margin-left: 500px;
  width: 1500px;
  flex-grow: 1;
  flex-shrink: 1;
}

.hideout-module-info-active {
  height:auto;
  // margin-left: 500px;
  width: 1500px;
  flex-grow: 1;
  flex-shrink: 1;
}

.selected-module-header {
  // width: 500px;
  color: white;
  flex-shrink: 1;
  flex-grow: 1;
}

.checkbox-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
}

.checkbox {
  margin: 0px;
}

.search-input {
  padding-top: 0px;
  margin-top: 0px;
  margin-left: 10px;
  flex-shrink: 0;
}

.search-input-container {
  height: 100%;
}

.popup-visible {
    position: absolute;
    z-index: 10;
    visibility: visible;
}

.color-e3d6ac {
  color: #e3d6ac;
}

</style>
