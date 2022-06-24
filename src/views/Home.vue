<template>
  <div class="home">
    <meet
      v-if="isJoinMeeting"
      ref="meetRefParent"
      :channel="channelName"
      :appid="appid"
      :token="rtcToken"
      :pre-mute="config.mute"
      :pre-camera-off="config.cameraOff"
      @leave-meeting="handleLeaveMeeting"
    />
    <main-page
      v-else
      :channel="channel"
      :appid="appid"
      :token="rtcToken"
      @join-meeting="handleJoinMeeting"
    />
  </div>
</template>

<script>
import Meet from '@/components/Meet.vue';
import MainPage from '@/components/Main.vue';

export default {
  name: 'Home',
  components: {
    Meet,
    MainPage
  },
  data() {
    return {
      isJoinMeeting: false,
      config: null,
      appid: '743decdce87c47be9758498fb9829774',
      channel: '',
      token: '',
    };
  },
  computed: {
    rtcToken() {
      return this.$store.state.user.rtcToken;
    },
    rtmToken() {
      return this.$store.state.user.rtmToken;
    },
    channelName() {
      return this.$store.state.user.channelName;
    },
  },
  watch: {
    // appid: {
    //   immediate: true,
    //   handler(newV) {
    //     if (!newV || newV === 'null' || newV === undefined) {
    //       const appid = window.prompt('Input your appid:');
    //       if (appid) {
    //         localStorage.setItem('appid', appid);
    //         this.appid = appid;
    //       } else {
    //         window.location.reload();
    //       }
    //     }
    //   }
    // },
    // channel: {
    //   immediate: true,
    //   handler(newV) {
    //     if (!newV || newV === 'null' || newV === undefined) {
    //       const channel = window.prompt('Input your room channel:');
    //       console.log(channel);
    //       if (channel) {
    //         sessionStorage.setItem('channel', channel);
    //         this.channel = channel;
    //       } else {
    //         window.location.reload();
    //       }
    //     }
    //   }
    // },
    // token: {
    //   immediate: true,
    //   handler(newV) {
    //     if (!newV && newV !== null) {
    //       const token = window.prompt('Input your token:');
    //       if (token) {
    //         localStorage.setItem('token', token);
    //         this.token = token === 'null' ? null : token === null ? undefined : token;
    //       } else {
    //         window.location.reload();
    //       }
    //     }
    //   }
    // }
  },
  methods: {
    handleJoinMeeting(config) {
      console.log('cccccccc', config);
      this.isJoinMeeting = true;
      this.config = config;
      this.$nextTick(() => {
        console.log('rrrrrrrrrrr', this.$refs.meetRefParent);
        this.$refs.meetRefParent.joinRtm();
      });
    },
    handleLeaveMeeting() {
      this.isJoinMeeting = false;
    }
  }
};
</script>
