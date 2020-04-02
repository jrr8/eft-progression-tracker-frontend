<template>
  <div class="back viewport-height" style="padding: 50px;">
    <v-card class="card-raised-effect card-overflow-auto" style="width: 50%; margin: auto; height: 100%;">
      <v-card-title>
      </v-card-title>
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-card
              color="#3a0f0f"
              dark
            >
              <h1 class="card-title-center-text">Welcome to Tarkov Assistant</h1>
              <p style="text-align: left; margin-left: 25px">
                Welcome to the Tarkov Assistant, a useful tool to aid both new and old players alike. 
                Here you can view and track your overall progression of the Hideout aspect for Escape from Tarkov. 
                Along with general progression, you will be able to view what items you need for specific Hideout modules, as well as the modules leading up to said module. 
                You will have the ability to “store” the items you acquire in raid. 
                These features will aid you in keeping track of the items you need while both in and out of raid to get you back in the action quicker.</p>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card
              color="#3a0f0f"
              dark
            >
              <v-card-title class="headline">Version 1.0.0 Features (Initial Release)</v-card-title>
              <h4 style="text-align: left; margin-left: 25px">Hideout Module Progression Graph</h4>
              <ul class="list-margin list-align-text-left">
                <li>An interactive graph that shows you all Hideout modules and how they are connected.</li>
                <li>Mark each Hideout module with a visual indication reflected on the graph.</li>
                <li>Mark each Hideout module as tracked. This allows you to see all items needed for the current tracked Hideout module and all previous modules leading up to the tracked module.</li>
                <li>Search the Hideout module graph for specific modules.</li>
              </ul>  

              <h4 style="text-align: left; margin-left: 25px">Hideout Item List</h4>
              <ul class="list-margin list-align-text-left">
                <li>View a list of all the items required to construct and upgrade Hideout Modules.</li>
                <li>Add items that you have acquired in raid to your storage.</li>
              </ul>  

              <h4 style="text-align: left; margin-left: 25px">General</h4>
              <ul class="list-margin list-align-text-left">
                <li>Progression is stored using your browser storage, ensuring your progress persists across multiple browser sessions.</li>
              </ul>  
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card
              color="#3a0f0f"
              dark
            >
              <v-card-title class="headline">Upcoming Features</v-card-title>
              <h4 style="text-align: left; margin-left: 25px">Quest Progression Graph</h4>
              <ul class="list-margin list-align-text-left">
                <li>An interactive graph that displays all quests currently in Escape from Tarkov and the connection between all quests.</li>
                <li>Similar to the hideout module graph, you will be able to complete and track quests.</li>
              </ul>  

              <h4 style="text-align: left; margin-left: 25px">Quests Item List</h4>
              <ul class="list-margin list-align-text-left">
                <li>Add the ability to see the items required to complete all quests.</li>
              </ul>  

              <h4 style="text-align: left; margin-left: 25px">General Graph Functionality</h4>
              <ul class="list-margin list-align-text-left">
                <li>Add visual indications of which hideout modules/quests are available for completion based on the items you have in your storage and which modules/quests you have completed.</li>
                <li>Add the options to enable restricted mode. This will ensure that you only have the ability to complete hideout modules/quests if you have the required items in your storage.</li>
              </ul>  

              <h4 style="text-align: left; margin-left: 25px">Progression</h4>
              <ul class="list-margin list-align-text-left">
                <li>View a summary of the hideout modules completed.</li>
                <li>View a summary of the quests completed, with the ability to categorize them by Traders.</li>
              </ul>  

              <h4 style="text-align: left; margin-left: 25px">Profile</h4>
              <ul class="list-margin list-align-text-left">
                <li>Add the ability to create your own profile that stores all of your progress.</li>
                <li>Your profile will be tied to your email, and stored securely. </li>
              </ul>  
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'About',
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
.back {
  background-image: url(https://cdn.wccftech.com/wp-content/uploads/2017/04/escape-from-tarkov-logo.jpg);
  background-size: cover;
}

.card-raised-effect {
  box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.233), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.list-margin {
  margin-left: 30px;
  margin-bottom: 30px;
}

.list-align-text-left {
  text-align: left; 
}

.list-margin-left.li {
  margin-bottom: 5px;
}

.card-overflow-auto {
  overflow: auto;
}

.card-title-center-text {
  text-align: center;
}

.card-title-margin {
  margin: 10px;
}
</style>
