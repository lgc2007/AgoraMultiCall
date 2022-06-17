<template>
  <div class="login">
    <div
      id="index"
      class="login"
    >
      <van-form validate-first @submit="login">
        <van-field
          v-model="information.username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="information.password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px;">
          <van-button
            round
            block
            type="info"
            native-type="submit"
          >提交</van-button>
        </div>
      </van-form>
    </div>
    <!-- <div class="info_wrap">
      <div class="info">
        <div class="login_title"><img src="~@/assets/login/login_title.png" alt=""></div>
        <el-form ref="form" :model="information" :rules="rules">
          <el-form-item prop="username">
            <el-input
              v-model="information.username"
              placeholder="请输入登录账号"
              clearable
            >
              <img slot="prefix" src="~@/assets/login/username_new.png" alt="username" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="information.password"
              show-password
              placeholder="请输入登录密码"
              @keyup.enter.native="login"
            >
              <img slot="prefix" src="~@/assets/login/password_new.png" alt="password" />
            </el-input>
          </el-form-item>
          <div class="auxiliary">
            <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
            <span class="forget-password" @click="forgetPassword">忘记密码</span>
          </div>
          <el-form-item>
            <el-button round class="login-btn" type="primary" :loading="loading" @click="login">{{
              loading ? '登录中...' : '登录'
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div> -->
  </div>
</template>

<script>
import JSEncrypt from 'jsencrypt';
import { Button } from 'vant';
import { Form } from 'vant';
import { Field } from 'vant';
export default {
  name: 'Login',
  components: {
    [Button.name]: Button,
    [Field.name]: Field,
    [Form.name]: Form,
  },
  props: {
    title: {
      type: String,
      default: '国资监管平台',
    },
    to: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      information: {
        username: '',
        password: '',
      },
      publicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCHQh8qVJF1nJ0A-iL_ksa9kcF9-GmQ8BidUg5p78jjeuSBDaR-vc6jM9SxPmfWPfEOtXrIQj0y3_isEv1Z8PeSO1pLt2pP5gSgp3OATChDz--T46dkQpkAIw3bsWkS6RAgEssRvr6xWsD112wMDI2z6K8XbCPbCPDA3tRiTdKwtQIDAQAB',
      privateKey: '',
      autoLogin: false,
      rules: {
        username: {
          required: true,
          message: '用户名不能为空',
          trigger: 'blur',
        },
        password: {
          required: true,
          message: '密码不能为空',
          trigger: 'blur',
        },
      },
      loading: false,
    };
  },
  computed: {
    rtcToken() {
      return this.$store.state.user.rtcToken;
    }
  },
  methods: {
    // 加密方法
    RSAencrypt(pas) {
    // 实例化jsEncrypt对象
      const jse = new JSEncrypt();
      // 设置公钥
      jse.setPublicKey(this.publicKey);
      return jse.encrypt(pas);
    },

    // 解密方法 暂时用不到
    RSAdecrypt(pas) {
      const jse = new JSEncrypt();
      // 私钥
      jse.setPrivateKey(this.privateKey);
      return jse.decrypt(pas);
    },
    login() {
      this.success();
    },
    success() {
      // this.close();
      console.log(this);
      this.loading = true;
      this.$store
        .dispatch('user/login', {
          username: this.information.username,
          password: this.RSAencrypt(this.information.password),
        })
        .then(async (token) => {
          try {
            await this.$store.dispatch('user/getRtmToken');
            await this.$store.dispatch('user/getAgoraId');
            await this.$store.dispatch('user/page');
            await this.$store.dispatch('user/meetingDetail');
            // await this.$store.dispatch('user/meetingAttend');
            if (
              this.$route.query.redirect &&
            this.$route.query.redirect !== '/' &&
            this.$route.query.redirect.indexOf('login') === -1
            ) {
              this.$router.push({ path: this.$route.query.redirect });
            } else {
              this.$router.push({ path: '/home' });
            }
            this.loading = false;
          } catch (error) {
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    close() {
      this.VShow = false;
    },
    forgetPassword() {
      this.$router.push({ path: '/forgetPassword' });
    }
  },
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  background-size: 100%;
  width: 100%;
  min-height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  // background: url('~@/assets/login/login_bg_new.png') no-repeat center / cover;
}
::v-deep .info_wrap {
  width: 946px;
  height: 567px;
  padding: 68px 68px;
  box-sizing: content-box;
  display: flex;
  flex-direction: row-reverse;
  background-color: rgba(255, 255, 255, 1);
  // background: url('~@/assets/login/login_bg_inner.jpg') no-repeat;
  // background-size: 100% 100%;
  .info {
    width: 498px;
    position: relative;
    .login_title {
      text-align: center;
      padding: 70px 0 60px;
      img {
        width: 48px;
        height: 26px;
      }
    }
    .el-form {
      padding-left: 66px;
      padding-right: 70px;
      .el-form-item {
        margin-bottom: 22px;
      }
    }
    .el-input__prefix {
      left: 26px;
      display: flex;
      align-items: center;
      img {
        width: 17px;
        height: 19px;
      }
    }
    .el-form-item__error {
      padding: 4px 37px 0;
    }
    .el-input__suffix {
      right: 30px;
    }
    .el-input__inner {
      height: 56px;
      border-radius: 37px;
      padding-left: 54px;
      padding-right: 45px;
    }
    .el-checkbox__label {
      font-size: 15px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #4D4D4D;
    }
    .login-btn {
      margin-top: 33px;
    }
  }
}
.auxiliary {

  display: flex;
  justify-content: space-between;
  padding: 0 37px;
}

.forget-password {
  font-size: 15px;
  cursor: pointer;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #B9BED1;
}

.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
ul {
  padding-top: 40px;
}
::v-deep .el-button--primary {
  width: 100%;
  height: 50px;
}
::v-deep .el-form-item {
  &:last-of-type {
    margin-bottom: 0;
  }
}
.forget {
  text-align: right;
  font-size: 14px;
  line-height: 40px;
}
</style>
