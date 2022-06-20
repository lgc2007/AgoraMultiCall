<template>
  <div class="meet">
    <div class="local_player">
      <agora
        ref="ar"
        :channel="channel"
        :appid="appid"
        :token="token"
        :uid="userId"
        :client-config="{ mode: 'live', role: 'host' }"
        :auto-start="true"
        :error-handler="handleError"
        enable-dual-stream
        @rtc-loaded="handleUserLoaded"
        @crypt-error="cryptError"
        @user-joined="handleUserJoin"
        @user-published="handleUserPublished"
        @user-left="handleUserLeft"
        @join-success="handleJoinSuccess"
        @client-created="handleClientCreated"
        @stream-fallback="handleStreamFallback"
      >
        <agora-audio-sender
          ref="audioSender"
          :mute="mute"
          @track-created="handleAudioTrackCreated"
        ></agora-audio-sender>
        <agora-audio-receiver ref="audioReceiver" :refuse="refuseList" />
        <agora-video-sender
          ref="videoSender"
          :camera-off="cameraIsClosed"
          customization-player
          @video-ready="handleVideoReady"
          @video-close="handleVideoClose"
        ></agora-video-sender>
        <agora-video-receiver
          customization-player
          :refuse="refuseList"
          @video-ready="handleRemoteVideoReady"
        ></agora-video-receiver>
      </agora>
      <!-- <agora
        v-if="openScreenSharing"
        ref="screenAr"
        :channel="channel"
        :appid="appid"
        :token="token"
        :uid="shareScreenUID"
      >
        <agora-video-sender
          customization-player
          type="screen"
          @video-ready="handleScreenVideoReady"
          @video-close="handleScreenVideoClose"
          @video-create-failed="handleScreenVideoFailed"
        ></agora-video-sender>
      </agora> -->
    </div>
    <div
      class="player"
      :class="{
        'screen-share-player': youAreShareScreening || otherIsShareScreening
      }"
    >
      <div
        v-for="user_id in userIdList"
        :key="user_id"
        class="user-vision"
        :class="{
          'screen-share-vision': user_id === shareScreenUID,
          'screen-share-vision-pined':
            user_id === shareScreenUID && user_id === pinedUid
        }"
      >
        <div
          v-if="playList.find(e => e.uid === user_id)"
          v-show="!streamFallbackList.includes(user_id)"
          v-player="playList.find(e => e.uid === user_id)"
          class="player-vision"
        ></div>
        <div class="ban">
          <pin-button
            v-if="pined && user_id === pinedUid"
            :could-hover="false"
          />
          <voice-dot
            :level="
              audioStatusObj[user_id || uid] &&
                audioStatusObj[user_id || uid].level
                ? audioStatusObj[user_id || uid].level
                : 0
            "
            :mute="
              audioStatusObj[user_id || uid] &&
                audioStatusObj[user_id || uid].mute !== false
            "
          />
          <p>
            {{ user_id || "you"
            }}<span v-if="user_id === uid && inMeeting"> ( you ) </span>
          </p>
        </div>
        <avatar-audio
          avatar="../assets/yonghu.svg"
          :level="
            audioStatusObj[user_id || uid] &&
              audioStatusObj[user_id || uid].level
              ? audioStatusObj[user_id || uid].level
              : 0
          "
          :mute="
            audioStatusObj[user_id || uid] &&
              audioStatusObj[user_id || uid].mute !== false
          "
          :camera-off="!playList.find(e => e.uid === user_id) || streamFallbackList.includes(user_id)"
        />
        <div class="central">
          <pin-button
            class="pin-button-local"
            :pined="
              pined && (user_id ? pinedUid === user_id : pinedUid === uid)
            "
            @click="handlePinUser(user_id || uid)"
          />
        </div>
      </div>
    </div>
    <div class="top-operate">
      <div class="top-operate-left" @click="toggleCamera">
        <!-- <van-icon name="exchange" /> -->
        <van-button v-for="(item,index) in dataList" :key="index" type="primary" @click="videoClick(item)">{{ item.count }}</van-button>
        <van-button icon="exchange" type="primary">切换</van-button>
      </div>
      <div class="top-operate-right" @click="handleCall">
        <van-button type="primary">加入</van-button>
      </div>
      <div class="top-operate-right" @click="handleLeave">
        <van-button type="primary">离开</van-button>
      </div>
    </div>
    <!-- <div class="notify">
      <div class="remote-user" @click="handleExpandUserList">
        用户: {{ users.length }}
      </div>
      <div class="local-user">
        <div class="local-camera-player">
          <voice-dot
            :mute="this.mute"
            :level="this.localVolumeLevel"
            class="voice-dot-local"
          />
          <video
            v-show="!cameraIsClosed"
            ref="localCameraPlayer"
            autoplay
            mute
          ></video>
          <img v-show="cameraIsClosed" src="../assets/yonghu.svg" alt="" />
        </div>
      </div>
    </div> -->
    <div v-show="showExpandUserList" class="user-list">
      <p @click="handleCustom">参加会议的所有用户 :</p>
      <ul>
        <li v-for="(item, index) in users" :key="index">
          <voice-dot
            class="audio-dot-local"
            :level="
              audioStatusObj[item.uid || uid] &&
                audioStatusObj[item.uid || uid].level
                ? audioStatusObj[item.uid || uid].level
                : 0
            "
            :mute="
              audioStatusObj[item.uid || uid] &&
                audioStatusObj[item.uid || uid].mute !== false
            "
          />
          <pin-button
            class="pin-button-local"
            :pined="
              pined && (item.uid ? pinedUid === item.uid : pinedUid === uid)
            "
            @click="handlePinUser(item.uid || uid)"
          />
          {{ item.uid || item }}
        </li>
      </ul>
    </div>
    <div class="tabbar">
      <div class="tabbar-item" @click="handleMute">
        <div class="tabbar-item-icon">
          <svg-icon :icon-class="mute ? 'microphone_mute' : 'microphone'" class-name="microphone" />
        </div>
        <div class="tabbar-item-text">
          <span>{{ userType ? '我要发言' : '语音' }}</span>
        </div>
      </div>
      <div class="tabbar-item" @click="handleCamera">
        <div class="tabbar-item-icon">
          <svg-icon :icon-class="cameraIsClosed ? 'video_mute' : 'video'" class-name="video" />
        </div>
        <div class="tabbar-item-text">
          <span>视频</span>
        </div>
      </div>
      <div class="tabbar-item" @click="handleExpandUserList">
        <div class="tabbar-item-icon">
          <van-icon name="friends-o" />
        </div>
        <div class="tabbar-item-text">
          <span>用户</span>
        </div>
      </div>
    </div>
    <!-- <div class="banner">
      <div class="test-button" @click="handleOpenNewPage">
        （测试）打开新页面
      </div>

      <mp-button :class="microphoneClass" @click="handleMute" />
      <on-call-button v-if="!inMeeting" @click="handleCall" />
      <close-button v-if="inMeeting" @click="handleLeave" />
      <video-button :class="cameraClass" @click="handleCamera" />

      <div class="share-screen-button" @click="handleShareScreen">
        {{
          youAreShareScreening
            ? "你在共享"
            : otherIsShareScreening
              ? "其它共享"
              : "共享屏幕"
        }}
      </div>
    </div> -->
  </div>
</template>

<script>
// import MpButton from './buttons/mp-button';
// import CloseButton from './buttons/close-button';
// import OnCallButton from './buttons/on-call-button';
// import VideoButton from './buttons/video-button';
import VoiceDot from './voice-dot/main';
import AvatarAudio from './avatar-audio/main';
import PinButton from './pin-button/main';
import { meetingTurn, exit, speechSeatAttend, speechSeatExit } from '@/api/url';
import { Tabbar, TabbarItem, Icon, Button, Dialog, } from 'vant';

export default {
  name: 'Meet',
  components: {
    // MpButton,
    // CloseButton,
    // OnCallButton,
    // VideoButton,
    VoiceDot,
    AvatarAudio,
    PinButton,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
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
    },
    preMute: {
      type: Boolean,
      default: false
    },
    preCameraOff: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mute: false, // 是否开启静音 (即本地音频收集和播放(如果开启了monitor),并停止向远端发送音频流)
      handleError: error => {
        this.$toast.fail(error.message || error);
      },
      uid: null,
      cameraIsClosed: false,
      inMeeting: false,
      remoteUsers: [],
      showExpandUserList: false,
      localDirective: null,
      localScreenDirective: null,
      localVolumeLevel: 0,
      remoteVolumeLevelList: [],
      remoteDirectiveList: [],
      remoteMuteStatus: [],
      pined: false,
      pinedUid: null,
      openScreenSharing: false,
      youAreShareScreening: false,
      shareScreenUID: 630796919,
      streamFallbackList: [],
      active: 'audio',
      icon: {
        active: 'https://img01.yzcdn.cn/vant/user-active.png',
        inactive: 'https://img01.yzcdn.cn/vant/user-inactive.png',
      },
      currentStream: undefined,
      dataList: [],
      toggle: true,
    };
  },
  computed: {
    userId() {
      return this.$store.state.user.userId;
    },
    userType() {
      return this.$store.state.user.userDetail.userType;
    },
    meetingPage() {
      // 会议信息
      return this.$store.state.user.meetingPage;
    },
    channelName() {
      return this.$store.state.user.channelName;
    },
    rtcToken() {
      return this.$store.state.user.rtcToken;
    },
    encryptSalt() {
      return this.$store.state.user.encryptSalt;
    },
    encryptSecretKey() {
      return this.$store.state.user.encryptSecretKey;
    },
    secretKey() {
      return this.$store.state.user.secretKey;
    },
    refuseList() {
      // 拒绝其音频媒体流的远端用户的UID列表
      return this.openScreenSharing ? [this.shareScreenUID] : [];
    },
    microphoneClass() {
      return this.mute ? 'mp-mute' : 'mp-normal';
    },
    cameraClass() {
      return this.cameraIsClosed ? 'video-mute' : 'video-normal';
    },
    users() {
      const result = [...this.remoteUsers];
      result.unshift(this.uid ? this.uid + '(你)' : '你');
      this.youAreShareScreening && result.unshift(this.shareScreenUID);
      return result;
    },
    userList() {
      const result = [...this.remoteUsers];
      this.uid && result.unshift(this.uid);
      this.youAreShareScreening && result.unshift(this.shareScreenUID);
      return result;
    },
    unpinedUserIdList() {
      const result = [...this.remoteUsers.map(user => user.uid)];
      this.uid && result.unshift(this.uid);
      this.youAreShareScreening && result.unshift(this.shareScreenUID);
      return result;
    },
    userIdList() {
      if (this.pined) {
        return [this.pinedUid];
      }
      return this.unpinedUserIdList;
    },
    playList() {
      const result = [...this.remoteDirectiveList];
      this.localDirective && result.unshift(this.localDirective);
      this.localScreenDirective && result.unshift(this.localScreenDirective);
      return result;
    },
    remoteAudioStatusObj() {
      const volumeLevel = Object.assign(
        {},
        ...this.remoteVolumeLevelList.map(e => ({ [e.uid]: e.result }))
      );
      const muteStatus = Object.assign(
        {},
        ...this.remoteMuteStatus.map(e => ({ [e.uid]: e.result }))
      );
      return Object.assign(
        {},
        ...this.remoteUsers
          .map(user => user.uid)
          .map(k => ({
            [k]: {
              level: volumeLevel[k] || 0,
              mute: muteStatus[k] !== false
            }
          }))
      );
    },
    audioStatusObj() {
      return this.localVolumeLevel || this.localVolumeLevel === 0
        ? {
          ...{
            [this.uid]: { level: this.localVolumeLevel, mute: this.mute }
          },
          ...this.remoteAudioStatusObj
        }
        : {
          ...this.remoteAudioStatusObj
        };
    },
    otherIsShareScreening() {
      return (
        !this.youAreShareScreening &&
        this.unpinedUserIdList.includes(this.shareScreenUID)
      );
    }
  },
  watch: {
    cameraIsClosed(newV) {
      if (!newV && this.$refs.videoSender && this.$refs.localCameraPlayer) {
        this.playLocalVideoOnTopBanner();
      }
    }
  },
  created() {
    this.mute = this.preMute;
    this.cameraIsClosed = this.preCameraOff;
  },
  methods: {
    handleOpenNewPage() {
      window.open(window.location.href);
    },
    handleCustom() {
      const tracks = this.$refs.ar.getLocalTracks();
      console.log(tracks);
    },
    handleJoinSuccess(uid) {
      console.log('成功加入会议');
      // 加入频道成功的事件
      this.inMeeting = true;
      this.uid = uid;
      this.$toast.success('成功加入会议');
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
    handleUserLoaded() {
      // SDK加载完成，此时可以读取 AgoraRTC 对象, 在此之前调用 getAgoraRTC 是拿不到 AgoraRTC 对象的。
      console.log('SDK加载完成:');
    },
    cryptError() {
      console.log('触发了crypt-error回调');
    },
    handleClientCreated() {
      // client创建完成的事件。此时已完成client的创建，client上事件的监听，以及直播状态下角色的设置。
      this.$refs.ar.getClient().setEncryptionConfig('aes-128-gcm2', this.secretKey, this.encryptSalt);
      window._agMeet = this;
      window._client = this.$refs.ar.getClient();
      window._AgoraRTC = this.$refs.ar.getAgoraRtc();
      window._sClient = this.$refs?.screenAr?.getClient();
      // client.setStreamFallbackOption()
    },
    handleMute() { // 开关麦克风
      if (this.userType) {
        if (this.mute) {
          Dialog.confirm({
            title: '温馨提醒',
            message: '您确定要发言吗？',
          })
            .then(() => {
            // on confirm
              speechSeatAttend({
                id: this.meetingPage.id,
              }).then(({ obj }) => {
                this.mute = !this.mute;
              });
            })
            .catch(() => {
            // on cancel
            });
        } else {
          speechSeatExit({
            id: this.meetingPage.id,
          }).then(({ obj }) => {
            this.mute = !this.mute;
          });
        }
      } else {
        this.audioSwitch();
      }
    },
    audioSwitch() {
      this.mute = !this.mute;
      this.$toast(`麦克风 ${this.mute ? '关' : '开'}`);
      meetingTurn({
        id: this.meetingPage.id,
        'agoraType': 'AUDIO', // 音频AUDIO，视频VIDEO
        'state': this.mute ? 1 : 0		// 0关闭，1开启
      }).then(({ obj }) => {
        console.log(obj);
      });
    },
    playLocalVideoOnTopBanner() {
      const videoTrack = this.$refs.videoSender
        .getTrack()
        .getMediaStreamTrack();
      this.$refs.localCameraPlayer.srcObject = new MediaStream([videoTrack]);
    },
    handleMeet() {
      if (this.inMeeting) {
        exit({
          id: this.meetingPage.id,
        }).then(({ obj }) => {
          if (obj) {
            this.$refs.ar.leave().then(() => {
              this.inMeeting = false;
              this.remoteUsers = [];
              this.uid = null;
              this.$toast.success('成功离开会议');
              this.$emit('leave-meeting');
            });
          }
        });
      } else {
        this.$refs.ar.start().then(({ result, message }) => {
          if (!result) {
            this.$toast.fail('加入频道错误', message);
          }
        });
      }
    },
    handleCall() {
      if (this.inMeeting) {
        this.$toast.fail('你已经在会议了');
        return;
      }
      this.$refs.ar.start().then(({ result, message }) => {
        if (!result) {
          this.$toast.fail('加入频道错误', message);
        }
      });
    },
    handleLeave() {
      if (!this.inMeeting) {
        this.$toast.fail('您没有参加任何会议');
        return;
      }
      exit({
        id: this.meetingPage.id,
      }).then(({ obj }) => {
        if (obj) {
          this.$refs.ar.leave().then(() => {
            this.inMeeting = false;
            this.remoteUsers = [];
            this.uid = null;
            this.$toast.success('成功离开会议');
            this.$emit('leave-meeting');
          });
        }
      });
    },
    handleCamera(val) { // 开关摄像头
      meetingTurn({
        id: this.meetingPage.id,
        agoraType: 'VIDEO', // 音频AUDIO，视频VIDEO
        state: this.cameraIsClosed ? 1 : 0		// 0关闭，1开启
      }).then(({ obj }) => {
        console.log(obj);
      });
      this.cameraIsClosed = !this.cameraIsClosed;
      this.$toast(`相机 ${this.cameraIsClosed ? '关' : '开'}`);
    },
    handleUserJoin(user) {
      // 远端用户或主播加入频道的事件
      this.$toast(`${user.uid} 加入会议`);

      // 弱网路回退
      this.$refs.ar.getClient().setStreamFallbackOption(user.uid, 2);

      // 如果要共享屏幕
      // 无需订阅自己的屏幕视频
      this.remoteUsers = this.$refs.ar
        .getRemoteUsers()
        .filter(
          user => !this.openScreenSharing || user.uid !== this.shareScreenUID
        );
      this.handleCheckRemoteUserAudioMuteStatus();
    },
    handleUserPublished(user, mediaType) {
      console.log('user published:远端用户发布了新的音频轨道或者视频轨道的事件 ', mediaType, user.uid);

      if (mediaType === 'audio') {
        this.handleGetRemoteVolumeLevelList();
      }
    },
    handleUserLeft(user, reason) {
      // 远端用户离线的事件
      this.$toast(`${user.uid} 离开了会议 ${reason}`);
      this.remoteUsers = this.$refs.ar
        .getRemoteUsers()
        .filter(
          user => !this.openScreenSharing || user.uid !== this.shareScreenUID
        );

      if (user.uid === this.pinedUid) {
        this.pined = false;
        this.pinedUid = null;
      }
    },
    handleExpandUserList() {
      this.showExpandUserList = !this.showExpandUserList;
    },
    handleVideoReady(localVideo, info) {
      // 本地用户视频ready事件，本地视频流创建成功，可以在本地播放时触发该事件。
      console.log('video-ready 触发:', info);
      this.localDirective = localVideo;
      this.playLocalVideoOnTopBanner();
    },
    handleScreenVideoReady(screenVideo) {
      this.youAreShareScreening = true;
      this.localScreenDirective = screenVideo;
    },
    handleVideoClose() {
      // 本地视频流close(指不再向远端发送视频流)时触发该事件
      this.localDirective = null;
    },
    handleScreenVideoClose() {
      this.youAreShareScreening = false;
      this.localScreenDirective = null;
    },
    handleScreenVideoFailed() {
      this.handleScreenVideoClose();
      this.openScreenSharing = false;
    },
    handleRemoteVideoReady(remoteUserList) {
      // 远端用户视频ready事件，每当有用户进入或退出频道导致有新视频加入，或视频退出时均触发该事件。
      this.remoteDirectiveList = remoteUserList;
    },
    handleAudioTrackCreated() {
      // 音频创建完成的事件。
      let id;
      const audioSender = this.$refs.audioSender;
      const callback = () => {
        try {
          const track = audioSender.getTrack();
          if (track && track.getVolumeLevel) {
            this.localVolumeLevel = track.getVolumeLevel();
          } else {
            this.localVolumeLevel = 0;
          }
          id = window.requestAnimationFrame(callback);
        } catch (e) {
          console.error(e);
        }
      };
      id = window.requestAnimationFrame(callback);
      this.$once('hook:beforeDestroy', () => {
        window.cancelAnimationFrame(id);
      });
    },
    handleGetRemoteVolumeLevelList() {
      let id;
      const audioReceiver = this?.$refs?.audioReceiver;
      const callback = () => {
        this.remoteVolumeLevelList = audioReceiver?.getVolumeLevel();
        id = window.requestAnimationFrame(callback);
      };
      id = window.requestAnimationFrame(callback);
      this.$once('hook:beforeDestroy', () => {
        window.cancelAnimationFrame(id);
      });
    },
    handleCheckRemoteUserAudioMuteStatus() {
      let id;
      const audioReceiver = this?.$refs?.audioReceiver;
      const callback = () => {
        this.remoteMuteStatus = audioReceiver?.getUserMuteStatus();
        id = window.requestAnimationFrame(callback);
      };
      id = window.requestAnimationFrame(callback);
      this.$once('hook:beforeDestroy', () => {
        window.cancelAnimationFrame(id);
      });
    },
    handlePinUser(uid) {
      if (this.pined && this.pinedUid === uid) {
        this.pined = false;
        this.pinedUid = null;
      } else {
        this.pinedUid = uid;
        this.pined = true;
      }
    },
    handleShareScreen() {
      if (!this.youAreShareScreening) {
        if (this.otherIsShareScreening) {
          this.$toast.warning(`other is sharing, and you will replace him.`);
        }
      } else {
        this.$toast(`您将要退出共享`);
      }
      this.openScreenSharing = !this.openScreenSharing;
    },
    handleStreamFallback(uid, type) {
      // 订阅的音视频流回退为音频流或恢复为音视频流回调
      const list = this.streamFallbackList;
      console.log(`流回退: uid ${uid}, type: ${type}`);
      if (type === 'recover') {
        this.streamFallbackList = list.filter(e => e !== uid);
      } else if (type === 'fallback') {
        this.streamFallbackList = [...new Set([...list, uid])];
      } else {
        this.$toast.fail('流回退类型错误');
      }
    },
    getdatalist() {
      const _this = this;
      console.log('调用成功');
      navigator.mediaDevices.enumerateDevices().then(res => {
        this.gotDevices(res);
        _this.dataList.forEach(res => {
          if (res.count == '1') {
            _this.videoClick(res);
          }
        });
      });
    },
    toggleCamera() {
      this.getdatalist();
      const _this = this;
      this.toggle = !this.toggle;
      if (this.dataList) {
        if (this.toggle) {
          console.log('前置');
          // 前置
          _this.dataList.forEach(res => {
            if (res.count == '1') {
              _this.videoClick(res);
            }
          });
        } else {
          console.log('后置');
          console.log(_this.dataList);
          _this.videoClick(_this.dataList[_this.dataList.length - 1]);
          // 后置
        }
      }
    },
    stopMediaTracks(stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    },
    videoClick(item) {
      const _this = this;

      if (item) {
        if (typeof _this.currentStream !== 'undefined') {
          _this.stopMediaTracks(_this.currentStream);
        }
        const videoConstraints = {};
        console.log('设备');
        console.log(JSON.stringify(item));
        console.log(item.deviceId);
        videoConstraints.deviceId = { exact: item.deviceId };
        const constraints = {
          video: videoConstraints,
          audio: false
        };
        console.log(constraints);
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(stream => {
            _this.currentStream = stream;
            window.src = stream;
            document.getElementsByTagName('video')[0].srcObject = window.src;
            return navigator.mediaDevices.enumerateDevices();
          })
          .then(res => {
            _this.gotDevices(res);
          })
          .catch(error => {
            console.log(error + '出错');
          });
      }
    },
    gotDevices(mediaDevices) {
      const _this = this;
      // const controls = document.getElementById('controls');
      // const video = document.getElementById('videoDom');
      this.dataList = [];
      let count = 1;
      mediaDevices.forEach(mediaDevice => {
        if (mediaDevice.kind === 'videoinput') {
          mediaDevice.count = `${count++}`;
          _this.dataList.push(mediaDevice);
        }
      });
    },
  }
};
</script>

<style lang="stylus">
video.agora_video_player
  object-fit: contain !important
</style>

<style scoped lang="stylus">
@import "../styles/meet/index.styl"

</style>
<style lang="scss" scoped>
@import "@/styles/meet/player.scss";
.microphone {
  font-size: 30px;
}
.top-operate {
  display: flex;
  justify-items: center;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 50px;
  top: 0;
  background-color: #fff;
}
.notify{
  display: flex;
  justify-items: center;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  background-color: #fff;
  border-radius:  0 0 0 10px;
  width: 100%;
  height: 50px;
  z-index: 100;
}

.tabbar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: flex;
    box-sizing: content-box;
    width: 100%;
    height: 100px;
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
    .tabbar-item {
      display: flex;
          flex: 1;
          justify-content: center;
    color: #646566;
    font-size: 3.2vw;
    line-height: 1;
    cursor: pointer;
        align-items: center;
        flex-direction: column;
        .tabbar-item-icon {
              position: relative;
    margin-bottom: 1.06667vw;
    font-size: 5.86667vw;
        }
    }
}
</style>
