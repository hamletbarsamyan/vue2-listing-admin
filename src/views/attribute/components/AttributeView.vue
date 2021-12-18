<template>
  <el-form ref="attributeForm" :model="attributeForm" class="form-container">
    <div class="item-info item-info-striped">
      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.name') }} </div>
        <div class="item-info-value">
          <span>{{ attributeForm.name }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('attribute.type') }} </div>
        <div class="item-info-value">
          <span>{{ attributeForm.attributeType }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.description') }} </div>
        <div class="item-info-value">
          <span>{{ attributeForm.description }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('attribute.extraInfo') }} </div>
        <div class="item-info-value">
          <span>{{ attributeForm.extraInfo }}</span>
        </div>
      </div>
      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('attribute.values') }} </div>
        <div class="item-info-value">
          <span v-for="attributeValue in attributeForm.attributeValues" :key="attributeValue.id">
            {{ attributeValue.value }} {{ attributeValue.valueTr }}<br>
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
import { getAttribute } from '@/api/attribute';

export default {
  name: 'AttributeView',
  data() {
    return {
      attributeForm: {},
      loading: false
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.fetchData(id);
  },
  methods: {
    fetchData(id) {
      getAttribute(id).then(response => {
        this.attributeForm = response.data.data;
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
      this.$router.push('/attributes/list');
    }
  }
};
</script>
