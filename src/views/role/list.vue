<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item align="right">
          <el-button v-if="hasPermission('role.view')" :loading="listLoading" type="primary" size="small" icon="el-icon-refresh" @click.native.prevent="getRoles">{{ $t('common.refresh') }}</el-button>

          <router-link v-if="hasPermission('role.manage')" to="/roles/create">
            <el-button type="success" size="small" style="margin-left: 10px" icon="el-icon-plus">{{ $t('common.add') }}</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column :label="$t('common.id')" min-width="20" prop="id"/>
      <el-table-column :label="$t('common.name')" prop="name"/>
      <el-table-column :label="$t('common.description')" prop="description"/>
      <el-table-column :label="$t('role.defaultRole')" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.defaultRole" class="active-icon el-icon-check"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" align="center" min-width="30">
        <template slot-scope="scope">
          <router-link :to="'/roles/view/' + scope.row.id">
            <el-button :title="$t('common.view')" type="primary" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-search"/>
          </router-link>

          <router-link v-if="hasPermission('role.manage')" :to="'/roles/edit/' + scope.row.id">
            <el-button :title="$t('common.edit')" type="success" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-edit-outline"/>
          </router-link>
          <el-button v-if="hasPermission('role.manage')" :title="$t('common.delete')" type="danger" size="mini" icon="el-icon-delete" @click="removeRole(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getRoles, deleteRole } from '@/api/role';

export default {
  name: 'RoleList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true
    };
  },
  created() {
    this.getRoles();
  },
  activated() {
    var reload = this.$route.params && this.$route.params.reload;
    if (reload) {
      this.getRoles();
    }
  },
  methods: {
    getRoles() {
      this.listLoading = true;
      getRoles().then(response => {
        this.list = response.data.data;
        this.total = this.list.size;
        this.listLoading = false;
      });
    },
    removeRole(roleId) {
      this.$confirm(this.$t('role.delete_confirm'), 'Warning', {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        deleteRole(roleId).then(response => {
          const appResp = response.data;
          if (appResp.error === true) {
            this.$message({
              message: appResp.data,
              type: 'error'
            });
          } else {
            this.$message.success(this.$t('role.delete_success'));
            this.getRoles();
          }
        });
      });
    }
  }
};
</script>
