<template>
  <el-tabs style="margin: 20px 20px 20px 20px;" @tab-click="handleTabChange">
    <el-tab-pane :label="$t('category.details')">
      <el-form ref="categoryForm" :model="categoryForm" :rules="rules" class="form-container" auto-complete="of">
        <el-form-item v-if="!categoryForm.create" :label="$t('common.icon')" prop="iconPath">
          <span v-if="!categoryForm.iconPath" class="item-picture" style="margin-left: 10px;">
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
          <span v-if="categoryForm.iconPath" class="item-picture" style="margin-left: 10px;">
            <img :src="categoryForm.iconPath" class="img-responsive">
            <br>
            <br>
            <el-button :loading="loading" type="primary" icon="upload" size="small" style="float: right; margin-left: 10px" @click.native.prevent="deleteImage">{{ $t('common.delete_image') }}</el-button>
          </span>
        </el-form-item>
        <el-form-item :label="$t('category.parent')" prop="parentId">
          <el-select v-model="categoryForm.parentId">
            <el-option v-for="cat in categoryItems" :key="cat.id" :label="cat.name" :value="cat.id"/>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('category.slug')" required prop="slug">
          <el-input v-model="categoryForm.slug" :maxlength="255" type="text"/>
        </el-form-item>

        <el-form-item :label="$t('common.sortOrder')" prop="sortOrder">
          <el-input v-model="categoryForm.sortOrder" :maxlength="255" type="text"/>
        </el-form-item>

        <el-tabs type="border-card">
          <el-tab-pane v-for="translation in categoryForm.translations" :key="translation.locale" :set="language=getLanguageName(translation.locale)">
            <span slot="label"><img :src="getFlag(translation.locale)"> {{ language }}</span>
            <div class="text item">
              <el-form-item :label="$t('common.name')" required>
                <el-input v-model="translation.name" :maxlength="255" type="text"/>
              </el-form-item>

              <el-form-item :label="$t('common.description')" prop="description">
                <el-input v-model="translation.description" :maxlength="255" type="text"/>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
        <br>
        <el-form-item>
          <el-button type="primary" size="small" style="float: right; margin-left: 10px" @click.native.prevent="backToList">{{ $t('common.back') }}</el-button>
          <el-button :loading="loading" type="success" size="small" style="float: right; margin-left: 10px" @click.native.prevent="saveCategory">{{ $t('common.save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane v-if="!categoryForm.create" :label="$t('attribute.attributes')" name="categoryAttributesTab">
      <category-attributes ref="categoryAttributes"/>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import { lookupCategories, getCategoryManageData, saveCategory, deleteImage, getImageUploadPath } from '@/api/category';
import { getLanguageNameMap } from '@/api/language';
import { getLanguageIconMap } from '@/utils/language';
import ImageCropper from '@/components/ImageCropper';
import CategoryAttributes from './CategoryAttributes.vue';

const defaultForm = {
  id: 0,
  attrType: '',
  create: true
};

export default {
  name: 'CategoryDetail',
  components: { ImageCropper, 'categoryAttributes': CategoryAttributes },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      categoryForm: Object.assign({}, defaultForm),
      loading: false,
      categoryItems: [],
      languageNameMap: [],
      languageIconMap: [],
      rules: {
        slug: [{ required: true, message: this.$t('category.slug') + ' ' + this.$t('common.is_required'), trigger: 'change' }]
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      componentKey: 0,
      imageUploadPath: getImageUploadPath()
    };
  },
  created() {
    this.fetchCategoryItems();
    this.languageIconMap = getLanguageIconMap();
    this.fetchLanguageNameMap();
    if (this.isEdit) {
      this.id = this.$route.params && this.$route.params.id;
      this.fetchData(this.id);
    } else {
      this.fetchData(0);
    }
  },
  methods: {
    handleTabChange(tab, event) {
      if (tab.name === 'categoryAttributesTab') {
        this.$refs.categoryAttributes.loadCategoryAttributes(this.id);
      }
    },
    getFlag(locale) {
      return this.languageIconMap[locale];
    },
    fetchData(id) {
      getCategoryManageData(id).then(response => {
        this.categoryForm = response.data.data;
        this.imageUploadPath = getImageUploadPath(id);
      }).catch(err => {
        console.log(err);
      });
    },
    deleteImage() {
      this.$confirm(this.$t('common.delete_image_confirm'), 'Warning', {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        deleteImage(this.categoryForm.id).then(response => {
          const appResp = response.data;
          if (appResp.error === true) {
            this.$message({
              message: appResp.data,
              type: 'error'
            });
          } else {
            this.categoryForm.iconPath = null;
            this.forceRerender();
          }
        });
      });
    },
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.categoryForm.iconPath = resData.data;
      this.forceRerender();
    },
    close() {
      this.imagecropperShow = false;
    },
    forceRerender() {
      this.componentKey += 1;
    },
    fetchLanguageNameMap() {
      getLanguageNameMap().then(response => {
        this.languageNameMap = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    fetchCategoryItems() {
      lookupCategories().then(response => {
        this.categoryItems = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    saveCategory() {
      this.$refs.categoryForm.validate(valid => {
        if (valid) {
          this.loading = true;
          saveCategory(this.categoryForm).then(res => {
            const appResp = res.data;
            if (appResp.error === true) {
              if (appResp.code === 42) {
                this.$message({
                  message: this.$t('category.enter_unique_slug'),
                  type: 'error'
                });
              } else {
                this.$message({
                  message: appResp.data,
                  type: 'error'
                });
              }
            } else {
              const successMsgKey = this.isEdit ? 'category.update_success' : 'category.create_success';
              this.$message.success(this.$t(successMsgKey));
              const route = this.generateRoute();
              if (route) {
                this.$store.dispatch('delView', route);
              }
              this.$router.push({ name: 'CategoryList', params: { reload: true }});
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
      this.$router.push('/categories/list');
    },
    getLanguageName(locale) {
      return this.languageNameMap[locale];
    }
  }
};
</script>
