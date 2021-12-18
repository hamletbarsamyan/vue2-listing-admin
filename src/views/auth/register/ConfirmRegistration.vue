<template>
  <div class="form-container">
    <el-form class="reset-form" auto-complete="on" label-position="left">
      <div class="header-text">
        <span class="title">{{ $t('user.confirmRegistration') }}</span>
      </div>
      <br>
      <el-button :loading="loading" type="success" size="small" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleConfirmRegistration">{{ $t('common.confirm') }}</el-button>
    </el-form>

  </div>
</template>

<script>
import { Message } from 'element-ui';

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      redirect: undefined
    };
  },
  methods: {
    handleConfirmRegistration() {
      const postData = {};
      postData.userId = this.$route.query.id;
      postData.token = this.$route.query.token;
      this.loading = true;

      this.$store.dispatch('ConfirmRegistration', postData).then(res => {
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
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:white;
$dark_gray:#2d3a4b;
$light_gray:#2d3a4b;

.form-container {
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
  }
}
</style>
