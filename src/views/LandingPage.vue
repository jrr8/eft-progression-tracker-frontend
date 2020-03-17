<template>
  <div id="wrapper">
        <button class="button button5 button-fill-bottom" @click="$router.push('features')">Try It Out</button>
        <button class="button button5 disabled" title="Coming Soon">Login </button>
  </div>
</template>

<script>

export default {
  name: 'LandingPage',
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
.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 100px;
  margin: 16px 16px;
  cursor: pointer;
}

.button5 {
    border-radius: 50%;
    width: 450px;
    height: 450px;
    border: 2px solid black
}

.disabled {
  background-color: grey;
}

.disabled:hover{
    cursor: initial;
}


#wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-fill-bottom {
box-shadow: inset 0px 0px 0px #2F3B47;
transition: all 0.1s !important;
}

.button-fill-bottom:hover {
box-shadow: inset 0px -500px 0px #2F3B47;
}

</style>
