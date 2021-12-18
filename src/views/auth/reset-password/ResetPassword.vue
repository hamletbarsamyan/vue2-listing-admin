<template>
  <div class="login-container">

    <el-form ref="resetForm" :model="resetForm" :rules="rules" class="reset-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ $t('resetPassword.resetPassword') }}</h3>
        <lang-select class="set-language"/>
      </div>

      <el-form-item prop="newPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model="resetForm.newPassword"
          :placeholder="$t('resetPassword.newPassword')"
          name="newPassword"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-form-item prop="repeatNewPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model="resetForm.repeatNewPassword"
          :placeholder="$t('resetPassword.repeatNewPassword')"
          name="repeatNewPassword"
          auto-complete="on"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="success" size="small" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleResetPassword">{{ $t('resetPassword.resetPassword') }}</el-button>
    </el-form>

  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect';
import { Message } from 'element-ui';

export default {
  name: 'Login',
  components: { LangSelect },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error(this.$t('user.passwordLengthError')));
      } else {
        callback();
      }
    };
    return {
      resetForm: {
        newPassword: '',
        repeatNewPassword: ''
      },
      rules: {
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        repeatNewPassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
    },
    handleResetPassword() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          const postData = {};
          postData.userId = this.$route.query.id;
          postData.token = this.$route.query.token;
          postData.newPassword = this.resetForm.newPassword;
          postData.reNewPassword = this.resetForm.repeatNewPassword;
          this.loading = true;

          this.$store.dispatch('ResetPassword', postData).then(res => {
            this.loading = false;
            const appResp = res.data;

            if (appResp.error === true) {
              Message.error(appResp.data);
            } else {
              this.$router.push('/login');
            }
          }).catch(() => {
            this.loading = false;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg:#283443;
  $light_gray:#283443;
  $cursor: #283443;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:white;
$dark_gray:#2d3a4b;
$light_gray:#2d3a4b;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .reset-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
