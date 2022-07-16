<template>
  <div class="meet-wrap">
    <van-nav-bar
      safe-area-inset-top
      left-text="切换"
      right-text="离开"
      @click-left="toggleCamera"
      @click-right="handleLeave"
    >
      <template #left>
        <svg-icon icon-class="switch_camera" />{{ switchCameraText }}
      </template>
    </van-nav-bar>
    <!-- <div class="top-operate">
      <div class="top-operate-left" @click="toggleCamera">
        <van-button icon="exchange" type="info">切换</van-button>
      </div>
      <div class="top-operate-right" @click="handleLeave">
        <van-button type="info">离开</van-button>
      </div>
    </div> -->
    <div class="meet">
      <div class="local_player">
        <agora
          ref="ar"
          :log-level="2"
          :channel="channelName"
          :appid="appid"
          :token="token"
          :uid="userId"
          :client-config="{ mode: 'live', role: 'host' }"
          :auto-start="true"
          :error-handler="handleError"
          @rtc-loaded="handleUserLoaded"
          @crypt-error="cryptError"
          @user-joined="handleUserJoin"
          @user-published="handleUserPublished"
          @user-left="handleUserLeft"
          @join-success="handleJoinSuccess"
          @join-failed="handleJoinFailed"
          @client-created="handleClientCreated"
          @stream-fallback="handleStreamFallback"
          @camera-changed="
            (info) => {
              console.log(`camera changed!`, info.state, info.device);
            }
          "
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
            :player-config="{ fit: 'fill' }"
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
      <div class="player player-host">
        <!-- 主持人 -->
        <div
          v-for="onlineHost in meetingUsers.filter(
            (f) => f.isOnline === 1 && f.specialFlag === 1
          )"
          :key="onlineHost.agoraId"
          class="user-vision"
        >
          <div
            v-if="
              playList.find((e) => e.uid === onlineHost.agoraId) &&
                onlineHost.videoState
            "
            v-show="!streamFallbackList.includes(onlineHost.agoraId)"
            v-player="playList.find((e) => e.uid === onlineHost.agoraId)"
            class="player-vision"
          ></div>
          <div class="">
            <div class="video-bottom">
              <div class="video-bottom-left">
                <svg-icon icon-class="host" />
                <p>
                  {{ renderUser(onlineHost.agoraId) || "you"
                  }}<span v-if="onlineHost.agoraId === uid && inMeeting">
                    (你)
                  </span>
                </p>
              </div>
              <div class="video-bottom-right">
                <svg-icon
                  :icon-class="onlineHost.videoState ? 'shipin' : 'shipin_off'"
                  class-name="microphone"
                />
                <svg-icon
                  :icon-class="onlineHost.audioState ? 'audio' : 'audio_off'"
                  class-name="microphone"
                />
              </div>
            </div>
          </div>
          <avatar-audio v-if="!onlineHost.videoState" />
        </div>
        <!-- 在线普通用户 -->
      </div>
      <div class="online-wrap">
        <!-- 发言席 -->
        <div
          v-for="online in speechList"
          :key="online.agoraId"
          class="user-vision is-speech"
          :class="{
            isSpeech: !!meetingUsers.find((e) => {
              return e.agoraId === online.agoraId;
            }).isSpeech,
            isHost: meetingUsers.find((e) => {
              return e.agoraId === online.agoraId;
            }).specialFlag,
          }"
        >
          <div class="video-bottom">
            <div class="video-bottom-left">
              <p>
                {{ renderUser(online.agoraId) || "you"
                }}<span v-if="online.agoraId === uid && inMeeting"> (你) </span>
              </p>
            </div>
            <div class="video-bottom-right">
              <svg-icon
                :icon-class="online.videoState ? 'shipin' : 'shipin_off'"
                class-name="microphone"
              />
              <svg-icon
                :icon-class="online.audioState ? 'audio' : 'audio_off'"
                class-name="microphone"
              />
            </div>
          </div>
          <div
            v-if="
              playList.find((e) => e.uid === online.agoraId) &&
                online.videoState === 1
            "
            v-show="!streamFallbackList.includes(online.agoraId)"
            v-player="playList.find((e) => e.uid === online.agoraId)"
            class="player-vision"
          ></div>
          <avatar-audio v-if="!online.videoState" />
        </div>
        <!-- 轮播用户 -->
        <swiper
          v-if="rotateList.length"
          :key="swiperKey"
          :options="swiperOption"
          :class="{ onlyOneRoate: speechList.length === 1 }"
          class="mySwiper swiper"
        >
          <swiper-slide v-for="online in rotateList" :key="online.id">
            <div
              ref="cur"
              class="user-vision"
              :class="{
                isSpeech: !!meetingUsers.find((e) => {
                  return e.agoraId === online.agoraId;
                }).isSpeech,
                isHost: meetingUsers.find((e) => {
                  return e.agoraId === online.agoraId;
                }).specialFlag,
              }"
            >
              <div
                v-if="
                  playList.find((e) => e.uid === online.agoraId) &&
                    online.videoState
                "
                v-show="!streamFallbackList.includes(online.agoraId)"
                v-player="playList.find((e) => e.uid === online.agoraId)"
                class="player-vision"
              ></div>
              <div class="video-bottom">
                <div class="video-bottom-left">
                  <p>
                    {{ renderUser(online.agoraId) || "you"
                    }}<span v-if="online.agoraId === uid && inMeeting">
                      (你)
                    </span>
                  </p>
                </div>
                <div class="video-bottom-right">
                  <svg-icon
                    :icon-class="online.videoState ? 'shipin' : 'shipin_off'"
                    class-name="microphone"
                  />
                  <svg-icon
                    :icon-class="online.audioState ? 'audio' : 'audio_off'"
                    class-name="microphone"
                  />
                </div>
              </div>
              <avatar-audio v-if="!online.videoState" />
            </div>
          </swiper-slide>
        </swiper>
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
              <!-- <pin-button
            class="pin-button-local"
            :pined="
              pined && (item.uid ? pinedUid === item.uid : pinedUid === uid)
            "
            @click="handlePinUser(item.uid || uid)"
          /> -->
              {{
                (item.uid &&
                  meetingUsers.find((f) => f.agoraId === item.uid)
                    .userRealName) ||
                  userSelfDetail.userRealName
              }}
            </li>
          </ul>
        </div>
        <van-popup
          v-model="popupShow"
          :style="{ width: '60%', height: '100%' }"
          position="left"
        >
          <div class="user-title">
            参会人员(
            {{ meetingUsers.filter((z) => z.isOnline === 1).length }} /
            {{ meetingUsers.length }} )
          </div>
          <van-search
            v-model="searchValue"
            show-action
            placeholder="请输入参会人员名称"
            @search="onSearch"
            @cancel="onCancel"
          />
          <div class="search-list">
            <div
              v-for="item in meetingUsers.filter((s) =>
                s.userRealName.includes(searchValue)
              )"
              :key="item.userId"
              class="search-item"
              :class="{ searchOnLine: item.isOnline }"
            >
              <div class="item-left">
                <svg-icon icon-class="yonghu" />
                {{ item.userRealName }}
              </div>
              <div class="item-right">
                <svg-icon
                  :icon-class="
                    item.videoState || !item.isOnline ? 'shipin' : 'shipin_off'
                  "
                />
                <svg-icon
                  :icon-class="
                    item.audioState || !item.isOnline ? 'audio' : 'audio_off'
                  "
                />
              </div>
            </div>
          </div>
        </van-popup>
        <div class="tabbar">
          <div
            v-if="!userSelfDetail.specialFlag"
            class="tabbar-item"
            @click="handleSpeech"
          >
            <div class="tabbar-item-icon">
              <svg-icon icon-class="pin_img" class-name="microphone" />
            </div>
            <div class="tabbar-item-text">
              <span>{{
                userSelfDetail.isSpeech ? "结束发言" : "我要发言"
              }}</span>
            </div>
          </div>
          <div
            v-if="userSelfDetail.specialFlag === 1 || userSelfDetail.isSpeech"
            class="tabbar-item"
            @click="handleAudio"
          >
            <div class="tabbar-item-icon">
              <svg-icon
                :icon-class="userSelfDetail.audioState ? 'audio' : 'audio_off'"
                class-name="microphone"
              />
            </div>
            <div class="tabbar-item-text">
              <span>语音</span>
            </div>
          </div>
          <div class="tabbar-item" @click="handleCamera">
            <div class="tabbar-item-icon">
              <svg-icon
                :icon-class="
                  userSelfDetail.videoState ? 'shipin' : 'shipin_off'
                "
                class-name="video"
              />
            </div>
            <div class="tabbar-item-text">
              <span>视频</span>
            </div>
          </div>
          <!-- <div class="tabbar-item" @click="audioTest">
        <div class="tabbar-item-icon">
          <svg-icon :icon-class="userSelfDetail.audioState ? 'microphone' : 'audio_off'" class-name="microphone" />
        </div>
        <div class="tabbar-item-text">
          <span>测试</span>
        </div>
      </div> -->
          <div class="tabbar-item" @click="handleExpandUserList">
            <div class="tabbar-item-icon">
              <svg-icon icon-class="user" />
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

    </div> -->
      </div>
    </div>
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
import {
  Tabbar,
  TabbarItem,
  Icon,
  Button,
  Dialog,
  Swipe,
  SwipeItem,
  Popup,
  Search,
  NavBar,
} from 'vant';
import RtmClient from '@/utils/rtm-client.js';
// import { swiper, swiperSlide } from 'vue-awesome-swiper';
// import 'swiper/dist/css/swiper.css';
// import { Swiper, SwiperSlide } from 'swiper/vue/swiper-vue';
// import Swiper from 'swiper';
// import 'swiper/css/swiper.min.css';
// import 'swiper/swiper.min.css';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

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
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Popup.name]: Popup,
    [Search.name]: Search,
    [NavBar.name]: NavBar,
    Swiper,
    SwiperSlide,
  },
  props: {
    // channel: {
    //   type: String,
    //   default: null,
    // },
    token: {
      type: String,
      default: null,
    },
    preMute: {
      type: Boolean,
      default: false,
    },
    preCameraOff: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      appid: '743decdce87c47be9758498fb9829774',
      mute: false, // 是否开启静音 (即本地音频收集和播放(如果开启了monitor),并停止向远端发送音频流)
      handleError: (error) => {
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
      toggle: 0,
      swiperOption: {
        // width: 334,
        watchOverflow: true,
        slidesPerView: 1,
        slidesPerGroup: 2,
        loop: false,
        allowTouchMove: true, // 鼠标无法拖动，手机也无法滑动。
        autoplay: {
          delay: 10000,
          stopOnLastSlide: false,
          disableOnInteraction: false,
        },
      },
      popupShow: false,
      searchValue: '',
      swiperKey: Math.random().toString(36).substr(2),
      switchCameraText: '前置',
    };
  },
  computed: {
    speechList() {
      return this.$store.state.user.meetingUsers.filter(
        (f) => f.isOnline === 1 && f.specialFlag === 0 && f.isSpeech === 1
      );
    },
    rotateList() {
      return this.$store.state.user.meetingUsers.filter(
        (f) => f.isOnline === 1 && f.specialFlag === 0 && f.isSpeech === 0
      );
    },
    userId() {
      return this.$store.state.user.userId;
    },
    userSelfDetail() {
      return this.$store.state.user.meetingUsers.find(
        (item) => item.agoraId === this.$store.state.user.agoraId
      );
    },
    isOff: {
      get() {
        return !this.$store.state.user.meetingUsers.find(
          (item) => item.agoraId === this.$store.state.user.agoraId
        ).audioState;
      },
      set(value) {
        this.$store.commit('user/setState', {
          audioState: value ? 0 : 1,
        });
      },
    },
    specialFlag() {
      return this.$store.state.user.userDetail.specialFlag;
    },
    meetingUsers() {
      // 会议人员
      return this.$store.state.user.meetingUsers;
    },
    rtmToken() {
      return this.$store.state.user.rtmToken;
    },
    meetingPage() {
      // 会议信息
      return this.$store.state.user.meetingPage;
    },
    channelName() {
      return this.$store.state.user.channelName;
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
      const result = [...this.remoteUsers.map((user) => user.uid)];
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
        ...this.remoteVolumeLevelList.map((e) => ({ [e.uid]: e.result }))
      );
      const muteStatus = Object.assign(
        {},
        ...this.remoteMuteStatus.map((e) => ({ [e.uid]: e.result }))
      );
      return Object.assign(
        {},
        ...this.remoteUsers
          .map((user) => user.uid)
          .map((k) => ({
            [k]: {
              level: volumeLevel[k] || 0,
              mute: muteStatus[k] !== false,
            },
          }))
      );
    },
    audioStatusObj() {
      return this.localVolumeLevel || this.localVolumeLevel === 0
        ? {
          ...{
            [this.uid]: { level: this.localVolumeLevel, mute: this.mute },
          },
          ...this.remoteAudioStatusObj,
        }
        : {
          ...this.remoteAudioStatusObj,
        };
    },
    otherIsShareScreening() {
      return (
        !this.youAreShareScreening &&
        this.unpinedUserIdList.includes(this.shareScreenUID)
      );
    },
  },
  watch: {
    cameraIsClosed(newV) {
      if (!newV && this.$refs.videoSender && this.$refs.localCameraPlayer) {
        this.playLocalVideoOnTopBanner();
      }
    },
    // speechList(newV) {
    //   console.log(newV, newV.length);
    //   if (newV.length === 0) {
    //     console.log(222222222);
    //     this.$set(this.swiperOption, 'slidesPerView', 2);
    //     // this.swiperOption.slidesPerView = 2;
    //   } else {
    //     console.log(11111111);
    //     this.$set(this.swiperOption, 'slidesPerView', 1);
    //     console.log(this.swiperOption);
    //     // this.swiperOption.slidesPerView = 1;
    //   }
    //   this.$nextTick(() => {
    //     this.swiperKey = Math.random().toString(36).substr(2); // 修改key，swiper重新渲染。
    //   });
    // },
    rotateList: {
      immediate: true,
      handler(newV) {
        console.log(newV);
        if (newV.length < 2) {
          this.swiperOption.slidesPerView = 1;
          this.swiperOption.loop = false;
          this.swiperOption.autoplay = false;
        } else {
          console.log('speechList:', this.speechList, this.speechList.length);
          if (this.speechList.length === 0) {
            // this.swiperOption.slidesPerView = 2;
          } else {
            this.swiperOption.slidesPerView = 1;
          }
          this.swiperOption.autoplay = {
            delay: 10000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          };
          // this.swiperOption.loop = true;
        }
        this.$nextTick(() => {
          this.swiperKey = Math.random().toString(36).substr(2); // 修改key，swiper重新渲染。
        });
      },
    },
  },
  created() {
    this.mute = this.preMute;
    this.cameraIsClosed = this.preCameraOff;
  },
  mounted() {},
  methods: {
    onClickLeft() {},
    onClickRight() {},
    onSearch(val) {},
    onCancel() {},
    renderUser(userId) {
      const { userRealName } = this.meetingUsers.filter(
        (item) => item.agoraId === userId
      )[0];
      return userRealName;
    },
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
    handleJoinFailed(reason) {
      console.log('加入会议失败：', reason, reason.message);
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
      const hex = hexx.toString(); // force conversion
      let str = '';
      for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }
      return str;
    },
    handleUserLoaded() {
      // 隐藏消息
      // this.$refs.ar.getAgoraRtc().setLogLevel(2);
      // SDK加载完成，此时可以读取 AgoraRTC 对象, 在此之前调用 getAgoraRTC 是拿不到 AgoraRTC 对象的。
      console.log('SDK加载完成:');
    },
    cryptError() {
      console.log('触发了crypt-error回调');
    },
    handleClientCreated() {
      // client创建完成的事件。此时已完成client的创建，client上事件的监听，以及直播状态下角色的设置。
      this.$refs.ar
        .getClient()
        .setEncryptionConfig('aes-128-gcm2', this.secretKey, this.encryptSalt);
      window._agMeet = this;
      window._client = this.$refs.ar.getClient();
      window._AgoraRTC = this.$refs.ar.getAgoraRtc();
      window._sClient = this.$refs?.screenAr?.getClient();
      // client.setStreamFallbackOption()
    },
    handleSpeech() {
      // 上/下 发言席发
      if (this.userSelfDetail.isSpeech) {
        speechSeatExit({
          id: this.meetingPage.id,
        }).then(({ obj }) => {
          // this.mute = true;
          // this.mute = !this.mute;
        });
      } else {
        Dialog.confirm({
          title: '温馨提醒',
          message: '您确定要发言吗？',
        })
          .then(() => {
            // on confirm
            speechSeatAttend({
              id: this.meetingPage.id,
            }).then(({ obj }) => {
              // this.mute = false;
              // const audioSender = this.$refs.audioSender;
              // const track = audioSender.getTrack();
              // this.$refs.audioSender.start(true);
              // this.mute = !this.mute;
            });
          })
          .catch(() => {
            // on cancel
          });
      }
    },
    handleAudio() {
      this.$toast(`麦克风 ${this.userSelfDetail.audioState ? '关' : '开'}`);
      meetingTurn({
        id: this.meetingPage.id,
        agoraType: 'AUDIO', // 音频AUDIO，视频VIDEO
        // state: this.mute ? 1 : 0		// 0关闭，1开启
        state: this.userSelfDetail.audioState ? 0 : 1, // 0关闭，1开启
      }).then(({ obj }) => {
        // this.$refs.audioSender.start(true);
        // console.log(obj);
        // this.mute = !obj;
        // console.log(track.isPlaying);
        // this.mute = this.userSelfDetail.audioState;
      });
      // this.mute = !this.mute;
      // this.isOff = !this.isOff;
    },
    audioTest() {
      // const audioSender = this.$refs.audioSender;
      // const track = audioSender.getTrack();
      // audioSender.start(true);
      // audioSender.setEnable(true);
    },
    playLocalVideoOnTopBanner() {
      const videoTrack = this.$refs.videoSender
        .getTrack()
        .getMediaStreamTrack();
      // this.$refs.localCameraPlayer.srcObject = new MediaStream([videoTrack]);
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
      // 加入会议
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
      const rtm = window.rtm;
      rtm
        .logout()
        .then(() => {
          console.log(rtm);
          rtm._logined = false;
          this.$toast('退出: ' + rtm.accountName);
        })
        .catch((err) => {
          this.$toast('退出失败, 请在控制台查看消息');
          console.log(err);
        });
      exit({
        id: this.meetingPage.id,
      }).then(({ obj }) => {
        if (obj) {
          this.$refs.ar.leave().then(() => {
            this.inMeeting = false;
            this.remoteUsers = [];
            this.uid = null;
            this.$toast.success('成功退出会议');
            this.$emit('leave-meeting');
          });
        }
      });
    },
    handleCamera(val) {
      // 开关摄像头
      this.$toast(`相机 ${this.userSelfDetail.videoState ? '关' : '开'}`);
      meetingTurn({
        id: this.meetingPage.id,
        agoraType: 'VIDEO', // 音频AUDIO，视频VIDEO
        state: this.userSelfDetail.videoState ? 0 : 1, // 0关闭，1开启
      }).then(({ obj }) => {
        // console.log(obj);
      });
      // this.cameraIsClosed = !this.cameraIsClosed;
    },
    handleUserJoin(user) {
      console.log(user);
      // const userName = this.meetingUsers.find(u => u.agoraId === user.uid).userRealName;
      // 远端用户或主播加入频道的事件
      // this.$toast(`${userName} 加入会议`);

      // 弱网路回退
      this.$refs.ar.getClient().setStreamFallbackOption(user.uid, 2);

      // 如果要共享屏幕
      // 无需订阅自己的屏幕视频
      this.remoteUsers = this.$refs.ar
        .getRemoteUsers()
        .filter(
          (user) => !this.openScreenSharing || user.uid !== this.shareScreenUID
        );
      this.handleCheckRemoteUserAudioMuteStatus();
    },
    handleUserPublished(user, mediaType) {
      console.log(
        'user published:远端用户发布了新的音频轨道或者视频轨道的事件 ',
        mediaType,
        user.uid
      );

      if (mediaType === 'audio') {
        this.handleGetRemoteVolumeLevelList();
      }
    },
    handleUserLeft(user, reason) {
      // 远端用户离线的事件
      // this.$toast(`${user.uid} 离开了会议 ${reason}`);
      this.remoteUsers = this.$refs.ar
        .getRemoteUsers()
        .filter(
          (user) => !this.openScreenSharing || user.uid !== this.shareScreenUID
        );

      // if (user.uid === this.pinedUid) {
      //   this.pined = false;
      //   this.pinedUid = null;
      // }
    },
    handleExpandUserList() {
      this.popupShow = true;
      // this.showExpandUserList = !this.showExpandUserList;
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
      console.log('音频创建完成的事件。');
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
    handleStreamFallback(uid, type) {
      // 订阅的音视频流回退为音频流或恢复为音视频流回调
      const list = this.streamFallbackList;
      console.log(`流回退: uid ${uid}, type: ${type}`);
      if (type === 'recover') {
        this.streamFallbackList = list.filter((e) => e !== uid);
      } else if (type === 'fallback') {
        this.streamFallbackList = [...new Set([...list, uid])];
      } else {
        this.$toast.fail('流回退类型错误');
      }
    },
    handleUnsubscribe(uid, type) {
      // this.$refs.ar.unsubscribe('673991659', 'video');
    },
    async toggleCamera() {
      const cameraList = await this.$refs.ar.getAgoraRtc().getCameras(true);
      const track = this.$refs.videoSender.getTrack();
      console.log(cameraList, track);
      if (this.toggle < cameraList.length) {
        track.setDevice(cameraList[this.toggle].deviceId);
        this.switchCameraText = '前置';
        this.toggle += 1;
      } else {
        this.toggle = 0;
        this.switchCameraText = '后置';
        track.setDevice(cameraList[this.toggle].deviceId);
      }
      // this.toggle = !this.toggle;
      // if (this.toggle) {
      //   this.$refs.ar.getAgoraRtc().createCameraVideoTrack({
      //     facingMode: 'environment'
      //   });
      // } else {
      //   this.$refs.ar.getAgoraRtc().createCameraVideoTrack({
      //     facingMode: 'user'
      //   });
      // }
    },
    stopMediaTracks(stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    },
    gotDevices(mediaDevices) {
      const _this = this;
      // const controls = document.getElementById('controls');
      // const video = document.getElementById('videoDom');
      this.dataList = [];
      let count = 1;
      mediaDevices.forEach((mediaDevice) => {
        if (mediaDevice.kind === 'videoinput') {
          mediaDevice.count = `${count++}`;
          _this.dataList.push(mediaDevice);
        }
      });
    },
    async joinRtm() {
      const rtm = new RtmClient();
      rtm.init('743decdce87c47be9758498fb9829774');
      window.rtm = rtm;
      await rtm
        .login(String(this.userId), this.rtmToken)
        .then(() => {
          console.log('RTM登陆成功');
          rtm._logined = true;
          // this.$toast('Login: ' + this.userId, ' token: ', this.rtmToken);
        })
        .catch((err) => {
          console.log(err);
        });
      rtm
        .joinChannel(this.channelName)
        .then(() => {
          console.log(rtm.accountName, ' 加入成功');
          rtm.channels[this.channelName].joined = true;
        })
        .catch((err) => {
          this.$toast.fail('加入失败');
          console.error(err);
        });
      rtm.on('MessageFromPeer', async (message, peerId) => {
        // 显示对端发送的消息
        console.log(
          '显示对端发送的消息message ' + message.text + ' peerId' + peerId
        );
      });
      rtm.on('MemberJoined', ({ channelName, args }) => {
        // 显示频道
        const memberId = args[0];
        console.log(
          '显示频道channel ',
          channelName,
          ' member: ',
          memberId,
          ' joined'
        );
      });
      rtm.on('MemberLeft', ({ channelName, args }) => {
        // 频道成员
        const memberId = args[0];
        console.log(
          '频道成员channel ',
          channelName,
          ' member: ',
          memberId,
          ' joined'
        );
      });
      rtm.on('ChannelMessage', async ({ channelName, args }) => {
        const [message, memberId] = args;
        console.log('sssss:', JSON.parse(message.text));
        const { action, userId, reason, rotate, audioState, videoState } =
          JSON.parse(message.text);
        if (rotate) {
          switch (reason.action) {
            case 'EXIT_MEETING':
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId: reason.userId, isOnline: 0 },
              ]);
              break;
            case 'ATTEND_MEETING':
              this.$store.commit('user/UPDATE_USER_LIST', [
                {
                  userId: reason.userId,
                  isOnline: 1,
                  audioState: reason.audioState,
                  videoState: reason.videoState,
                },
              ]);
              break;
            case 'TURN_OFF_VIDEO':
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId: reason.userId, videoState: 0 },
              ]);
              break;
            case 'TURN_ON_VIDEO':
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId: reason.userId, videoState: 1 },
              ]);
              break;
            case 'TURN_OFF_AUDIO':
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId: reason.userId, audioState: 0 },
              ]);
              break;
            case 'TURN_ON_AUDIO':
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId: reason.userId, audioState: 1 },
              ]);
              break;
            case 'ATTEND_SPEECHSEAT':
              this.$store.commit('user/UPDATE_USER_LIST', [
                ...rotate.map((item, index) => {
                  return { ...item, isSpeech: 0 };
                }),
                {
                  isSpeech: 1,
                  audioState: reason.audioState,
                  userId: reason.userId,
                  videoState: reason.videoState,
                },
              ]);
              if (String(reason.userId) === String(this.userId)) {
                // 开启音频
                this.mute = false;
                this.$refs.audioSender.start(true);
              }
              break;
            case 'EXIT_SPEECHSEAT':
              this.$store.commit('user/UPDATE_USER_LIST', [
                ...rotate,
                {
                  isSpeech: 0,
                  audioState: reason.audioState,
                  userId: reason.userId,
                  videoState: reason.videoState,
                },
              ]);
              if (String(reason.userId) === String(this.userId)) {
                // 开启音频
                this.mute = true;
              }
              break;
            default:
              break;
          }
        } else {
          switch (action) {
            case 'EXIT_MEETING':
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId, isOnline: 0 },
              ]);
              break;
            case 'ATTEND_MEETING':
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId, isOnline: 1, audioState, videoState },
              ]);
              break;
            case 'TURN_OFF_VIDEO':
              if (
                String(userId) === String(this.userId) &&
                !this.localDirective
              ) {
                // 关闭本地视频
                this.cameraIsClosed = true;
              }
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId, videoState: 0 },
              ]);
              break;
            case 'TURN_ON_VIDEO':
              if (
                String(userId) === String(this.userId) &&
                !this.localDirective
              ) {
                // 打开本地视频
                this.cameraIsClosed = false;
                this.$refs.videoSender.start(true);
              }
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId, videoState: 1 },
              ]);
              break;
            case 'TURN_OFF_AUDIO':
              if (String(userId) === String(this.userId)) {
                // 关闭音频
                this.mute = true;
              }
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId, audioState: 0 },
              ]);
              break;
            case 'TURN_ON_AUDIO':
              if (String(userId) === String(this.userId)) {
                // 打开本地音频
                this.mute = false;
                this.$refs.audioSender.start(true);
              }
              this.$store.commit('user/UPDATE_USER_LIST', [
                { userId, audioState: 1 },
              ]);
              break;
            case 'ATTEND_SPEECHSEAT':
              this.$store.commit('user/UPDATE_USER_LIST', [
                {
                  isSpeech: 1,
                  audioState: action.audioState,
                  userId: action.userId,
                  videoState: action.videoState,
                },
              ]);
              if (String(action.userId) === String(this.userId)) {
                // 开启音频
                this.mute = false;
                this.$refs.audioSender.start(true);
              }
              break;
            case 'EXIT_SPEECHSEAT':
              this.$store.commit('user/UPDATE_USER_LIST', [
                {
                  isSpeech: 0,
                  audioState: action.audioState,
                  userId: action.userId,
                  videoState: action.videoState,
                },
              ]);
              if (String(action.userId) === String(this.userId)) {
                // 开启音频
                this.mute = true;
              }
              break;
            case 'TURN_OFF_ALL_VIDEO':
              this.$store.commit('user/TURN_OFF_ALL_VIDEO');
              break;
            default:
              break;
          }
        }
        console.log(
          '频道消息channel ',
          channelName,
          ', messsage: ',
          message.text,
          ', memberId: ',
          memberId
        );
      });
    },
  },
};
</script>

<style lang="stylus">
video.agora_video_player {
  object-fit: contain !important;
}
</style>
<style lang="scss" scoped>
$main_color: #099dfd;
.meet-wrap {
  .meet {
    padding-top: 32px;
    padding-bottom: 35px;
    background-color: #f7f7f9;
  }

  // @import "@/styles/meet/player.scss";
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
  .notify {
    display: flex;
    justify-items: center;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    background-color: #fff;
    border-radius: 0 0 0 10px;
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
    height: 146px;
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
    .tabbar-item {
      display: flex;
      flex: 1;
      justify-content: center;
      color: #646566;
      // font-size: 3.2vw;
      line-height: 1;
      cursor: pointer;
      align-items: center;
      flex-direction: column;
      .tabbar-item-icon {
        position: relative;
        font-size: 5.86667vw;
        margin-bottom: 10px;
        .svg-icon {
          font-size: 65px;
        }
        .video,
        .audio {
          color: #039ce2;
        }
        .audio_off,
        .shipin_off {
          color: #333;
        }
        .user {
          color: #606266;
        }
      }
      .tabbar-item-text {
        font-size: 38px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #4d4d4d;
      }
    }
  }
  .player-host {
    height: 488px;
    justify-content: center;
  }
  .user-vision {
    width: 334px;
    height: 488px;
    position: relative;
    margin-bottom: 10px;
    margin: 0 10px;
    background: #dae2e6;
    // box-sizing: border-box;
    .player-vision {
      width: 100%;
      height: 100%;
    }
  }
  .player {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100vw;
    .user-vision {
      width: 334px;
    }
    .isSpeech {
      order: -1;
    }
  }
  .player-host {
    height: 488px;
    justify-content: center;
  }
  .online-wrap {
    width: 100vw;
    animation: text 30s infinite linear;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .is-speech {
      flex-shrink: 0;
    }
    .van-swipe {
      flex-grow: 1;
    }
    .user-vision {
      // margin: 0;
    }
    .swiper-wrapper {
      width: 334px;
    }
  }
  .video-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 2;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 84px;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 26px;
    flex-direction: row;
    cursor: pointer;
    color: #fff;
    box-sizing: border-box;
    background: linear-gradient(0deg, #3a3a3a 0%, rgba(77, 77, 77, 0) 100%);
    border-radius: 0px 0px 10px 10px;
    .video-bottom-left,
    .video-bottom-right {
      display: flex;
      align-items: center;
    }
    .host {
      font-size: 38px;
      color: #faab0c;
      margin-right: 5px;
    }
    .shipin,
    .audio {
      color: #099dfd;
    }
    .shipin_off,
    .audio_off {
      color: #fff;
    }
    .shipin,
    .shipin_off {
      margin-right: 10px;
    }
    p {
      font-size: 24px;
    }
  }
  .onlyOneRoate {
    width: 334px;
    height: 488px;
    margin: 0 10px;
    .swiper-wrapper {
      // width: 100vw;
    }

    // margin-left: inherit;
    // margin-right: inherit;
  }
  .swiper-container {
    // width: 100vw;
    // animation:text 30s infinite  linear;
    // margin-top: 20px;
    // display: flex;
    // flex-wrap: nowrap;
  }
  .user-list {
    z-index: 10;
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    padding: 10px 14px;
    border-radius: 10px 0 0 10px;

    p {
      text-indent: 10px;
      color: #999;
    }

    ul {
      margin: 0;
      padding: 0;

      li {
        position: relative;
        margin: 4px;
        padding: 4px 80px 4px 28px;
        list-style: none;
        cursor: pointer;
        border-radius: 8px;
        color: $main_color;

        &:hover {
          background-color: #eee;
        }

        &:before {
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translateY(-50%);
          display: block;
          content: "";
          width: 16px;
          height: 16px;
          background: center / contain no-repeat url("~@/assets/yonghu.svg");
        }

        .audio-dot-local {
          position: absolute;
          right: 45px;
          top: 50%;
          transform: translateY(-50%);
        }

        .pin-button-local {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .user-title {
    text-align: center;
    // font-weight: bold;
    line-height: 32px;
    font-size: 32px;
    padding: 10px 20px;
  }
  .search-list {
    .search-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      padding: 10px 16px;
      &:after {
        position: absolute;
        box-sizing: border-box;
        content: " ";
        pointer-events: none;
        right: 16px;
        bottom: 0;
        left: 16px;
        border-bottom: 1px solid #ebedf0;
        transform: scaleY(0.5);
      }
      .item-right {
        .svg-icon {
          font-size: 32px;
          color: #d9d9d9;
        }
        .audio,
        .audio_off {
          margin-left: 20px;
        }
      }
      .yonghu {
        color: #d9d9d9;
      }
    }
    .searchOnLine {
      .item-right {
        .shipin,
        .audio {
          color: #099dfd;
        }
        .shipin_off,
        .audio_off {
          color: #000000;
        }
      }
      .yonghu {
        color: #faab0c;
      }
    }
  }
  ::v-deep {
    .van-nav-bar__right {
      .van-nav-bar__text {
        color: #ff0000;
      }
    }
    .van-nav-bar__left {
      color: #039ce2;
      .switch_camera {
        margin-right: 5px;
      }
    }
    .onlyOneRoate {
      .swiper-slide {
        // width: 100% !important;
         .user-vision {
          margin: 0;
          // width: 100%;
    }
      }
    }
  }
}
</style>
