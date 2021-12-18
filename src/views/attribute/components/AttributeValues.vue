<template>
  <el-form ref="attributeValuesForm" :model="attributeValuesForm" class="form-container90" auto-complete="of">
    <span style="font-weight: bold;">{{ attributeValuesForm.name }}</span>
    <el-button v-if="hasPermission('attribute.manage')" type="success" size="small" style="float: right;" icon="el-icon-plus" @click="handleCreate">{{ $t('common.add') }}</el-button>
    <br>
    <br>
    <br>
    <div class="container-table100">
      <div class="wrap-table100">
        <div class="custom-table">
          <div class="custom-row custom-header">
            <div class="custom-cell">
              {{ $t('common.parent') }}
            </div>
            <div class="custom-cell">
              {{ $t('common.defaultValue') }}
            </div>
            <div v-for="(languageName, locale) in languageNameMap" :key="locale" class="custom-cell">
              <img :src="getFlag(locale)"> {{ languageName }}
            </div>
            <div class="custom-cell">
              {{ $t('common.sortOrder') }}
            </div>
            <div class="custom-cell">
              {{ $t('common.actions') }}
            </div>
          </div>

          <div v-for="attrValue in attributeValuesForm.attributeValues" :key="attrValue.hashcode" class="custom-row">
            <div :data-title="$t('common.parent')" class="custom-cell">
              <template v-if="attrValue.edit">
                <el-select v-model="attrValue.parentValueId">
                  <el-option label="" value="" size="small" style="width: 100px"/>
                  <el-option v-for="attrValueItem in attributeValueItems" :key="attrValueItem.id" :label="attrValueItem.valueTr" :value="attrValueItem.id" size="small">
                    <span style="float: left">{{ attrValueItem.defaultValue }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ attrValueItem.valueTr }}</span>
                  </el-option>
                </el-select>
              </template>
              <span v-else>{{ attrValue.parentValueId }}</span>
            </div>

            <div :data-title="$t('common.defaultValue')" class="custom-cell">
              <template v-if="attrValue.edit">
                <el-input v-model="attrValue.value" class="edit-input" size="small" />
              </template>
              <span v-else>{{ attrValue.value }}</span>
            </div>

            <div v-for="translation in attrValue.translations" :key="translation.hashcode" :data-title="translation.locale" class="custom-cell">
              <template v-if="attrValue.edit">
                <el-input v-model="translation.valueTr" class="edit-input" size="small" />
              </template>
              <span v-else>{{ translation.valueTr }}</span>
            </div>
            <div :data-title="$t('common.sortOrder')" class="custom-cell">
              <template v-if="attrValue.edit">
                <el-input v-model="attrValue.sortOrder" class="edit-input" size="small" style="width: 50px" />
              </template>
              <span v-else>{{ attrValue.sortOrder }}</span>
            </div>
            <div class="custom-cell" style="width: 150px">
              <el-button v-if="attrValue.edit" type="success" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-circle-check-outline" @click="confirmEdit(attrValue)"/>
              <el-button v-if="attrValue.edit" class="cancel-btn" size="mini" icon="el-icon-circle-close" type="warning" @click="cancelEdit(attrValue)"/>
              <template v-if="hasPermission('attribute.manage') && !attrValue.edit">
                <el-button :title="$t('common.edit')" type="success" size="mini" style="margin-right: 10px;margin-bottom: 5px" icon="el-icon-edit-outline" @click="handleEdit(attrValue)"/>
                <el-button :title="$t('common.delete')" type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(attrValue)"/>
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
import { getAttrValuesWithTranslations, saveAllAttributes, getAttributeValues } from '@/api/attribute';
import { getLanguageNameMap } from '@/api/language';
import { getLanguageIconMap } from '@/utils/language';

const defaultForm = {
  id: 0,
  name,
  attributeValues: []
};

export default {
  name: 'AttributeValues',
  data() {
    return {
      attributeValuesForm: Object.assign({}, defaultForm),
      loading: false,
      attributeValueItems: [],
      tempAttributeValues: new Map(),
      attributeValues: [],
      languageNameMap: [],
      languageIconMap: []
    };
  },
  methods: {
    loadAttributeValuesData(attributeId) {
      this.languageIconMap = getLanguageIconMap();
      this.id = attributeId;
      this.fetchAttributeValueItems(this.id);
      this.fetchAllAttributeValues(this.id);
      this.fetchLanguageNameMap();
    },
    getFlag(locale) {
      return this.languageIconMap[locale];
    },
    fetchAttributeValueItems(attributeId) {
      getAttributeValues(attributeId).then(response => {
        this.attributeValueItems = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    fetchAllAttributeValues(attributeId) {
      getAttrValuesWithTranslations(attributeId).then(response => {
        this.attributeValuesForm = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    fetchLanguageNameMap() {
      getLanguageNameMap().then(response => {
        this.languageNameMap = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    createNewAttrValue() {
      const translations = [];
      for (const locale in this.languageNameMap) {
        const translation = {};
        translation.locale = locale;
        translations.push(translation);
      }
      const attrValue = {
        id: 0,
        edit: true,
        value: '',
        sortOrder: 0,
        translations: translations
      };

      return attrValue;
    },
    handleCreate() {
      const attrValue = this.createNewAttrValue();
      this.attributeValuesForm.attributeValues.push(attrValue);
    },
    handleEdit(attributeValue) {
      attributeValue.edit = !attributeValue.edit;
      this.tempAttributeValues.set(attributeValue.id, Object.assign({}, attributeValue));
    },
    handleDelete(attributeValue) {
      this.$confirm(this.$t('attribute.value_delete_confirm'), 'Warning', {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        this.tempAttributeValues.set(attributeValue.id, Object.assign({}, {}));
        this.attributeValuesForm.attributeValues.splice(this.attributeValuesForm.attributeValues.indexOf(attributeValue), 1);
      });
    },
    cancelEdit(attributeValue) {
      attributeValue.edit = false;
      attributeValue = Object.assign({}, this.tempAttributeValues.get(attributeValue.id));
      this.tempAttributeValues.set(attributeValue.id, Object.assign({}, {}));
    },
    confirmEdit(attributeValue) {
      attributeValue.edit = false;
      this.tempAttributeValues.set(attributeValue.id, Object.assign({}, {}));
    },
    saveAll() {
      this.loading = true;
      for (var i = 0; i < this.attributeValuesForm.attributeValues.length; i++) {
        const attributeValue = this.attributeValuesForm.attributeValues[i];

        if (attributeValue.value === undefined || attributeValue.value === '') {
          this.$message.error(this.$t('attribute.enter_value'));
          return;
        }
      }

      saveAllAttributes(this.attributeValuesForm.id, this.attributeValuesForm.attributeValues).then(res => {
        const appResp = res.data;
        if (appResp.error === true) {
          this.$message({
            message: appResp.data,
            type: 'error'
          });
        } else {
          this.$message.success(this.$t('attribute.values_save_success'));
          this.attributeValuesForm.attributeValues = appResp.data;
          this.fetchAttributeValueItems(this.attributeValuesForm.id);
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
      this.$router.push('/attributes/list');
    },
    getLanguageName(locale) {
      return this.languageNameMap[locale];
    }
  }
};
</script>
