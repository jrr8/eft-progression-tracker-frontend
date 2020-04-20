<template>
  <div class="back viewport-height p50px">
    <v-card class="card-raised-effect of-auto wdth50p marg-auto hght100p">
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-card
              color="#3a0f0f"
              dark
            >
              <h1>Welcome to Tarkov Assistant</h1>
              <p>
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
              <h4>Hideout Module Progression Graph</h4>
              <ul>
                <li>An interactive graph that shows you all Hideout modules and how they are connected.</li>
                <li>Mark each Hideout module with a visual indication reflected on the graph.</li>
                <li>Mark each Hideout module as tracked.
                    This allows you to see all items needed for the current tracked Hideout module and all previous modules leading up to the tracked module.</li>
                <li>Search the Hideout module graph for specific modules.</li>
              </ul>

              <h4>Hideout Item List</h4>
              <ul>
                <li>View a list of all the items required to construct and upgrade Hideout Modules.</li>
                <li>Add items that you have acquired in raid to your storage.</li>
              </ul>

              <h4>General</h4>
              <ul>
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
              <h4>Quest Progression Graph</h4>
              <ul>
                <li>An interactive graph that displays all quests currently in Escape from Tarkov and the connection between all quests.</li>
                <li>Similar to the hideout module graph, you will be able to complete and track quests.</li>
              </ul>

              <h4>Quests Item List</h4>
              <ul>
                <li>Add the ability to see the items required to complete all quests.</li>
              </ul>

              <h4>General Graph Functionality</h4>
              <ul>
                <li>Add visual indications of which hideout modules/quests are available for completion based on the items you have in your storage and which modules/quests you have completed.</li>
                <li>Add the options to enable restricted mode. This will ensure that you only have the ability to complete hideout modules/quests if you have the required items in your storage.</li>
              </ul>

              <h4>Progression</h4>
              <ul>
                <li>View a summary of the hideout modules completed.</li>
                <li>View a summary of the quests completed, with the ability to categorize them by Traders.</li>
              </ul>

              <h4>Profile</h4>
              <ul>
                <li>Add the ability to create your own profile that stores all of your progress.</li>
                <li>Your profile will be tied to your email, and stored securely. </li>
              </ul>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card
              color="#3a0f0f"
              dark
            >
              <v-card-title class="headline">Discord Channel and Bug Reporting</v-card-title>
              <h4>Discord Channel</h4>
              <ul>
                <li>Join our discord channel <a href="https://discord.gg/GjtZ69F">Tarkov Assistant</a> to get announcements on new updates, potential issues and general information regarding the Tarkov Assistant.</li>
                <li>Here you can also suggest new features you would like to see as well as suggestions on improvements of existing ones.</li>
              </ul>

              <h4>Bug Reporting</h4>
              <ul>
                <li>Please report any and all bugs you find under the bug-report channel in our discord server.</li>
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
    this.$ga.page('/about');
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

.wdth50p {
  width: 50%;
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

    li {

    }
  }
}
</style>
