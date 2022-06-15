<template>
  <div class="home">
    <meet
      v-if="isJoinMeeting"
      :channel="channel"
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
      // 5fe43576b74a48babc7fec3fc2dd9bf9 7e22d34cd0214cc9b80ff3e31f283202   fb1e2ad91a584f3785438f22589de1d4
      isJoinMeeting: false,
      config: null,
      appid: '743decdce87c47be9758498fb9829774' || localStorage.getItem('appid') || '',
      channel: 'm770ul2o4' || sessionStorage.getItem('channel') || '',
      token: '006743decdce87c47be9758498fb9829774IABNcTbdqOHFWohUXwgm0pu3ojBeR+Qiw+7htYj3rgaZZG8hbwmXiKC3IgAh7MxZagSkYgQAAQBqBKRiAgBqBKRiAwBqBKRiBABqBKRi',
      //  ||
      //   localStorage.getItem("token") === "null"
      //     ? null
      //     : localStorage.getItem("token") === null
      //     ? undefined
      //     : localStorage.getItem("token") || ''
    };
  },
  computed: {
    rtcToken() {
      return this.$store.state.user.rtcToken;
    },
    rtmToken() {
      return this.$store.state.user.rtmToken;
    },
  },
  watch: {
    appid: {
      immediate: true,
      handler(newV) {
        if (!newV || newV === 'null' || newV === undefined) {
          const appid = window.prompt('Input your appid:');
          if (appid) {
            localStorage.setItem('appid', appid);
            this.appid = appid;
          } else {
            window.location.reload();
          }
        }
      }
    },
    channel: {
      immediate: true,
      handler(newV) {
        if (!newV || newV === 'null' || newV === undefined) {
          const channel = window.prompt('Input your room channel:');
          console.log(channel);
          if (channel) {
            sessionStorage.setItem('channel', channel);
            this.channel = channel;
          } else {
            window.location.reload();
          }
        }
      }
    },
    token: {
      immediate: true,
      handler(newV) {
        if (!newV && newV !== null) {
          const token = window.prompt('Input your token:');
          if (token) {
            localStorage.setItem('token', token);
            this.token = token === 'null' ? null : token === null ? undefined : token;
          } else {
            window.location.reload();
          }
        }
      }
    }
  },
  methods: {
    handleJoinMeeting(config) {
      this.isJoinMeeting = true;
      this.config = config;
    },
    handleLeaveMeeting() {
      this.isJoinMeeting = false;
    }
  }
};
</script>
