<template>
  <el-form ref="attributesForm" :model="attributesForm" class="form-container90" auto-complete="of">
    <span style="font-weight: bold;">{{ attributesForm.name }}</span>
    <el-button v-if="hasPermission('attribute.manage')" type="success" size="small" style="float: right;" icon="el-icon-plus" @click="handleCreate">{{ $t('common.add') }}</el-button>
    <br>
    <br>
    <br>
    <div class="container-table100">
      <div class="wrap-table100">
        <div class="custom-table">
          <div class="custom-row custom-header">
            <div class="custom-cell">
              {{ $t('attribute.attribute') }}
            </div>
            <div class="custom-cell">
              {{ $t('common.description') }}
            </div>
            <div class="custom-cell">
              {{ $t('attribute.type') }}
            </div>
            <div class="custom-cell">
              {{ $t('category.parent') }}
            </div>
            <div class="custom-cell">
              {{ $t('common.description') }}
            </div>
            <div class="custom-cell">
              {{ $t('common.sortOrder') }}
            </div>
            <div class="custom-cell">
              {{ $t('common.actions') }}
            </div>
          </div>
          <div v-for="attr in attributesForm.attributes" :key="attr.name" class="custom-row">
            <div :data-title="$t('attribute.attribute')" class="custom-cell">
              <template v-if="attr.edit">
                <el-select v-model="attr.attributeId" @change="attributeChanged(attr)">
                  <el-option v-for="attrItem in attributeItems" :key="attrItem.id" :label="attrItem.name" :value="attrItem.id" size="small">
                    <span style="float: left">{{ attrItem.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ attrItem.description }}</span>
                  </el-option>
                </el-select>
              </template>
              <span v-else>{{ attr.name }}</span>
            </div>

            <div :data-title="$t('common.description')" class="custom-cell">
              <span>{{ attr.description }}</span>
            </div>

            <div :data-title="$t('attribute.type')" class="custom-cell">
              <span>{{ attr.attrType }}</span>
            </div>

            <div :data-title="$t('common.parent')" class="custom-cell">
              <template v-if="attr.edit">
                <el-select v-model="attr.parentId">
                  <el-option label="" value="" size="small"/>
                  <el-option v-for="attrItem in attributeItems" :key="attrItem.id" :label="attrItem.name" :value="attrItem.id" size="small"/>
                </el-select>
              </template>
              <span v-else>{{ attr.parent }}</span>
            </div>

            <div :data-title="$t('common.description')" class="custom-cell">
              <span>{{ attr.parentDescription }}</span>
            </div>

            <div :data-title="$t('common.sortOrder')" class="custom-cell">
              <template v-if="attr.edit">
                <el-input v-model="attr.sortOrder" class="edit-input" size="small" />
              </template>
              <span v-else>{{ attr.sortOrder }}</span>
            </div>
            <div class="custom-cell" style="width: 120px">
              <el-button v-if="attr.edit" type="success" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-circle-check-outline" @click="confirmEdit(attr)"/>
              <el-button v-if="attr.edit" class="cancel-btn" size="mini" icon="el-icon-circle-close" type="warning" @click="cancelEdit(attr)"/>
              <template v-if="hasPermission('attribute.manage') && !attr.edit">
                <el-button :title="$t('common.edit')" type="success" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-edit-outline" @click="handleEdit(attr)"/>
                <el-button :title="$t('common.delete')" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(attr)"/>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <br>
    <el-form-item>
      <el-button type="primary" size="small" style="float: right; margin-left: 10px" @click.native.prevent="backToList">{{ $t('common.back') }}</el-button>
      <el-button type="success" size="small" style="float: right; margin-left: 10px" @click="saveAll()">{{ $t('common.saveAll') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAttributes, saveAllAttributes } from '@/api/category';
import { lookupAttributes } from '@/api/attribute';

const defaultForm = {
  id: 0,
  name,
  attributes: []
};

export default {
  name: 'CategoryAttributes',
  data() {
    return {
      attributesForm: Object.assign({}, defaultForm),
      loading: false,
      attributeItems: [],
      tempAttributes: new Map(),
      attributes: []
    };
  },
  methods: {
    loadCategoryAttributes(categoryId) {
      this.fetchAllAttributeItems();
      this.id = categoryId;
      this.fetchCategoryAttributes(this.id);
    },
    fetchAllAttributeItems() {
      lookupAttributes().then(response => {
        this.attributeItems = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    fetchCategoryAttributes(categoryId) {
      getAttributes(categoryId).then(response => {
        this.attributesForm = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    createNewAttribute() {
      const attribute = {
        id: 0,
        edit: true,
        sortOrder: 0
      };

      return attribute;
    },
    handleCreate() {
      const attribute = this.createNewAttribute();
      this.attributesForm.attributes.push(attribute);
    },
    handleEdit(attribute) {
      attribute.edit = !attribute.edit;
      this.tempAttributes.set(attribute.id, Object.assign({}, attribute));
    },
    handleDelete(attribute) {
      this.$confirm(this.$t('attribute.delete_confirm'), 'Warning', {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        this.tempAttributes.set(attribute.id, Object.assign({}, {}));
        this.attributesForm.attributes.splice(this.attributesForm.attributes.indexOf(attribute), 1);
      });
    },
    cancelEdit(attribute) {
      attribute.edit = false;
      attribute = Object.assign({}, this.tempAttributes.get(attribute.id));
      this.tempAttributes.set(attribute.id, Object.assign({}, {}));
    },
    confirmEdit(attribute) {
      attribute.edit = false;
      this.tempAttributes.set(attribute.id, Object.assign({}, {}));
    },
    attributeChanged(attr) {
      const attributeId = attr.attributeId;
      for (var i = 0; i < this.attributeItems.length; i++) {
        const attributeItem = this.attributeItems[i];

        if (attributeItem.id === attributeId) {
          attr.name = attributeItem.name;
          break;
        }
      }
    },
    saveAll() {
      this.loading = true;
      for (var i = 0; i < this.attributesForm.attributes.length; i++) {
        const attribute = this.attributesForm.attributes[i];

        if (attribute.attributeId === undefined || attribute.attributeId === 0) {
          this.$message.error(this.$t('category.select_attribute'));
          return;
        }
      }

      saveAllAttributes(this.id, this.attributesForm.attributes).then(res => {
        const appResp = res.data;
        if (appResp.error === true) {
          this.$message({
            message: appResp.data,
            type: 'error'
          });
        } else {
          this.$message.success(this.$t('category.attributes_save_success'));
          this.attributesForm.attributes = appResp.data;
        }
        this.loading = false;
      }).catch(err => {
        console.log(err);
        this.loading = false;
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
      this.$router.push('/categories/list/');
    }
  }
};
</script>
