<template>
  <div class="back viewport-height p50px">
    <v-card class="card-raised-effect of-auto wdth75p marg-auto hght100p">
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-card
              color="#3a0f0f"
              dark
            >
              <h1>Help Page</h1>
              <p>
                This page is aimed at helping users who are new to using Tarkov Assistant.
                Here you will find detailed information on how to navigate and use the Hideout Progression tree and Item List page.</p>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card
                color="#3a0f0f"
                dark
                >
                <v-card-title class="headline">General Functionality</v-card-title>
                <h4>Completing Hideout Modules</h4>
                <ul>
                    <li>Tarkov Assistant allows you to mark Hideout Modules as Completed.</li>
                    <ul>
                        <li>Modules that you have marked Completed will be represented by a green outline in the progression tree</li>
                        <li>These completed modules will contribute to the items required for other Hideout Module upgrades.</li>
                    </ul>
                </ul>

                <h4>Tracking Hideout Modules</h4>
                <ul>
                    <li>Tarkov Assistant also allows you to mark Hideout Modules as Tracked.</li>
                    <ul>
                        <li>Modules that you have marked Tracked will be represented by a green outline in the progression tree</li>
                        <li>Tracked modules specify Hideout Modules that you are actively working toward.
                            These modules can be selected in the Item List Page to show the items required to construct that Hideout Module and all modules leading to the Tracked module.
                        </li>
                    </ul>
                </ul>

                <h4>Inventory</h4>
                <ul>
                    <li>Tarkov Assistant has a system in which you can maintain the count of the items you own in your in-game storage, located in the Item list Page.</li>
                    <li>Keeping an updated count of the items you own will allow you to quickly see which items you need to keep and which items you can trade/barter either during or after your raids.</li>
                </ul>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card
                color="#3a0f0f"
                dark
                >
                <v-card-title class="headline">Hideout Progression Tree Page Navigation</v-card-title>
                <h4>General Navigation</h4>
                <v-divider color="#3a0f0f"></v-divider>
                <img class="p10px" src="../assets/MainPage1.png" width="100%">
                <ol type="1">
                    <li>Clicking on the 3x3 navigation icon will open the navigation panel from the left.
                        Here is where you will navigate to all of the pages within Tarkov Assistant</li>
                    <li>You can search for modules within the Hideout Module Tree using the search input.
                        The input does not need to match the Hideout Module name exactly.
                        For example, typeing a 3 in the search box will highlight all level three modules in the graph.
                    </li>
                    <li>Selecting this button will bring up a window over the graph that shows a list of all Hideout Modules in Escape from Tarkov.</li>
                </ol>

              <h4>Selecting a Hideout Module</h4>
                <v-divider color="#3a0f0f"></v-divider>
                <img class="p10px" src="../assets/MainPageSelectedModule.png" width="100%">
                <ol type="1">
                    <li>Clicking on a Hideout Module in the progression tree will highlight the module itself and highlight all modules required to construct the selected module.</li>
                    <li>Selecting a Hideout Module will display the name in the top center of the site.</li>
                    <li>This Checkbox controls whether the currently selected Hideout Module has been completed.</li>
                    <li>This Checkbox controls whether the currently selected Hideout Module is being tracked.</li>
                </ol>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card
              color="#3a0f0f"
              dark
            >
              <v-card-title class="headline">Item List Page Navigation</v-card-title>
              <h4>General Navigation</h4>
              <img class="p10px" src="../assets/ItemListPage.png" width="100%">
              <ol type="1">
                    <li>Checkbox that will disable the item images in the right hand column</li>
                    <li>Checkbox that will add the items in your inventory to the Items Required column.</li>
                    <li>Search bar that will filter the items in the table to include only ones matching the search text.</li>
                    <li>Dropdown list of the modules you have marked as tracked.
                        By selecting a Tracked module, the table will only show items required to construct the Tracked module and all modules leading to it.
                    </li>
                    <li>Selecting the dropdown for an item will provide a list of Hideout Modules that use that item and how many the module requires for construction.</li>
                </ol>

                <h4>Item Dropdown Navigation</h4>
                <img class="p10px" src="../assets/ItemDropdown.png" width="100%">
                <ol type="1">
                    <li>Represents the numbers of items required spanning all Hideout Modules that use the item.
                        <ul>
                            <li>The first number represents the number of items you have turned in.
                                If you have selected the "Include Inventory in Items Required" checkbox, this number will include the items in your inventory.
                                If you have more than 0 of the item in your inventory, the number will turn beige, otherwise it will remain white.
                            </li>
                            <li>
                                The second number represents the number of items required for all Hideout Modules using the item.
                            </li>
                        </ul>
                    </li>
                    <li>Displays how many of that item you have in your inventory. You can also increment and decrement this amount using the buttons on either side.</li>
                    <li>When viewing the Hideout Modules that use the item, you will also see which modules you have completed, indicated by a green check mark.
                        As stated previously, these completed modules will contribute toward your Items Required count.
                    </li>
                </ol>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'Help',
  components: {
  },
  data() {
    return {

    };
  },
  computed: {

  },
  created() {

  },
  mounted() {

  },
  methods: {

  },
};
</script>


<style scoped lang="less">

.card-raised-effect {
  box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.233), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.p50px {
  padding: 50px;
}

.wdth75p {
  width: 75%;
}

.marg-auto {
  margin: auto;
}

.hght100p {
  height: 100%;
}

.of-auto {
  overflow: auto;
}

.p10px {
    padding: 10px;
}

.v-card {
  padding:1px;
  margin-bottom: 20px;

  h1 {
    text-align: center;
  }

  p {
    text-align: left;
    margin-left: 25px
  }

  h4 {
    text-align: left;
     margin-left: 25px
  }

  ul {
    margin-left: 30px;
    margin-bottom: 30px;
    text-align: left;

    ul {
        // margin-left: 35px;
        text-align: left;
    }
    li {

    }
  }

  ol {
    margin-left: 30px;
    margin-bottom: 30px;
    text-align: left;

    li {

    }
  }
}
</style>
