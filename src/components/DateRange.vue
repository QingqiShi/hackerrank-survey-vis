<template>
  <div class="date-range">
    <vue-slider
      v-model="value"
      tooltip="always"
      :height="15"
      :enable-cross="false"
      :tooltip-placement="['top', 'bottom']"
      :tooltip-formatter="
        val =>
          new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric'
          }).format(new Date(valueToDate(val)))
      "
      @change="handleChange"
    />
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default {
  components: { VueSlider },
  props: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  data: () => ({
    value: [0, 100]
  }),
  methods: {
    handleChange(val) {
      this.$emit("change", [
        this.valueToDate(val[0]),
        this.valueToDate(val[1])
      ]);
    },
    valueToDate(val) {
      return this.min + (val / 100) * (this.max - this.min);
    }
  }
};
</script>

<style>
.date-range {
  max-width: 800px;
  margin: 2rem auto 3rem;
}
</style>
