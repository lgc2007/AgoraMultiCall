<!--
 * @Description:
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-06-17 11:00:04
 * @LastEditors: lgc
 * @LastEditTime: 2022-06-30 15:53:11
-->

<template>

  <svg :class="svgClass" aria-hidden="true" v-on="$listeners">

    <!-- xlink:href=#dl-icon-lqz -->

    <use :xlink:href="iconName" />

  </svg>

</template>

<script>

export default {

  name: 'SvgIcon',

  props: {

    iconClass: {

      type: String,

      required: true,

    },

    className: {

      type: String,

      default: '',

    },

  },

  computed: {

    svgClass() {
      if (this.iconClass) {
        return `svg-icon ${this.iconClass} ${this.className}`;
      }

      return 'svg-icon';
    },

    iconName() {
      return `#icon-${this.iconClass}`;
    },

  },

};

</script>

<style scoped>

.svg-icon{
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;

}

</style>
