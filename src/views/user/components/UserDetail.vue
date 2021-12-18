<template>
  <el-form ref="userForm" :model="userForm" :rules="rules" class="form-container" auto-complete="of">
    <el-form-item :label="$t('user.login')" required prop="login">
      <el-input v-model="userForm.login" :maxlength="100" type="text"/>
    </el-form-item>

    <el-form-item v-if="userForm.create" :label="$t('user.password')" required prop="password">
      <el-input v-model="userForm.password" :maxlength="100" type="text"/>
    </el-form-item>

    <el-form-item v-if="userForm.create" :label="$t('user.confirm_password')" required prop="confirmPassword">
      <el-input v-model="userForm.confirmPassword" :maxlength="100" type="text"/>
    </el-form-item>

    <el-form-item :label="$t('user.full_name')" prop="fullName">
      <el-input v-model="userForm.fullName" :maxlength="128" type="text"/>
    </el-form-item>

    <el-form-item :label="$t('user.email')" required prop="email">
      <el-input v-model="userForm.email" :maxlength="128" type="text"/>
    </el-form-item>

    <el-form-item :label="$t('user.zip')" prop="zip">
      <el-input v-model="userForm.zip" :maxlength="128" type="text"/>
    </el-form-item>

    <el-form-item :label="$t('user.role')" required prop="role">
      <el-select v-model="userForm.role">
        <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"/>
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('user.enabled')" prop="enabled">
      <el-switch v-model="userForm.enabled"/>
    </el-form-item>

    <el-form-item v-if="!userForm.create" :label="$t('common.created_at')">
      <i class="el-icon-time"/>
      <span>{{ unix2CurrentTime(userForm.createdAt) }}</span>
    </el-form-item>

    <el-form-item v-if="userForm.lastLogin != null" :label="$t('user.last_login')">
      <i class="el-icon-time"/>
      <span>{{ unix2CurrentTime(userForm.lastLogin) }}</span>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="small" style="float: right; margin-left: 10px" @click.native.prevent="backToList">{{ $t('common.back') }}</el-button>
      <el-button :loading="loading" type="success" size="small" style="float: right; margin-left: 10px" @click.native.prevent="saveUser">{{ $t('common.save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getRoles } from '@/api/role';
import { getUser, saveUser } from '@/api/user';
import { unix2CurrentTime } from '@/utils';
import { validateEmail } from '@/utils/validate';

const defaultForm = {
  id: 0,
  role: '',
  create: true
};

export default {
  name: 'UserDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const isValidEmail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error(this.$t('common.email_is_invalid')));
      } else {
        callback();
      }
    };
    return {
      userForm: Object.assign({}, defaultForm),
      loading: false,
      roles: [],
      rules: {
        login: [{ required: true, message: this.$t('user.login_is_required'), trigger: 'change' }],
        password: [{ required: true, message: this.$t('user.password_is_required'), trigger: 'change' }],
        confirmPassword: [{ required: true, message: this.$t('user.confirm_password_is_required'), trigger: 'change' }],
        email: [{ required: true, message: this.$t('common.email_is_required'), trigger: 'change', validator: isValidEmail }],
        role: [{ required: true, message: this.$t('user.role_is_required'), trigger: 'change' }]
      }
    };
  },
  created() {
    this.fetchAllRoles();
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    } else {
      this.userForm = Object.assign({}, defaultForm);
    }
  },
  methods: {
    unix2CurrentTime,
    fetchData(id) {
      getUser(id).then(response => {
        const appResponseData = response.data.data;
        this.userForm = appResponseData;
      }).catch(err => {
        console.log(err);
      });
    },
    fetchAllRoles() {
      getRoles().then(response => {
        this.roles = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    saveUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true;
          saveUser(this.userForm).then(res => {
            const appResp = res.data;
            if (appResp.error === true) {
              this.$message({
                message: appResp.data,
                type: 'error'
              });
            } else {
              this.$message.success(appResp.data);
              const route = this.generateRoute();
              if (route) {
                this.$store.dispatch('delView', route);
              }
              this.$router.push({ name: 'UserList', params: { reload: true }});
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
    },
    generateRoute() {
      if (this.$route.name) {
        return this.$route;
      }
      return false;
    },
    backToList() {
      const route = this.generateRoute();
      if (route) {
        this.$store.dispatch('delView', route);
      }
      this.$router.push('/users/list');
    }
  }
};
</script>
