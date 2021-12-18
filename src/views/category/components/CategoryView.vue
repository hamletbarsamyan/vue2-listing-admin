<template>
  <el-form ref="categoryForm" :model="categoryForm" class="form-container">
    <span v-if="categoryForm.iconPath" class="item-picture" style="margin-left: 10px;">
      <img :src="categoryForm.iconPath" class="img-responsive">
    </span>
    <br>
    <br>
    <div class="item-info item-info-striped">
      <div v-if="categoryForm.parents.length > 0" class="item-info-row">
        <div class="item-info-name"> {{ $t('category.parent') }} </div>
        <div class="item-info-value">
          <span v-for="parent in categoryForm.parents" :key="parent">
            {{ parent }}  >
          </span>
        </div>
      </div>
      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.name') }} </div>
        <div class="item-info-value">
          <span>{{ categoryForm.name }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('category.slug') }} </div>
        <div class="item-info-value">
          <span>{{ categoryForm.slug }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.sortOrder') }} </div>
        <div class="item-info-value">
          <span>{{ categoryForm.sortOrder }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.description') }} </div>
        <div class="item-info-value">
          <span>{{ categoryForm.description }}</span>
        </div>
      </div>

      <div v-if="categoryForm.attributes.length > 0" class="item-info-row">
        <div class="item-info-name"> {{ $t('attribute.attributes') }} </div>
        <div class="item-info-value">
          <span v-for="attribute in categoryForm.attributes" :key="attribute.id">
            {{ attribute.name }} - {{ attribute.attrType }}<br>
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
import { getCategory } from '@/api/category';

export default {
  name: 'CategoryView',
  data() {
    return {
      categoryForm: {
        parents: [],
        attributes: []
      },
      loading: false
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.fetchData(id);
  },
  methods: {
    fetchData(id) {
      getCategory(id).then(response => {
        this.categoryForm = response.data.data;
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
      this.$router.push('/categories/list');
    }
  }
};
</script>
