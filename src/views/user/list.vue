<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item align="right">
          <el-button v-if="hasPermission('user.view')" :loading="listLoading" type="primary" size="small" icon="el-icon-refresh" @click.native.prevent="loadUsers">{{ $t('common.refresh') }}</el-button>

          <router-link v-if="hasPermission('user.manage')" to="/users/create">
            <el-button type="success" size="small" style="margin-left: 10px" icon="el-icon-plus">{{ $t('common.add') }}</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column :label="$t('common.id')" min-width="20" prop="id"/>
      <el-table-column :label="$t('user.login')" prop="login"/>
      <el-table-column :label="$t('user.full_name')" prop="fullName"/>
      <el-table-column :label="$t('user.email')" prop="email"/>
      <el-table-column :label="$t('user.enabled')" prop="enabled" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.enabled" class="active-icon el-icon-check"/>
          <i v-if="!scope.row.enabled" class="in-active-icon el-icon-close"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.last_login')" align="center" prop="lastLogin">
        <template slot-scope="scope">
          <span v-if="scope.row.lastLogin">
            <i class="el-icon-time"/> <span>{{ unix2CurrentTime(scope.row.lastLogin) }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" align="center" min-width="40">
        <template slot-scope="scope">
          <router-link :to="'/users/view/' + scope.row.id">
            <el-button :title="$t('common.view')" type="primary" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-search"/>
          </router-link>

          <router-link v-if="hasPermission('user.manage')" :to="'/users/edit/' + scope.row.id">
            <el-button :title="$t('common.edit')" type="success" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-edit-outline"/>
          </router-link>
          <el-button v-if="hasPermission('user.manage')" :title="$t('common.delete')" type="danger" size="mini" icon="el-icon-delete" @click="removeUser(scope.row.id)"/>
        </template>
      </el-table-column>go
    </el-table>

    <el-pagination
      :page-size="listQuery.size"
      :current-page="listQuery.page"
      :total="total"
      :page-sizes="[10, 30, 50, 100]"
      align="right"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import { getUsers, deleteUser } from '@/api/user';
import { unix2CurrentTime } from '@/utils';

export default {
  name: 'UserList',
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1, // current page
        size: 30 // page size
      }
    };
  },
  created() {
    this.loadUsers();
  },
  activated() {
    var reload = this.$route.params && this.$route.params.reload;
    if (reload) {
      this.loadUsers();
    }
  },
  methods: {
    unix2CurrentTime,
    loadUsers() {
      this.listLoading = true;
      getUsers(this.listQuery).then(response => {
        const appResponse = response.data.data;
        this.list = appResponse.list;
        this.total = appResponse.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(size) {
      this.listQuery.size = size;
      this.listQuery.page = 1;
      this.loadUsers();
    },
    handleCurrentChange(page) {
      this.listQuery.page = page;
      this.loadUsers();
    },
    getIndex(index) {
      return (this.listQuery.page - 1) * this.listQuery.size + index + 1;
    },
    removeUser(userId) {
      this.$confirm(this.$t('user.delete_confirm'), 'Warning', {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        deleteUser(userId).then(response => {
          const appResp = response.data;
          if (appResp.error === true) {
            this.$message({
              message: appResp.data,
              type: 'error'
            });
          } else {
            this.$message.success(this.$t('user.delete_success'));
            this.loadUsers();
          }
        });
      });
    }
  }
};
</script>
