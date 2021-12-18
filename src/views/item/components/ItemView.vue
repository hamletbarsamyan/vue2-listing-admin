<template>
  <el-form ref="itemForm" :model="itemForm" class="form-container">
    <span v-if="itemForm.iconPath" class="item-picture" style="margin-left: 10px;">
      <img :src="itemForm.iconPath" class="img-responsive">
    </span>
    <br>
    <br>
    <div class="item-info item-info-striped">
      <div class="item-info-name"> {{ $t('category.category') }} </div>
      <div class="item-info-value">
        <span v-for="parent in itemForm.parentCategories" :key="parent">
          {{ parent }}  >
        </span>
        {{ itemForm.category }}
      </div>
      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('item.listing_type') }} </div>
        <div class="item-info-value">
          <span>{{ $t('item.listing_type_' + itemForm.listingType) }}</span>
        </div>
      </div>
      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.name') }} </div>
        <div class="item-info-value">
          <span>{{ itemForm.name }}</span>
        </div>
      </div>
      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.price') }} </div>
        <div class="item-info-value">
          <span>{{ itemForm.price }}</span><span>{{ itemForm.currency }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('item.inv_count') }} </div>
        <div class="item-info-value">
          <span>{{ itemForm.invCount }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('item.upc') }} </div>
        <div class="item-info-value">
          <span>{{ itemForm.upc }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('item.sku') }} </div>
        <div class="item-info-value">
          <span>{{ itemForm.sku }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('item.status') }} </div>
        <div class="item-info-value">
          <i v-if="itemForm.active" class="active-icon el-icon-check"/>
          <i v-if="!itemForm.active" class="in-active-icon el-icon-close"/>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.description') }} </div>
        <div class="item-info-value">
          <span>{{ itemForm.description }}</span>
        </div>
      </div>

      <div v-if="itemForm.attributes.length > 0" class="item-info-row">
        <div class="item-info-name"> {{ $t('attribute.attributes') }} </div>
        <div class="item-info-value">
          <span v-for="attribute in itemForm.attributes" :key="attribute.id">
            {{ attribute.name }} - {{ attribute.value }} {{ attribute.extraInfo }}<br>
          </span>
        </div>
      </div>
    </div>
    <br>
    <el-button type="primary" size="small" style="float: right; margin-right: 10px;" @click.native.prevent="backToList">{{ $t('common.back') }}</el-button>
    <br>
  </el-form>
</template>

<script>
import { getItem } from '@/api/item';

const defaultForm = {
  id: 0,
  listingType: '1',
  attributes: []
};

export default {
  name: 'ItemView',
  data() {
    return {
      itemForm: Object.assign({}, defaultForm),
      loading: false
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.fetchData(id);
  },
  methods: {
    fetchData(id) {
      getItem(id).then(response => {
        this.itemForm = response.data.data;
      }).catch(err => {
        console.log(err);
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
