<template>
  <el-form ref="roleForm" :model="roleForm" :rules="rules" class="form-container">
    <el-row>
      <el-col :span="24">
        <el-form-item :label="$t('common.name')" prop="name">
          <el-input v-model="roleForm.name" :maxlength="70" :minlength="70" type="text"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="$t('common.description')" prop="description">
      <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="roleForm.description" type="textarea"/>
    </el-form-item>
    <p style="font-weight: bold;"> {{ $t('role.permissions') }}</p>
    <el-checkbox-group v-model="roleForm.permissions">
      <el-checkbox v-for="permission in availablePermissions" :key="permission.id" :label="permission.id">
        <span>{{ permission.description }}</span>
      </el-checkbox>
    </el-checkbox-group>
    <el-row>
      <el-col :span="24">
        <el-form-item>
          <el-button type="primary" size="small" style="float: right; margin-left: 10px" @click.native.prevent="backToList">{{ $t('common.back') }}</el-button>
          <el-button :loading="loading" type="success" size="small" style="float: right; margin-left: 10px;" @click.native.prevent="saveRole">{{ $t('common.save') }}</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getRole, getPermissions, createOrUpdateRole } from '@/api/role';

const defaultForm = {
  id: 0,
  name: '',
  description: '',
  defaultRole: '',
  permissions: []
};

export default {
  name: 'RoleDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleForm: Object.assign({}, defaultForm),
      loading: false,
      availablePermissions: [],
      rules: {
        name: [{ required: true, message: this.$t('common.name_is_required'), trigger: 'change' }]
      }
    };
  },
  created() {
    this.fetchAllPermissions();
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    } else {
      this.roleForm = Object.assign({}, defaultForm);
    }
  },
  methods: {
    fetchData(id) {
      getRole(id).then(response => {
        const appResponseData = response.data.data;
        this.roleForm = appResponseData;
      }).catch(err => {
        console.log(err);
      });
    },
    fetchAllPermissions() {
      getPermissions().then(response => {
        this.availablePermissions = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    saveRole() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const create = this.roleForm.id === 0;
          const message = create ? this.$t('role.create_success') : this.$t('role.update_success');
          createOrUpdateRole(this.roleForm, create).then(res => {
            const appResp = res.data;
            if (appResp.error === true) {
              this.$message({
                message: appResp.data,
                type: 'error'
              });
            } else {
              this.$message.success(message);
              const route = this.generateRoute();
              if (route) {
                this.$store.dispatch('delView', route);
              }
              this.$router.push({ name: 'RoleList', params: { reload: true }});
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
      this.$router.push('/roles/list');
    }
  }
};
</script>
