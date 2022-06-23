<template>
  <div
    class="avatar-icon"
  ></div>
</template>

<script>

export default {
  name: 'AvatarAudio',
  props: {
    level: {
      type: Number,
      default: 0
    },
    mute: {
      type: Boolean,
      default: false
    },
    cameraOff: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      borderWidth: 0,
      showRing: false,
      timestamp: Date.now()
    };
  },
};
</script>

<style lang="stylus" scoped>
$main_size=160px
$main_interval=0.6s
.avatar-icon{
  position: absolute;
  left: 50%
  top: 50%
  transform translate(-50%,-50%)
  width "min(160px, 30%)" % null
  padding-bottom "min(160px, 30%)" % null
  background-color: #fff;
  background-image url("../../assets/yonghu.svg");
  background-size 70%
  background-repeat no-repeat
  background-position center
  border-radius 50%
  //z-index 0
  border-style: solid
  border-color grey
  //transition border-width 0.01s ease-in
  box-sizing content-box
  transform-origin center
  // &.ring:after{
  //   animation wave 3s linear
  // }

  @keyframes wave{
    0%{
      opacity: 1
      transform scale(0.8) translate(-50%,-50%)
    }
    50%{
      opacity: 0
      transform scale(2) translate(-50%,-50%)
    }
    100%{
      opacity: 0
      transform scale(0.8) translate(-50%,-50%)
    }
  }

  &:after{
    border-radius 50%
    display block
    content ""
    background-color: transparent;
    border 1px solid darkgray;
    box-sizing border-box;
    //width: $main_size;
    //height $main_size;
    width min(160px, 100%)
    padding-bottom min(160px, 100%)
    position: absolute;
    top: 50%
    left 50%
    transform translate(-50%,-50%)
    transform-origin 0 0
    z-index 1
    //transition all $main_interval ease-in-out
  }
}
</style>
