<template>
  <el-form ref="imagesForm" :model="imagesForm" class="form-container90" auto-complete="of">
    <el-form-item v-loading.body="loading" :data="images" row-key="id">
      <el-table-column :label="$t('common.icon')">
        <template slot-scope="scope">
          <span v-if="scope.row.iconPath" class="item-picture" style="margin-left: 10px;">
            <img :src="scope.row.iconPath" class="img-responsive">
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.sortOrder')" prop="sortOrder"/>
      <el-table-column :label="$t('common.actions')" align="center" min-width="40">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('item.manage')" :title="$t('common.delete')" type="danger" size="mini" icon="el-icon-delete" @click="removeItemImage(scope.row.id)"/>
        </template>
      </el-table-column>
    </el-form-item>
    <el-form-item :label="$t('common.icon')" prop="iconPath">
      <span class="item-picture" style="margin-left: 10px;">
        <br>
        <br>
        <el-button :loading="loading" type="primary" icon="upload" size="small" style="float: right; margin-left: 10px" @click="imagecropperShow=true">{{ $t('common.upload_image') }}</el-button>

        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="imageUploadPath"
          field="icon"
          lang-type="en"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </span>
      <span v-if="imagesForm.iconPath" class="item-picture" style="margin-left: 10px;">
        <img :src="imagesForm.iconPath" class="img-responsive">
        <br>
        <br>
        <el-button :loading="loading" type="primary" icon="upload" size="small" style="float: right; margin-left: 10px" @click.native.prevent="deleteImage">{{ $t('common.delete_image') }}</el-button>
      </span>
    </el-form-item>
    <br>
    <el-form-item>
      <el-button type="primary" size="small" style="float: right; margin-left: 10px" @click.native.prevent="backToList">{{ $t('common.back') }}</el-button>
      <el-button type="success" size="small" style="float: right; margin-left: 10px" @click="save()">{{ $t('common.save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getImages, deleteImage } from '@/api/item';

const defaultForm = {
  itemId: 0,
  images: []
};

export default {
  name: 'ItemImages',
  data() {
    return {
      imagesForm: Object.assign({}, defaultForm),
      loading: false,
      images: []
    };
  },
  methods: {
    loadItemImages(itemId) {
      this.itemId = itemId;
      getImages(itemId).then(response => {
        this.images = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    removeItemImage(id) {
      this.$confirm(this.$t('item.image_delete_confirm'), 'Warning', {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        deleteImage(this.itemId, id).then(response => {
          this.loadItemImages(this.itemId);
        });
      });
    },
    save() {
      this.loading = true;
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
      this.$router.push('/items/list');
    }
  }
};
</script>
