<template>
  <div class="form-container">

    <el-form ref="resetForm" :model="resetForm" :rules="resetRules" class="login-form" auto-complete="on" label-width="100px" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ $t('resetPassword.resetPassword') }}</h3>
        <lang-select class="set-language"/>
      </div>

      <div class="header-text">
        <span class="title">{{ $t('resetPassword.headerText') }}</span>
      </div>

      <el-form-item :label="$t('common.email')" prop="email">
        <el-input
          v-model="resetForm.email"
          name="email"
          type="text"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" size="small" type="success" @click.native.prevent="handleSendEmail">{{ $t('resetPassword.resetPassword') }}</el-button>
        <router-link to="/" style="color:white; float: right;">
          <el-button type="primary" size="small">{{ $t('common.back') }}</el-button>
        </router-link>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { validateEmail } from '@/utils/validate';
import LangSelect from '@/components/LangSelect';
import { Message } from 'element-ui';

export default {
  name: 'Reset',
  components: { LangSelect },
  data() {
    const isValidEmail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error('Please enter a valid email'));
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
          this.loading = true;
          const email = this.resetForm.email.trim();

          this.$store.dispatch('SendPasswordResetMail', email).then(res => {
            const appResp = res.data;
            if (appResp.error === true) {
              Message.error(appResp.data);
            } else {
              this.$router.push('/reset-mail-sent');
            }
            this.loading = false;
          }).catch(err => {
            console.log(err);
            this.loading = false;
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#white;
$dark_gray:#454545;
$light_gray:#454545;

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
    margin-bottom: 20px;
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
