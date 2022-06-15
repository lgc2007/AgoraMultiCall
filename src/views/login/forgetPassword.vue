<template>
  <div class="login">
    <div class="info_wrap">
      <div class="info">
        <span class="back" @click="$router.push('login')">返回账号登陆</span>
        <div class="login_title">
          <img src="~@/assets/login/forget_password.jpg" alt="" />
        </div>
        <el-form ref="form" :model="information" :rules="rules">
          <el-form-item prop="username">
            <el-input
              v-model="information.username"
              placeholder="请输入登录账号"
              clearable
            >
              <img
                slot="prefix"
                src="~@/assets/login/username_new.png"
                alt="username"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="information.password"
              show-password
              placeholder="请输入登录密码"
              @keyup.enter.native="login"
            >
              <img
                slot="prefix"
                src="~@/assets/login/password_new.png"
                alt="password"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="verification">
            <el-input
              v-model="information.verification"
              class="verification-input"
              placeholder="请输入验证码"
              @keyup.enter.native="login"
            >
              <span slot="suffix" class="get-code">获取验证码</span>
              <img
                slot="prefix"
                src="~@/assets/login/verification.png"
                alt="password"
              />
            </el-input>
          </el-form-item>
          <!-- <div class="auxiliary">
            <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
            <span class="forget-password" @click="forgetPassword">忘记密码</span>
          </div> -->
          <el-form-item>
            <el-button
              round
              class="login-btn"
              type="primary"
              :loading="loading"
              @click="login"
            >{{ loading ? '登录中...' : '登录' }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
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
        verification: '',
      },
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
        verification: {
          required: true,
          message: '验证码不能为空',
          trigger: 'blur',
        },
      },
      loading: false,
    };
  },
  methods: {
    login() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.success();
        } else {
        }
      });
    },
    success() {
      // this.close();
      this.loading = true;
      this.$store
        .dispatch('user/login', this.information)
        .then(token => {
          if (
            this.$route.query.redirect &&
            this.$route.query.redirect !== '/' &&
            this.$route.query.redirect.indexOf('login') === -1
          ) {
            this.$router.push({ path: this.$route.query.redirect });
          } else {
            this.$router.push({ path: '/' });
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
        });
    },
    close() {
      this.VShow = false;
    },
    forgetPassword() {},
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
  background: url('~@/assets/login/login_bg_new.png') no-repeat center / cover;
}
::v-deep .info_wrap {
  width: 946px;
  height: 567px;
  padding: 68px 68px;
  box-sizing: content-box;
  display: flex;
  flex-direction: row-reverse;
  background-color: rgba(255, 255, 255, 1);
  background: url('~@/assets/login/login_bg_inner.jpg') no-repeat;
  background-size: 100% 100%;
  .info {
    width: 498px;
    position: relative;
    .back {
      position: absolute;
      right: 43px;
      top: 34px;
      font-size: 14px;
      font-weight: 400;
      font-weight: 400;
      color: #0599df;
      cursor: pointer;
    }
    .login_title {
      text-align: center;
      padding: 70px 0 60px;
      img {
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
      color: #4d4d4d;
    }
    .login-btn {
      margin-top: 33px;
    }
    .verification-input {
      .el-input__suffix {
        cursor: pointer;
        right: 0;
        padding: 0 35px;
        color: #f3f5fe;
        background: #2c59de;
        border-radius: 37px;
        display: flex;
        align-items: center;
      }
      .get-code {
        // cursor: pointer;
      }
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
  color: #b9bed1;
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
