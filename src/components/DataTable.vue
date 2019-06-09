<template>
  <table class="data-table">
    <tr>
      <th>Country</th>
      <th>Number of Participants</th>
    </tr>
    <tr v-for="code in sortedCountryList" :key="code">
      <td>{{ tableData[code].country }}</td>
      <td>{{ tableData[code].count }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    tableData: { type: Object, default: () => ({}) }
  },
  computed: {
    sortedCountryList() {
      return Object.keys(this.tableData).sort(
        (a, b) => this.tableData[b].count - this.tableData[a].count
      );
    }
  }
};
</script>

<style>
.data-table {
  text-align: left;
  margin: 0 auto;
}
</style>
