<template>
  <div class="main">
    <div class="banner">
      <div class="logo">
        多人会议
      </div>
    </div>
    <agora
      ref="mainref"
      channel="channel"
      :auto-start="false"
      :error-handler="
        error => {
          this.$toast.fail(error.message || error);
        }
      "
    >
      <agora-video-sender
        customization-player
        :camera-off="cameraOff"
        @video-ready="handleVideoReady"
      />
      <agora-audio-sender
        ref="audioSender"
        :mute="mute"
        @track-created="handleTrackCreated"
      />
    </agora>
    <div
      v-if="localVideoDirective"
      ref="cameraArea"
      v-player="localVideoDirective"
      class="camera-area"
      :class="playerClass"
    >
      <voice-dot class="voice-dot-local" :mute="mute" :level="level" />
      <mp-button-white
        class="mp-btn-local"
        :class="mpClass"
        @click="handleMpClick"
      ></mp-button-white>
      <video-button-white
        class="video-btn-local"
        :class="videoClass"
        @click="handleVideoClick"
      ></video-button-white>
    </div>
    <div class="join-button" @click="handleJoin">
      <van-button
        round
        block
        type="info"
        native-type="submit"
      >加入会议</van-button></div>
    <!-- <div class="operation"> -->
    <!-- <p class="question">你准备好加入会议了吗?</p>
      <p class="tip">享受会议时间</p> -->
    <!-- <div class="join-button" @click="handleJoin">加入会议</div> -->
    <!-- </div> -->

    <!-- <div class="footer">
      <div class="desc">demo演示</div>
    </div> -->
  </div>
</template>

<script>
import VoiceDot from './voice-dot/main.vue';
import MpButtonWhite from './buttons/mp-button-white';
import VideoButtonWhite from './buttons/video-button-white';
import { meetingAttend } from '@/api/url';
// import AgoraRTC from 'agora-rtc-sdk-ng';
import { Button } from 'vant';
export default {
  name: 'Main',
  components: {
    VoiceDot,
    MpButtonWhite,
    VideoButtonWhite,
    [Button.name]: Button,
  },
  props: {
    channel: {
      type: String,
      default: null,
    },
    appid: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      localVideoDirective: null,
      mute: false,
      level: 0,
      cameraOff: false
    };
  },
  computed: {
    mpClass() {
      return this.mute ? 'mp-mute' : 'mp-normal';
    },
    videoClass() {
      return this.cameraOff ? 'video-mute' : 'video-normal';
    },
    playerClass() {
      return this.cameraOff ? 'camera-off' : '';
    }
  },
  methods: {
    handleVideoReady(localVideo) {
      this.localVideoDirective = localVideo;
    },
    handleTrackCreated() {
      let id;
      const callback = () => {
        this.level = this.$refs.audioSender.getTrack().getVolumeLevel();
        id = window.requestAnimationFrame(callback);
      };
      id = window.requestAnimationFrame(callback);
      this.$once('hook:beforeDestroy', () => {
        window.cancelAnimationFrame(id);
      });
    },
    base64ToArrayBuffer(base64) {
      var binary_string = window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
    },
    base64ToUint8Array(base64Str) {
      // 声明一个工具函数，用于将 Base64 转换成 Uint8Array。
      const raw = window.atob(base64Str);
      const result = new Uint8Array(new ArrayBuffer(raw.length));

      for (let i = 0; i < raw.length; i += 1) {
        result[i] = raw.charCodeAt(i);
      }

      return result;
    },
    hex2ascii(hexx) {
      // 声明一个工具函数，用于将 Hex 转换成 ASCII。
      const hex = hexx.toString();// force conversion
      let str = '';
      for (let i = 0; i < hex.length; i += 2) { str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)); }
      return str;
    },
    handleJoin() {
      // const client = AgoraRTC.createClient();
      console.log('ssssss:', this.$refs.mainref.AgoraRTC.createClient(), this.$refs.mainref.AgoraRTC.createClient());
      meetingAttend({
        id: this.$store.state.user.meetingPage.id,
      }).then(({ obj: {
        channelName, meetingUsers, rtcToken, salt, secretKey
      }}) => {
        console.log(channelName, meetingUsers, rtcToken, salt, secretKey);
        this.$store.commit('user/setState', {
          channelName, meetingUsers, rtcToken, salt, secretKey, encryptSalt: this.base64ToUint8Array(salt), encryptSecretKey: this.hex2ascii(secretKey)
        });
        // console.log('ccc:', this.hex2ascii(secretKey), 'bbb:', this.base64ToUint8Array(salt));
        // client.setEncryptionConfig('aes-128-gcm2', this.hex2ascii(secretKey), this.base64ToUint8Array(salt));
        // this.$refs.mainref.AgoraRTC.createClient().setEncryptionConfig('aes-128-gcm2', this.hex2ascii(secretKey), this.base64ToUint8Array(salt));
        // this.$refs.mainref.getClient().setEncryptionConfig('aes-128-gcm2', this.hex2ascii(secretKey), this.base64ToUint8Array(salt));
        this.$emit('join-meeting', {
          channel: channelName || this.channel,
          mute: this.mute,
          cameraOff: this.cameraOff
        });
      });
    },
    handleMpClick() {
      this.mute = !this.mute;
    },
    handleVideoClick() {
      this.cameraOff = !this.cameraOff;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../styles/main/index.styl"
</style>
<style lang="scss" scoped>
$bgc_color:#fff;
$main_color: #099dfd;
.camera-area{
    position: absolute;
    top: 10vh;
    left: 25vw;
    width: 50vw;
    height: 50vh;
    border-radius: 1vw;
    overflow: hidden;
    background-color: #000;
    &:after{
      position: absolute;
      left: 0;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      display: block;
      content: "检测不到视频画面";
      color: #fff;
      font-size: 1.5em;
      background-color: #000;
      text-align: center;
      z-index: -1;
    }
    &.camera-off{
      &:after{
        z-index: 1;
      }
    }
    .voice-dot-local{
      position: absolute;
      bottom: 16px;
      left: 20px;
    }
    .mp-btn-local,.video-btn-local{
      position: absolute;
      bottom: 0px;
      left: 50%;
      z-index: 1;
    }
    .mp-btn-local{
      transform: translateX(-140%);
    }
    .video-btn-local{
      transform: translateX(0%);
    }
  }
  .join-button{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    box-sizing: border-box;
    width: 100%;
    padding: 0 16px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
      // width: 7em;
      // line-height:  3em;
      // border-radius:  3em;
      // text-align:  center;
      // background-color: $main_color;
      // color:  #fff;
      // font-size:  1em;
      // cursor:  pointer;
    }
</style>
