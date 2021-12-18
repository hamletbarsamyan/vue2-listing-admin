<template>
  <div class="form-container">

    <el-form ref="registerForm" :model="registerForm" :rules="rules" class="register-form" label-width="150px" auto-complete="of" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ $t('user.registration') }}</h3>
        <lang-select class="set-language"/>
      </div>

      <el-form-item :label="$t('user.login')" prop="login">
        <el-input
          v-model="registerForm.login"
          name="login"
          type="text"/>
      </el-form-item>

      <el-form-item :label="$t('user.password')" prop="password">
        <el-input
          :type="passwordType"
          v-model="registerForm.password"
          name="password"/>
      </el-form-item>

      <el-form-item :label="$t('user.confirm_password')" prop="confirmPassword">
        <el-input
          :type="passwordType"
          v-model="registerForm.confirmPassword"
          name="confirmPassword"/>
      </el-form-item>

      <el-form-item :label="$t('user.full_name')" prop="fullName">
        <el-input
          v-model="registerForm.fullName"
          name="fullName"
          type="text" />
      </el-form-item>

      <el-form-item :label="$t('user.email')" prop="email">
        <el-input
          v-model="registerForm.email"
          name="email"
          type="text"/>
      </el-form-item>

      <el-form-item :label="$t('user.zip')" prop="zip">
        <el-input
          v-model="registerForm.zip"
          name="zip"
          type="text"/>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="success" size="small" @click.native.prevent="handleRegister">{{ $t('user.register') }}</el-button>
        <router-link to="/" style="color:white; float: right;">
          <el-button type="primary" size="small">{{ $t('common.back') }}</el-button>
        </router-link>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import LangSelect from '@/components/LangSelect';
import { Message } from 'element-ui';
import { validateEmail } from '@/utils/validate';

export default {
  name: 'Login',
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
      registerForm: {
        login: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        email: '',
        zip: ''
      },
      rules: {
        login: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur' }],
        confirmPassword: [{ required: true, trigger: 'blur' }],
        fullName: [{ required: true, trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur', validator: isValidEmail }]
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
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          const user = {};
          user.login = this.registerForm.login;
          user.password = this.registerForm.password;
          user.confirmPassword = this.registerForm.confirmPassword;
          user.fullName = this.registerForm.fullName;
          user.email = this.registerForm.email;
          user.zip = this.registerForm.zip;
          this.loading = true;

          this.$store.dispatch('Register', user).then(res => {
            this.loading = false;
            const appResp = res.data;

            if (appResp.error === true) {
              Message.error(appResp.data);
            } else {
              this.$router.push('/register-mail-sent');
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

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: white;
  $dark_gray: #454545;
  $light_gray: #454545;

  .form-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .register-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
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
        color: $light_gray;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }
  }
</style>
