<template>
  <div class="home">
    <h1>HackerRank 2018 Survey Participants</h1>
    <a
      href="https://research.hackerrank.com/developer-skills/2018/"
      target="blank"
    >
      https://research.hackerrank.com/developer-skills/2018/
    </a>
    <map-vis :counts="countsData" :countries="countriesData" />
  </div>
</template>

<script>
import MapVis from "@/components/MapVis.vue";

export default {
  name: "Home",
  components: { MapVis },
  data: () => ({
    countriesData: {},
    countsData: []
  }),
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const res = await fetch("data.json");
      const result = await res.json();

      this.countriesData = result.countries;
      this.countsData = result.counts;
    }
  }
};
</script>

<style lang="scss">
.home {
  h1 {
    font-size: 3rem;
    margin-bottom: 0.2rem;
  }

  a {
    display: block;
    font-size: 1.5rem;
    margin: 0 0 4rem;
    color: white;
    text-decoration-color: white;
  }
}
</style>
