<template>
  <div class="map-vis">
    <map-svg
      @country-hover="changeCountry"
      @mousemove.native="handleMousemove"
    />
    <div class="map-vis__date">
      <vue-slider
        v-model="dateRange"
        :height="15"
        :lazy="true"
        :contained="true"
        :enable-cross="false"
        tooltip="always"
      >
        <template v-slot:tooltip="{ value, focus }">
          <div
            class="vue-slider-dot-tooltip-inner vue-slider-dot-tooltip-inner-top"
          >
            <span
              class="vue-slider-dot-tooltip-text"
              :class="{ 'vue-slider-dot-tooltip-inner-focus': focus }"
            >
              {{
                new Intl.DateTimeFormat(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric"
                }).format(
                  new Date(dates[0] + (value / 100) * (dates[1] - dates[0]))
                )
              }}
            </span>
          </div>
        </template>
      </vue-slider>
    </div>
    <keep-alive>
      <div v-if="current.code" class="map-vis__tooltip" :style="tooltipStyle">
        <div class="map-vis__detail">
          <h2>{{ current.country }}</h2>
          <span class="count"># of participants: {{ current.count }}</span>
        </div>
        <img
          v-if="current.code"
          :src="`https://www.countryflags.io/${current.code}/shiny/64.png`"
          :alt="`Flag of ${current.country}`"
        />
      </div>
    </keep-alive>
    <table>
      <tr>
        <th>Country</th>
        <th>Number of Participants</th>
      </tr>
      <tr v-for="code in sortedCountries" :key="code">
        <td>{{ countries[code] }}</td>
        <td>{{ filteredCounts[code] }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import MapSvg from "@/components/MapSvg.vue";
import "vue-slider-component/theme/default.css";

export default {
  components: { VueSlider, MapSvg },
  props: {
    countries: { type: Object, default: () => ({}) },
    counts: { type: Array, default: () => [] }
  },
  data: () => ({
    styleEl: null,
    current: {},
    mouse: { x: 0, y: 0 },
    dateRange: [0, 100]
  }),
  computed: {
    tooltipStyle() {
      return {
        "--tooltip-x": `${this.mouse.x + 10}px`,
        "--tooltip-y": `${this.mouse.y + 15}px`
      };
    },
    dates() {
      if (this.counts.length) {
        const min = this.counts[0].date;
        const max = this.counts[this.counts.length - 1].date;
        return [
          min + (this.dateRange[0] / 100) * (max - min),
          min + (this.dateRange[1] / 100) * (max - min)
        ];
      } else {
        return [0, 0];
      }
    },
    filteredCounts() {
      const countries = this.countries;
      const dates = this.dates;
      const filteredCounts = {};

      Object.keys(countries).forEach(code => {
        filteredCounts[code] = 0;
      });
      const [minDate, maxDate] = dates;
      this.counts.forEach(({ country, date }) => {
        if (date >= minDate && date <= maxDate) {
          filteredCounts[country]++;
        }
      });

      return filteredCounts;
    },
    sortedCountries() {
      const filteredCounts = this.filteredCounts;
      return Object.keys(filteredCounts).sort(
        (a, b) => filteredCounts[b] - filteredCounts[a]
      );
    }
  },
  watch: {
    filteredCounts(counts) {
      const ease = t => 1 + --t * t * t * t * t;

      const codes = Object.keys(counts);
      const max = codes.reduce((max, code) => Math.max(counts[code], max), 0);

      const style = codes
        .map(code => {
          const color = Math.min(1, ease(counts[code] / max) * 1.3);
          const hover = Math.min(color + 0.1, 1);

          const colorRound = color.toFixed(2);
          const hoverRound = hover.toFixed(2);
          const fillStyle = `#${code} { fill: rgba(255, 255, 255, ${colorRound}); }`;
          const hoverStyle = `#${code}:hover { fill: rgba(255, 255, 255, ${hoverRound}); }`;
          return fillStyle + hoverStyle;
        })
        .join("");

      if (!this.styleEl) {
        this.styleEl = document.createElement("style");
        document.getElementsByTagName("head")[0].appendChild(this.styleEl);
      }

      this.styleEl.type = "text/css";
      this.styleEl.innerHTML = style;
    }
  },
  methods: {
    changeCountry(code) {
      const filteredCounts = this.filteredCounts;
      const countries = this.countries;
      if (filteredCounts[code]) {
        this.current = {
          code,
          country: countries[code],
          count: filteredCounts[code]
        };
      } else {
        this.current = {};
      }
    },
    handleMousemove(e) {
      this.mouse = { x: e.clientX, y: e.clientY };
    }
  }
};
</script>

<style lang="scss">
.map-vis {
  overflow: hidden;

  &__tooltip {
    position: fixed;
    top: 0;
    left: 0;
    transform: translate(var(--tooltip-x, 0), var(--tooltip-y, 0));
    color: black;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 1rem;
    border-radius: 1rem;
    border-top-left-radius: 0;
    display: flex;
    align-items: center;
    pointer-events: none;
    user-select: none;
    transition: 0.2s transform;

    img {
      margin-left: 2rem;
    }
  }

  &__detail {
    text-align: left;

    h2 {
      font-size: 1.2rem;
      margin-right: 100px;
      margin: 0.2rem 0;
    }
  }

  &__date {
    max-width: 800px;
    margin: 1rem auto;
  }

  table {
    text-align: left;
    margin: 0 auto;
  }
}
</style>
