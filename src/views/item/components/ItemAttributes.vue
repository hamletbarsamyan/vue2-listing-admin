<template>
  <el-form ref="attributesForm" :model="attributesForm" class="form-container90" auto-complete="of">
    <el-form-item v-for="attr in attributesForm.attributes" :label="attr.name" :key="attr.attributeId">
      <el-input v-if="attr.attrType == 'TEXT' || attr.attrType == 'INT' || attr.attrType == 'DOUBLE'" v-model="attr.value" class="edit-input" size="small" style="width: 200px;" />
      <el-input v-if="attr.attrType == 'BOOLEAN'" v-model="attr.value" class="edit-input" size="small" style="width: 200px;" />
      <el-select v-if="attr.attrType == 'LIST'" v-model="attr.value">
        <el-option label="" value="" size="small"/>
        <el-option v-for="attrValue in attributeValueMap[attr.attributeId]" :key="attrValue.id" :label="attrValue.value" :value="attrValue.id" size="small"/>
      </el-select>
      &#160;<span>{{ attr.extraInfo }}</span>
    </el-form-item>
    <br>
    <el-form-item>
      <el-button type="primary" size="small" style="float: right; margin-left: 10px" @click.native.prevent="backToList">{{ $t('common.back') }}</el-button>
      <el-button type="success" size="small" style="float: right; margin-left: 10px" @click="save()">{{ $t('common.save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getAttributes, saveAllAttributes } from '@/api/item';
import { lookupAttributeValues } from '@/api/category';

const defaultForm = {
  id: 0,
  name,
  attributes: []
};

export default {
  name: 'ItemAttributes',
  data() {
    return {
      attributesForm: Object.assign({}, defaultForm),
      loading: false,
      attributeValueMap: [],
      attributes: []
    };
  },
  methods: {
    loadItemAttributes(itemId) {
      this.id = itemId;
      this.fetchItemAttributes(this.id);
    },
    fetchCategoryAttributeValues(categoryId) {
      lookupAttributeValues(categoryId).then(response => {
        this.attributeValueMap = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    fetchItemAttributes(categoryId) {
      getAttributes(categoryId).then(response => {
        this.attributesForm = response.data.data;
        this.fetchCategoryAttributeValues(this.attributesForm.categoryId);
      }).catch(err => {
        console.log(err);
      });
    },
    save() {
      this.loading = true;
      saveAllAttributes(this.id, this.attributesForm.attributes).then(res => {
        const appResp = res.data;
        if (appResp.error === true) {
          this.$message({
            message: appResp.data,
            type: 'error'
          });
        } else {
          this.$message.success(this.$t('item.attributes_save_success'));
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
      this.$router.push('/items/list');
    }
  }
};
</script>
