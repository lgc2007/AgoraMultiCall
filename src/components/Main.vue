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
          this.$message.error(error.message || error);
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
    <div class="operation">
      <p class="question">你准备好加入会议了吗?</p>
      <p class="tip">享受会议时间</p>
      <div class="join-button" @click="handleJoin">加入会议</div>
    </div>

    <div class="footer">
      <div class="desc">demo演示</div>
    </div>
  </div>
</template>

<script>
import VoiceDot from './voice-dot/main.vue';
import MpButtonWhite from './buttons/mp-button-white';
import VideoButtonWhite from './buttons/video-button-white';
import { meetingAttend } from '@/api/url';
import AgoraRTC from 'agora-rtc-sdk-ng';
export default {
  name: 'Main',
  components: {
    VoiceDot,
    MpButtonWhite,
    VideoButtonWhite
  },
  props: {
    channel: {
      type: [String, null]
    },
    appid: {
      type: [String, null]
    },
    token: {
      type: [String, null]
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
      const client = AgoraRTC.createClient();
      console.log('ssssss:', client);
      meetingAttend({
        id: this.$store.state.user.meetingPage.id,
      }).then(({ obj: {
        channelName, meetingUsers, rtcToken, salt, secretKey
      }}) => {
        console.log(channelName, meetingUsers, rtcToken, salt, secretKey);
        this.$store.commit('user/setState', {
          channelName, meetingUsers, rtcToken, salt, secretKey
        });
        console.log('ccc:', this.hex2ascii(secretKey), 'bbb:', this.base64ToUint8Array(salt));
        client.setEncryptionConfig('aes-128-gcm2', this.hex2ascii(secretKey), this.base64ToUint8Array(salt));
        this.$refs.mainref.AgoraRTC.createClient().setEncryptionConfig('aes-128-gcm2', this.hex2ascii(secretKey), this.base64ToUint8Array(salt));
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
