<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-05-19 15:04:26
 * @LastEditors: lgc
 * @LastEditTime: 2022-05-20 14:47:19
-->
<template>
  <ar-button @click="handleClick"/>
</template>

<script>
import ArButton from "./ar-button.vue"
export default {
  name: "MpButton",
  components:{
    ArButton
  },
  methods:{
    handleClick(e){
      this.$emit("click", e)
    }
  }
};
</script>

<style scoped lang="stylus">
.button{
  &.mp-normal{
    background-image: url("../../assets/microphone.svg");
  }
  &.mp-mute{
    background-image: url("../../assets/microphone_mute.svg");
  }
  &:hover{
    &:before{
      content: "开关麦克风";
     }
   }
}
</style>
