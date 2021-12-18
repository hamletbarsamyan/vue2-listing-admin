<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item align="right">
          <el-button v-if="hasPermission('attribute.view')" :loading="listLoading" type="primary" size="small" icon="el-icon-refresh" @click.native.prevent="loadAttributes">{{ $t('common.refresh') }}</el-button>

          <router-link v-if="hasPermission('attribute.manage')" to="/attributes/create">
            <el-button type="success" size="small" style="margin-left: 10px" icon="el-icon-plus">{{ $t('common.add') }}</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading.body="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column :label="$t('common.name')" min-width="50" prop="name"/>
      <el-table-column :label="$t('attribute.type')" min-width="30" prop="attrType"/>
      <el-table-column :label="$t('common.description')" prop="description"/>
      <el-table-column :label="$t('attribute.extraInfo')" prop="extraInfo"/>
      <el-table-column :label="$t('common.actions')" align="center" min-width="40">
        <template slot-scope="scope">
          <router-link :to="'/attributes/view/' + scope.row.id">
            <el-button :title="$t('common.view')" type="primary" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-search"/>
          </router-link>

          <router-link v-if="hasPermission('attribute.manage')" :to="'/attributes/edit/' + scope.row.id">
            <el-button :title="$t('common.edit')" type="success" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-edit-outline"/>
          </router-link>

          <el-button v-if="hasPermission('attribute.manage')" :title="$t('common.delete')" type="danger" size="mini" icon="el-icon-delete" @click="removeAttribute(scope.row.id)"/>
        </template>

      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAttributes, deleteAttribute } from '@/api/attribute';

export default {
  name: 'AttributeList',
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true
    };
  },
  created() {
    this.loadAttributes();
  },
  activated() {
    var reload = this.$route.params && this.$route.params.reload;
    if (reload) {
      this.loadAttributes();
    }
  },
  methods: {
    loadAttributes() {
      this.listLoading = true;
      getAttributes().then(response => {
        this.list = response.data.data;
        this.total = this.total = this.list.size;
        this.listLoading = false;
      });
    },
    removeAttribute(attributeId) {
      this.$confirm(this.$t('attribute.delete_confirm'), 'Warning', {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        deleteAttribute(attributeId).then(response => {
          const appResp = response.data;

          if (appResp.error === true) {
            if (appResp.code === 41) {
              this.$message({
                message: this.$t('attribute.delete_error'),
                type: 'error'
              });
            } else {
              this.$message({
                message: appResp.data,
                type: 'error'
              });
            }
          } else {
            this.$message.success(this.$t('attribute.delete_success'));
            this.loadAttributes();
          }
        });
      });
    }
  }
};
</script>
