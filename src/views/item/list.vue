<template>
  <div class="app-container">
    <br>
    <div class="filter-container">
      <form id="searchForm">
        <el-form ref="searchForm">
          <el-form-item>
            <div style="float: left;">
              <el-select ref="categoryId" v-model="listQuery.categoryId" :placeholder="$t('category.category')" clearable style="width: 200px;" class="filter-item">
                <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id">
                  <span v-if="category.parentId > 0"> - </span>
                  <span>{{ category.name }}</span>
                </el-option>
              </el-select>
              <el-input :placeholder="$t('common.name')" v-model="listQuery.name" style="width: 200px;" clearable class="filter-item" @keyup.enter.native="search"/>
              <el-input :placeholder="$t('item.upc')" v-model="listQuery.upc" style="width: 200px;" clearable class="filter-item" @keyup.enter.native="search"/>
              <el-select ref="status" :placeholder="$t('item.status')" v-model="listQuery.status" clearable class="filter-item" style="width: 130px">
                <el-option key="1" :label="$t('item.status_active')" value="1"/>
                <el-option key="0" :label="$t('item.status_inactive')" value="0"/>
              </el-select>
            </div>

            <div style="float: right;">
              <el-button :loading="listLoading" type="primary" size="small" icon="el-icon-search" @click="search">{{ $t('common.search') }}</el-button>
              <el-button :loading="listLoading" type="warning" size="small" icon="el-icon-refresh" @click.native.prevent="resetSearch">{{ $t('common.reset') }}</el-button>
              <router-link to="/items/create">
                <el-button type="success" size="small" style="margin-left: 10px" icon="el-icon-plus">{{ $t('common.add') }}</el-button>
              </router-link>
            </div>
          </el-form-item>
        </el-form>
      </form>
    </div>

    <el-table v-loading.body="listLoading" ref="searchTable" :data="items" row-key="id" border fit highlight-current-row style="width: 100%; margin-bottom: 20px;" @sort-change="sort">
      <el-table-column :label="$t('common.thumbnail')">
        <template slot-scope="scope">
          <span v-if="scope.row.thumbnailPath" class="item-picture" style="margin-left: 10px;">
            <img :src="scope.row.thumbnailPath" class="img-responsive">
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('category.category')" sortable prop="category"/>
      <el-table-column :label="$t('common.name')" sortable prop="name" width="200"/>
      <el-table-column :label="$t('common.price')" sortable prop="price">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span> <span>{{ scope.row.currency }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.upc')" sortable prop="upc"/>
      <el-table-column :label="$t('item.status')" sortable prop="status" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.active" class="active-icon el-icon-check"/>
          <i v-if="!scope.row.active" class="in-active-icon el-icon-close"/>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.created_at')" sortable align="center" prop="createdAt">
        <template slot-scope="scope">
          <span v-if="scope.row.createdAt">
            <i class="el-icon-time"/> <span>{{ unix2CurrentTime(scope.row.createdAt) }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.actions')" align="center" min-width="60">
        <template slot-scope="scope">
          <router-link :to="'/items/view/' + scope.row.id">
            <el-button :title="$t('common.view')" type="primary" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-search"/>
          </router-link>

          <router-link v-if="hasPermission('item.manage')" :to="'/items/edit/' + scope.row.id">
            <el-button :title="$t('common.edit')" type="success" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-edit-outline"/>
          </router-link>

          <el-button v-if="hasPermission('item.manage')" :title="$t('common.delete')" type="danger" size="mini" icon="el-icon-delete" @click="removeItem(scope.row.id)"/>
        </template>

      </el-table-column>
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
import { lookupCategories } from '@/api/category';
import { getItems, deleteItem } from '@/api/item';
import { unix2CurrentTime } from '@/utils';

export default {
  name: 'ItemList',
  data() {
    return {
      categories: [],
      items: [],
      total: 0,
      listLoading: true,
      listQuery: {
        categoryId: '',
        name: '',
        upc: '',
        status: '',
        page: 1, // current page
        size: 30, // page size
        sortBy: '',
        asc: true
      }
    };
  },
  created() {
    this.fetchCategoryItems();
    this.search();
  },
  activated() {
    var reload = this.$route.params && this.$route.params.reload;
    if (reload) {
      this.search();
    }
  },
  methods: {
    unix2CurrentTime,
    fetchCategoryItems() {
      lookupCategories().then(response => {
        this.categories = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    search() {
      this.listLoading = true;
      if (this.listQuery.categoryId == null) {
        this.listQuery.categoryId = '';
      }
      if (this.listQuery.status == null) {
        this.listQuery.status = '';
      }
      getItems(this.listQuery).then(response => {
        const appResponse = response.data.data;
        this.items = appResponse.list;
        this.total = appResponse.total;
        this.listLoading = false;
      });
    },
    resetSearch() {
      this.listLoading = true;
      this.listQuery.categoryId = '';
      this.listQuery.name = '';
      this.listQuery.upc = '';
      this.listQuery.status = '';
      this.listQuery.page = 1;
      this.listQuery.size = 30;
      this.listQuery.sortBy = '';
      this.listQuery.asc = true;
      this.$refs['searchTable'].clearSort();

      getItems(this.listQuery).then(response => {
        const appResponse = response.data.data;
        this.items = appResponse.list;
        this.total = appResponse.total;
        this.listLoading = false;
      });
    },
    sort(data) {
      this.listLoading = true;
      this.listQuery.sortBy = data.prop;
      this.listQuery.asc = data.order === 'ascending';
      getItems(this.listQuery).then(response => {
        const appResponse = response.data.data;
        this.items = appResponse.list;
        this.total = appResponse.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(size) {
      this.listQuery.size = size;
      this.listQuery.page = 1;
      this.search();
    },
    handleCurrentChange(page) {
      this.listQuery.page = page;
      this.search();
    },
    getIndex(index) {
      return (this.listQuery.page - 1) * this.listQuery.size + index + 1;
    },
    removeItem(itemId) {
      this.$confirm(this.$t('item.delete_confirm'), 'Warning', {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        deleteItem(itemId).then(response => {
          const appResp = response.data;

          if (appResp.error === true) {
            if (appResp.code === 41) {
              this.$message({
                message: this.$t('item.delete_error'),
                type: 'error'
              });
            } else {
              this.$message({
                message: appResp.data,
                type: 'error'
              });
            }
          } else {
            this.$message.success(this.$t('item.delete_success'));
            this.search();
          }
        });
      });
    }
  }
};
</script>
