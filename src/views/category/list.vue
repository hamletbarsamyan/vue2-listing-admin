<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item align="right">
          <el-button v-if="hasPermission('category.view')" :loading="listLoading" type="primary" size="small" icon="el-icon-refresh" @click.native.prevent="getCategoryTree">{{ $t('common.refresh') }}</el-button>

          <router-link v-if="hasPermission('category.manage')" to="/categories/create">
            <el-button type="success" size="small" style="margin-left: 10px" icon="el-icon-plus">{{ $t('common.add') }}</el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading.body="listLoading" :data="categoryTree" row-key="id" border fit highlight-current-row style="width: 100%; margin-bottom: 20px;">
      <el-table-column :label="$t('common.name')" prop="name" width="250"/>
      <el-table-column :label="$t('category.slug')" prop="slug"/>
      <el-table-column :label="$t('common.icon')">
        <template slot-scope="scope">
          <span v-if="scope.row.iconPath" class="item-picture" style="margin-left: 10px;">
            <img :src="scope.row.iconPath" class="img-responsive">
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.sortOrder')" prop="sortOrder"/>
      <el-table-column :label="$t('common.description')" prop="description"/>
      <el-table-column :label="$t('common.actions')" align="center" min-width="40">
        <template slot-scope="scope">
          <router-link :to="'/categories/view/' + scope.row.id">
            <el-button :title="$t('common.view')" type="primary" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-search"/>
          </router-link>

          <router-link v-if="hasPermission('category.manage')" :to="'/categories/edit/' + scope.row.id">
            <el-button :title="$t('common.edit')" type="success" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-edit-outline"/>
          </router-link>

          <el-button v-if="hasPermission('category.manage')" :title="$t('common.delete')" type="danger" size="mini" icon="el-icon-delete" @click="removeCategory(scope.row.id)"/>
        </template>

      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getCategoryTree, deleteCategory } from '@/api/category';

export default {
  name: 'CategoryList',
  data() {
    return {
      categoryTree: [],
      total: 0,
      listLoading: true
    };
  },
  created() {
    this.getCategoryTree();
  },
  activated() {
    var reload = this.$route.params && this.$route.params.reload;
    if (reload) {
      this.getCategoryTree();
    }
  },
  methods: {
    getCategoryTree() {
      this.listLoading = true;
      getCategoryTree().then(response => {
        this.categoryTree = response.data.data;
        this.listLoading = false;
      });
    },
    removeCategory(categoryId) {
      this.$confirm(this.$t('category.delete_confirm'), 'Warning', {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        deleteCategory(categoryId).then(response => {
          const appResp = response.data;

          if (appResp.error === true) {
            if (appResp.code === 41) {
              this.$message({
                message: this.$t('category.delete_error'),
                type: 'error'
              });
            } else {
              this.$message({
                message: appResp.data,
                type: 'error'
              });
            }
          } else {
            this.$message.success(this.$t('category.delete_success'));
            this.getCategoryTree();
          }
        });
      });
    }
  }
};
</script>
