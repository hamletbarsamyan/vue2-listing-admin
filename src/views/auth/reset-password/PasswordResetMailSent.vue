<template>
  <div class="form-container">

    <el-form ref="resetForm" :model="resetForm" :rules="resetRules" label-width="150px" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ $t('resetPassword.resetPassword') }}</h3>
        <lang-select class="set-language"/>
      </div>

      <div class="header-text">
        <span class="title">{{ $t('resetPassword.mailSent') }}</span>
      </div>

      <router-link to="/" style="color:white; float: left;">
        <el-button type="primary" size="small">{{ $t('common.back') }}</el-button>
      </router-link>
      <router-view/>
    </el-form>

  </div>
</template>

<script>
import { validateEmail } from '@/utils/validate';
import LangSelect from '@/components/LangSelect';

export default {
  name: 'Reset',
  components: { LangSelect },
  data() {
    const isValidEmail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error(this.$t('common.email_is_invalid')));
      } else {
        callback();
      }
    };
    return {
      resetForm: {
        email: ''
      },
      resetRules: {
        email: [{ required: true, trigger: 'blur', validator: isValidEmail }]
      },
      loading: false,
      showDialog: false,
      redirect: undefined
    };
  },
  methods: {
    handleSendEmail() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          const user = {};
          user.email = this.resetForm.email;
          this.loading = true;
          this.$store.dispatch('SendPasswordResetMail', this.resetForm).then(() => {
            this.loading = false;
            this.$router.push({ path: this.redirect || '/' });
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
  $bg: #3c433c;
  $light_gray:#454545;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .form-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }

  /* reset element-ui css */
  .form-container {
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

.form-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
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
  .header-text {
    position: relative;
    margin-bottom: 30px;
    .title {
      font-size: 18px;
      color: $light_gray;
      margin: 0px auto 60px auto;
      text-align: center;
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
