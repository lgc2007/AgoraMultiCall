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
      :auto-start="true"
      @rtc-loaded="handleUserLoaded"
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
// import AgoraRTM from 'agora-rtm-sdk';
import RtmClient from '@/utils/rtm-client.js';
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
    },
    rtmToken() {
      return this.$store.state.user.rtmToken;
    },
    userId() {
      return this.$store.state.user.userId;
    },
    channelName() {
      return this.$store.state.user.channelName;
    },
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
    subscribeClientEvents () {
      // 订阅客户端事件
      const clientEvents = [
        'ConnectionStateChanged',
        'MessageFromPeer'
      ];
      clientEvents.forEach((eventName) => {
        this.client.on(eventName, (...args) => {
          console.log('emit ', eventName, ...args);
          // log event message
          this.emit(eventName, ...args);
        });
      });
    },
    subscribeChannelEvents (channelName) {
      // 订阅频道事件
      const channelEvents = [
        'ChannelMessage',
        'MemberJoined',
        'MemberLeft'
      ];
      channelEvents.forEach((eventName) => {
        this.channels[channelName].channel.on(eventName, (...args) => {
          console.log('emit ', eventName, args);
          this.emit(eventName, { channelName, args: args });
        });
      });
    },
    async login (accountName, token) {
      this.accountName = accountName;
      return this.client.login({ uid: this.accountName, token });
    },
    async logout () {
      return this.client.logout();
    },
    async joinChannel (name) {
      console.log('joinChannel', name);
      const channel = this.client.createChannel(name);
      this.channels[name] = {
        channel,
        joined: false // channel state
      };
      this.subscribeChannelEvents(name);
      return channel.join();
    },
    async leaveChannel (name) {
      console.log('leaveChannel', name);
      if (!this.channels[name] ||
      (this.channels[name] &&
        !this.channels[name].joined)) return;
      return this.channels[name].channel.leave();
    },

    // async joinRtm() {
    //   const options = {
    //     uid: this.userId,
    //     token: this.rtmToken,
    //   };
    //   const appID = this.appid;
    //   // 初始化客户端
    //   const client = AgoraRTM.createInstance(appID);
    //   const channel = client.createChannel(this.channelName);
    //   console.log(client);
    //   await client.login(options);
    //   await channel.join().then(() => {
    //     console.log('You have successfully joined channel', channel.channelId);
    //   });
    //   // 客户端事件监听
    //   // 显示对端发送的消息
    //   client.on('MessageFromPeer', function (message, peerId) {
    //     console.log('显示对端发送的消息:', message, peerId);
    //   });
    //   // 显示连接状态变化
    //   client.on('ConnectionStateChanged', function (state, reason) {
    //     console.log('显示连接状态变化:', state, reason);
    //   });

    //   channel.on('ChannelMessage', function (message, memberId) {
    //     console.log('ChannelMessage:', message, memberId);
    //   });
    //   // 显示频道
    //   channel.on('MemberJoined', function (memberId) {
    //     console.log('显示频道:', memberId);
    //   });
    //   // 频道成员
    //   channel.on('MemberLeft', function (memberId) {
    //     console.log('频道成员:', memberId);
    //   });
    // },

    async joinRtm() {
      const rtm = new RtmClient();
      rtm.init(this.appid);
      window.rtm = rtm;
      await rtm.login(String(this.userId), this.rtmToken).then(() => {
        console.log('登陆成功');
        rtm._logined = true;
        this.$toast('Login: ' + this.userId, ' token: ', this.rtmToken);
      }).catch((err) => {
        console.log(err);
      });
      rtm.joinChannel(this.channelName).then(() => {
        console.log(rtm.accountName, ' 加入成功');
        rtm.channels[this.channelName].joined = true;
      }).catch((err) => {
        this.$toast.fail('加入失败');
        console.error(err);
      });
      rtm.on('MessageFromPeer', async (message, peerId) => {
        // 显示对端发送的消息
        console.log('显示对端发送的消息message ' + message.text + ' peerId' + peerId);
      });
      rtm.on('MemberJoined', ({ channelName, args }) => {
        // 显示频道
        const memberId = args[0];
        console.log('显示频道channel ', channelName, ' member: ', memberId, ' joined');
      });
      rtm.on('MemberLeft', ({ channelName, args }) => {
        // 频道成员
        const memberId = args[0];
        console.log('频道成员channel ', channelName, ' member: ', memberId, ' joined');
      });
      rtm.on('ChannelMessage', async ({ channelName, args }) => {
        const [message, memberId] = args;
        console.log('sssss:', JSON.parse(message.text));
        const { action, userId, reason, rotate, audioState, videoState } = JSON.parse(message.text);
        if (rotate) {
          switch (reason.action) {
            case 'EXIT_MEETING':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: reason.userId, isOnline: 0 }]);
              break;
            case 'ATTEND_MEETING':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: reason.userId, isOnline: 1, audioState: reason.audioState, videoState: reason.videoState }]);
              break;
            case 'TURN_OFF_VIDEO':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: reason.userId, videoState: 0 }]);
              break;
            case 'TURN_ON_VIDEO':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: reason.userId, videoState: 1 }]);
              break;
            case 'TURN_OFF_AUDIO':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: reason.userId, audioState: 0 }]);
              break;
            case 'TURN_ON_AUDIO':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: reason.userId, audioState: 1 }]);
              break;
            case 'ATTEND_SPEECHSEAT':
              this.$store.dispatch('user/UPDATE_MEETING', [...(rotate.map((item, index) => {
                return { ...item, isSpeech: 0 };
              })), { isSpeech: 1, audioState: reason.audioState, userId: reason.userId, videoState: reason.videoState }]);
              break;
            case 'EXIT_SPEECHSEAT':
              this.$store.dispatch('user/UPDATE_MEETING', [...rotate, { isSpeech: 0, audioState: reason.audioState, userId: reason.userId, videoState: reason.videoState }]);
              break;
            default:
              break;
          }
        } else {
          switch (action) {
            case 'EXIT_MEETING':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: userId, isOnline: 0, }]);
              break;
            case 'ATTEND_MEETING':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: userId, isOnline: 1, audioState, videoState }]);
              break;
            case 'TURN_OFF_VIDEO':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: userId, videoState: 0 }]);
              break;
            case 'TURN_ON_VIDEO':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: userId, videoState: 1 }]);
              break;
            case 'TURN_OFF_AUDIO':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: userId, audioState: 0 }]);
              break;
            case 'TURN_ON_AUDIO':
              this.$store.dispatch('user/UPDATE_MEETING', [{ userId: userId, audioState: 1 }]);
              break;
            case 'TURN_OFF_ALL_VIDEO':
              this.$store.commit('user/TURN_OFF_ALL_VIDEO');
              break;
            default:
              break;
          }
        }
        console.log('频道消息channel ', channelName, ', messsage: ', message.text, ', memberId: ', memberId);
      });
    },
    handleJoin() {
      // const client = AgoraRTC.createClient();
      meetingAttend({
        id: this.$store.state.user.meetingPage.id,
      }).then(({ obj: {
        channelName, meetingUsers, rtcToken, salt, secretKey
      }}) => {
        this.$store.commit('user/setState', {
          channelName, meetingUsers, rtcToken, salt, secretKey, encryptSalt: this.base64ToUint8Array(salt), encryptSecretKey: this.hex2ascii(secretKey),
        });
        // this.joinRtm();
        const { audioState, videoState, isRotate, isSpeech } = meetingUsers.find(m => m.agoraId === this.$store.state.user.agoraId);
        // console.log('ccc:', this.hex2ascii(secretKey), 'bbb:', this.base64ToUint8Array(salt));
        // client.setEncryptionConfig('aes-128-gcm2', this.hex2ascii(secretKey), this.base64ToUint8Array(salt));
        // this.$refs.mainref.AgoraRTC.createClient().setEncryptionConfig('aes-128-gcm2', this.hex2ascii(secretKey), this.base64ToUint8Array(salt));
        // this.$refs.mainref.getClient().setEncryptionConfig('aes-128-gcm2', this.hex2ascii(secretKey), this.base64ToUint8Array(salt));
        this.$emit('join-meeting', {
          channel: channelName || this.channel,
          mute: !audioState,
          cameraOff: !videoState
        });
      });
    },
    handleMpClick() {
      this.mute = !this.mute;
    },
    handleVideoClick() {
      this.cameraOff = !this.cameraOff;
    },
    handleUserLoaded() {
      this.$refs.mainref.getAgoraRtc().setLogLevel(2);
      // SDK加载完成，此时可以读取 AgoraRTC 对象, 在此之前调用 getAgoraRTC 是拿不到 AgoraRTC 对象的。
      console.log('SDK加载完成:');
    },
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
