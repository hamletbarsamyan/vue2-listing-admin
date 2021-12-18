<template>
  <el-tabs style="margin: 20px 20px 20px 20px;" @tab-click="handleTabChange">
    <el-tab-pane :label="$t('item.details')">
      <el-form ref="itemForm" :model="itemForm" :rules="rules" label-width="120px" class="form-container" auto-complete="of">
        <el-form-item :label="$t('category.category')" required prop="categoryId">
          <el-select v-model="itemForm.categoryId">
            <el-option v-for="category in categoryItems" :key="category.id" :label="category.name" :value="category.id">
              <span v-if="category.parentId > 0"> - </span>
              <span>{{ category.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('item.listing_type')" required prop="listingType">
          <el-select v-model="itemForm.listingType">
            <el-option v-for="listingType in listingTypes" :key="listingType" :label="$t('item.listing_type_' + listingType)" :value="listingType">
              <span>{{ $t('item.listing_type_' + listingType) }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('common.price')" prop="price">
          <el-col :span="8">
            <el-input v-model="itemForm.price" :maxlength="20" type="text"/>
          </el-col>
          <el-col :span="12">
            <el-select v-model="itemForm.currency" :placeholder="$t('common.currency')">
              <el-option v-for="currency in currencies" :key="currency.code" :label="currency.name" :value="currency.code"/>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item :label="$t('item.purchase_price')" prop="price">
          <el-col :span="8">
            <el-input v-model="itemForm.purchasePrice" :maxlength="20" type="text"/>
          </el-col>
          <el-col :span="12">
            <el-select v-model="itemForm.purchaseCurrency" :placeholder="$t('item.purchase_currency')">
              <el-option v-for="currency in currencies" :key="currency.code" :label="currency.name" :value="currency.code"/>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item :label="$t('item.inv_count')" prop="price">
          <el-input v-model="itemForm.invCount" type="text"/>
        </el-form-item>

        <el-form-item :label="$t('item.upc')" prop="price">
          <el-input v-model="itemForm.upc" type="text"/>
        </el-form-item>

        <el-form-item :label="$t('item.sku')">
          <el-input v-model="itemForm.sku" type="text"/>
        </el-form-item>

        <el-form-item :label="$t('item.status')">
          <el-switch v-model="itemForm.active"/>
        </el-form-item>

        <el-form-item v-if="!itemForm.create" :label="$t('common.created_at')">
          <span>{{ unix2CurrentTime(itemForm.createdAt) }}</span>
        </el-form-item>

        <el-form-item v-if="!itemForm.create" :label="$t('common.changed_at')">
          <span>{{ unix2CurrentTime(itemForm.changedAt) }}</span>
        </el-form-item>

        <el-tabs type="border-card">
          <el-tab-pane v-for="translation in itemForm.translations" :key="translation.locale" :set="language=getLanguageName(translation.locale)">
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
          <el-button :loading="loading" type="success" size="small" style="float: right; margin-left: 10px" @click.native.prevent="saveItem">{{ $t('common.save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane v-if="!itemForm.create" :label="$t('attribute.attributes')" name="itemAttributesTab">
      <item-attributes ref="itemAttributes" />
    </el-tab-pane>
    <el-tab-pane v-if="!itemForm.create" :label="$t('item.images')" name="itemImagesTab">
      <item-images ref="itemImages" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { lookupCategories } from '@/api/category';
import { getListingTypes, getItemManageData, saveItem } from '@/api/item';
import { getCurrencies } from '@/api/currency';
import { getLanguageNameMap } from '@/api/language';
import { getLanguageIconMap } from '@/utils/language';
import { unix2CurrentTime } from '@/utils';
import ItemAttributes from './ItemAttributes.vue';
import ItemImages from './ItemImages.vue';

const defaultForm = {
  id: 0,
  categoryId: '',
  listingType: '',
  create: true
};

export default {
  name: 'ItemDetail',
  components: { 'itemAttributes': ItemAttributes, 'itemImages': ItemImages },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      itemForm: Object.assign({}, defaultForm),
      loading: false,
      categoryItems: [],
      listingTypes: [],
      currencies: [],
      languageNameMap: [],
      languageIconMap: [],
      rules: {
        categoryId: [{ required: true, message: this.$t('category.category') + ' ' + this.$t('common.is_required'), trigger: 'change' }],
        listingType: [{ required: true, message: this.$t('item.listing_type') + ' ' + this.$t('common.is_required'), trigger: 'change' }]
      }
    };
  },
  created() {
    this.fetchCategoryItems();
    this.fetchListingTypes();
    this.fetchCurrencies();
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
      if (tab.name === 'itemAttributesTab') {
        this.$refs.itemAttributes.loadItemAttributes(this.id);
      } else if (tab.name === 'itemImagesTab') {
        this.$refs.itemImages.loadItemImages(this.id);
      }
    },
    unix2CurrentTime,
    getFlag(locale) {
      return this.languageIconMap[locale];
    },
    fetchData(id) {
      getItemManageData(id).then(response => {
        this.itemForm = response.data.data;
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
    fetchCategoryItems() {
      lookupCategories().then(response => {
        this.categoryItems = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    fetchListingTypes() {
      getListingTypes().then(response => {
        this.listingTypes = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    fetchCurrencies() {
      getCurrencies().then(response => {
        this.currencies = response.data.data;
      }).catch(err => {
        console.log(err);
      });
    },
    saveItem() {
      this.$refs.itemForm.validate(valid => {
        if (valid) {
          if (this.itemForm.categoryId === 0) {
            this.$message({
              message: this.$t('category.category') + ' ' + this.$t('common.is_required'),
              type: 'error'
            });
            return;
          }
          if (this.itemForm.listingType === 0) {
            this.$message({
              message: this.$t('item.listing_type') + ' ' + this.$t('common.is_required'),
              type: 'error'
            });
            return;
          }
          this.loading = true;
          saveItem(this.itemForm).then(res => {
            const appResp = res.data;
            if (appResp.error === true) {
              this.$message({
                message: appResp.data,
                type: 'error'
              });
            } else {
              const successMsgKey = this.isEdit ? 'item.update_success' : 'item.create_success';
              this.$message.success(this.$t(successMsgKey));
              const route = this.generateRoute();
              if (route) {
                this.$store.dispatch('delView', route);
              }
              this.$router.push({ name: 'ItemList', params: { reload: true }});
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
      this.$router.push('/items/list');
    },
    getLanguageName(locale) {
      return this.languageNameMap[locale];
    }
  }
};
</script>
