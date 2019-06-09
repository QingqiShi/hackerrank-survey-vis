<template>
  <div class="map-vis">
    <map-svg
      @country-hover="changeCountry"
      @mousemove.native="handleMousemove"
    />
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
  </div>
</template>

<script>
import MapSvg from "@/components/MapSvg.vue";

export default {
  components: { MapSvg },
  props: {
    counts: { type: Object, default: () => ({}) }
  },
  data: () => ({
    styleEl: null,
    current: {},
    mouse: { x: 0, y: 0 }
  }),
  computed: {
    tooltipStyle() {
      return {
        "--tooltip-x": `${this.mouse.x + 10}px`,
        "--tooltip-y": `${this.mouse.y + 15}px`
      };
    }
  },
  watch: {
    counts(counts) {
      const ease = t => 1 + --t * t * t * t * t;

      const codes = Object.keys(counts);
      const max = codes.reduce(
        (max, code) => Math.max(counts[code].count, max),
        0
      );

      const style = codes
        .map(code => {
          const color = Math.min(1, ease(counts[code].count / max) * 1.3);
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
      const counts = this.counts;
      if (counts[code]) {
        this.current = {
          code,
          country: counts[code].country,
          count: counts[code].count
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
}
</style>
