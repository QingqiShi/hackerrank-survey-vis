<template>
  <div class="home">
    <h1>HackerRank 2018 Survey Participants</h1>
    <a
      href="https://research.hackerrank.com/developer-skills/2018/"
      target="blank"
    >
      https://research.hackerrank.com/developer-skills/2018/
    </a>
    <map-vis :counts="tableData" :date-range="dateRange" />
    <date-range
      :min="countsData[0].date"
      :max="countsData[countsData.length - 1].date"
      @change="handleDateChange"
    />
    <data-table :table-data="tableData" />
  </div>
</template>

<script>
import MapVis from "@/components/MapVis.vue";
import DataTable from "@/components/DataTable.vue";
import DateRange from "@/components/DateRange.vue";

export default {
  name: "Home",
  components: { MapVis, DataTable, DateRange },
  data: () => ({
    countriesData: {},
    countsData: [0],
    dateRange: [0, 0]
  }),
  computed: {
    tableData() {
      const data = {};
      Object.keys(this.countriesData).forEach(code => {
        data[code] = { count: 0, country: this.countriesData[code] };
      });
      this.countsData.forEach(countObj => {
        if (
          countObj.date >= this.dateRange[0] &&
          countObj.date <= this.dateRange[1]
        ) {
          data[countObj.country].count++;
        }
      });
      return data;
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const res = await fetch("data.json");
      const result = await res.json();

      this.countriesData = result.countries;
      this.countsData = result.counts;

      this.dateRange = [
        this.countsData[0].date,
        this.countsData[this.countsData.length - 1].date
      ];
    },
    handleDateChange(val) {
      this.dateRange = val;
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
