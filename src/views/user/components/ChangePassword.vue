<template>
  <div class="form-container">
    <el-form ref="changePasswordForm" :model="changePasswordForm" :rules="rules" :key="componentKey" class="form-container" auto-complete="of">
      <div class="form-main-container">
        <el-form-item :label="$t('user.oldPassword')" required prop="oldPassword">
          <el-input v-model="changePasswordForm.oldPassword" :maxlength="100" type="text"/>
        </el-form-item>

        <el-form-item :label="$t('user.newPassword')" required prop="newPassword">
          <el-input v-model="changePasswordForm.newPassword" :maxlength="128" type="text"/>
        </el-form-item>

        <el-form-item :label="$t('user.retypeNewPassword')" required prop="rePassword">
          <el-input v-model="changePasswordForm.rePassword" :maxlength="128" type="text"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" style="float: right; margin-left: 10px" @click.native.prevent="cancel">{{ $t('common.cancel') }}</el-button>
          <el-button :loading="loading" type="success" size="small" style="float: right; margin-left: 10px" @click.native.prevent="changePassword">{{ $t('user.changePassword') }}</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { changePassword } from '@/api/profile';

const defaultForm = {
  oldPassword: '',
  newPassword: '',
  rePassword: ''
};

export default {
  name: 'ChangePassword',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error(this.$t('user.passwordLengthError')));
      } else {
        callback();
      }
    };
    return {
      changePasswordForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        oldPassword: [{ required: true, message: this.$t('user.oldPassword') + ' ' + this.$t('common.is_required'), trigger: 'change', validator: validatePassword }],
        newPassword: [{ required: true, message: this.$t('user.newPassword') + ' ' + this.$t('common.is_required'), trigger: 'change', validator: validatePassword }],
        rePassword: [{ required: true, message: this.$t('user.retypeNewPassword') + ' ' + this.$t('common.is_required'), trigger: 'change', validator: validatePassword }]
      }
    };
  },
  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    cancel() {
      const route = this.generateRoute();
      if (route) {
        this.$store.dispatch('delView', route);
      }
      this.$router.push('/profile');
    },
    changePassword() {
      this.$refs.changePasswordForm.validate(valid => {
        if (valid) {
          this.loading = true;
          changePassword(this.changePasswordForm).then(res => {
            const appResp = res.data;
            if (appResp.error === true) {
              this.$message({
                message: appResp.data,
                type: 'error'
              });
            } else {
              this.$message.success(appResp.data);
            }
            this.loading = false;
          }).catch(err => {
            console.log(err);
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
@import "src/styles/mixin.scss";
.form-container {
  width:60%;
  position: relative;
  margin: 10px 10px 10px 10px;
  .form-main-container {
    padding: 40px 45px 20px 50px;
    margin-bottom: 20px;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
  }
}
</style>
