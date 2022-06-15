<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: lgc
 * @Date: 2022-05-19 15:04:26
 * @LastEditors: lgc
 * @LastEditTime: 2022-05-25 10:13:52
-->
<template>
  <ar-button @click="handleClick"/>
</template>

<script>
import ArButton from "./ar-button.vue"
export default {
  name: "CloseButton",
  components:{
    ArButton
  } ,
  methods:{
    handleClick(e){
      this.$emit("click", e)
    }
  }
};
</script>

<style scoped lang="stylus">
.button{
  background-image: url("../../assets/guaduan.svg");
  &:hover{
    &:before{
      content: "离开会议";
     }
   }
}
</style>
