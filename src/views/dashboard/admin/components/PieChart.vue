<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import { debounce } from '@/utils';
import { getCategoryItemsCount } from '@/api/dashboard';

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      chart: null,
      legendData: [],
      seriesData: []
    };
  },
  created() {
    this.loadAndInitChart();
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener('resize', this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHandler);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    loadAndInitChart() {
      getCategoryItemsCount().then(response => {
        const categoryItemsCount = response.data.data;
        for (var i = 0; i < categoryItemsCount.length; i++) {
          const categoryItem = categoryItemsCount[i];
          const category = categoryItem.key;
          const value = categoryItem.value;
          this.legendData.push(category);
          this.seriesData.push({
            value: value,
            name: category
          });
        }
        this.initChart(this.legendData, this.seriesData);
      });
    },
    initChart(legendData, seriesData) {
      this.chart = echarts.init(this.$el, 'macarons');

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: legendData
        },
        calculable: true,
        series: [
          {
            name: this.$t('category.items_count'),
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: seriesData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      });
    }
  }
};
</script>
