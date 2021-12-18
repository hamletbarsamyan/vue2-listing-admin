<template>
  <el-tabs style="margin: 20px 20px 20px 20px;" @tab-click="handleTabChange">
    <el-tab-pane :label="$t('attribute.details')">
      <el-form ref="attributeForm" :model="attributeForm" :rules="rules" class="form-container" auto-complete="of">
        <el-form-item :label="$t('attribute.type')" required prop="attributeType">
          <el-select v-model="attributeForm.attributeType">
            <el-option v-for="attrType in attributeTypes" :key="attrType" :label="attrType" :value="attrType"/>
          </el-select>
        </el-form-item>

        <el-tabs type="border-card">
          <el-tab-pane v-for="translation in attributeForm.translations" :key="translation.locale" :set="language=getLanguageName(translation.locale)">
            <span slot="label"><img :src="getFlag(translation.locale)"> {{ language }}</span>
            <div class="text item">
              <el-form-item :label="$t('common.name')" required>
                <el-input v-model="translation.name" :maxlength="255" type="text"/>
              </el-form-item>

              <el-form-item :label="$t('common.description')" prop="description">
                <el-input v-model="translation.description" :maxlength="255" type="text"/>
              </el-form-item>

              <el-form-item :label="$t('attribute.extraInfo')" prop="extraInfo">
                <el-input v-model="translation.extraInfo" :maxlength="100" type="text"/>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
        <br>
        <el-form-item>
          <el-button type="primary" size="small" style="float: right; margin-left: 10px" @click.native.prevent="backToList">{{ $t('common.back') }}</el-button>
          <el-button :loading="loading" type="success" size="small" style="float: right; margin-left: 10px" @click.native.prevent="saveAttribute">{{ $t('common.save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane v-if="!attributeForm.create && attributeForm.attributeType == 'LIST'" :label="$t('attribute.values')" name="attributeValuesTab">
      <attribute-values ref="attributeValues"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getAttributeTypes, getAttributeManageData, saveAttribute } from '@/api/attribute';
import { getLanguageNameMap } from '@/api/language';
import { getLanguageIconMap } from '@/utils/language';
import AttributeValues from './AttributeValues.vue';

const defaultForm = {
  id: 0,
  attrType: '',
  create: true
};

export default {
  name: 'AttributeDetail',
  components: { 'attributeValues': AttributeValues },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      attributeForm: Object.assign({}, defaultForm),
      loading: false,
      attributeTypes: [],
      languageNameMap: [],
      languageIconMap: [],
      rules: {
        attrType: [{ required: true, message: this.$t('attribute.type') + ' ' + this.$t('common.is_required'), trigger: 'change' }]
      }
    };
  },
  created() {
    this.languageIconMap = getLanguageIconMap();
    this.fetchAllAttributeTypes();
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
      if (tab.name === 'attributeValuesTab') {
        console.log('attributeId' + this.id);
        this.$refs.attributeValues.loadAttributeValuesData(this.id);
      }
    },
    getFlag(locale) {
      return this.languageIconMap[locale];
    },
    fetchData(id) {
      getAttributeManageData(id).then(response => {
        this.attributeForm = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    fetchAllAttributeTypes() {
      getAttributeTypes().then(response => {
        this.attributeTypes = response.data.data;
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
    saveAttribute() {
      this.$refs.attributeForm.validate(valid => {
        if (valid) {
          this.loading = true;
          saveAttribute(this.attributeForm).then(res => {
            const appResp = res.data;
            if (appResp.error === true) {
              this.$message({
                message: appResp.data,
                type: 'error'
              });
            } else {
              const successMsgKey = this.isEdit ? 'attribute.update_success' : 'attribute.create_success';
              this.$message.success(this.$t(successMsgKey));
              const route = this.generateRoute();
              if (route) {
                this.$store.dispatch('delView', route);
              }
              this.$router.push({ name: 'AttributeList', params: { reload: true }});
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
      this.$router.push('/attributes/list');
    },
    getLanguageName(locale) {
      return this.languageNameMap[locale];
    }
  }
};
</script>
