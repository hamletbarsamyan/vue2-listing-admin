<template>
  <el-form ref="roleForm" :model="roleForm" class="form-container">
    <div class="item-info item-info-striped">
      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.name') }} </div>
        <div class="item-info-value">
          <span>{{ roleForm.name }}</span>
        </div>
      </div>
      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('role.defaultRole') }} </div>
        <div class="item-info-value">
          <i v-if="roleForm.defaultRole" class="active-icon el-icon-check"/>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.description') }} </div>
        <div class="item-info-value">
          <span>{{ roleForm.description }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('role.permissions') }} </div>
        <div class="item-info-value">
          <ul>
            <li v-for="permission in roleForm.permissions" :key="permission">{{ permission }}</li>
          </ul>
        </div>
      </div>
    </div>
    <br>
    <el-button type="primary" size="small" style="float: right; margin-right: 10px;" @click.native.prevent="backToList">{{ $t('common.back') }}</el-button>
    <br>
  </el-form>
</template>

<script>
import { getRoleInfo } from '@/api/role';

export default {
  name: 'RoleView',
  data() {
    return {
      roleForm: {},
      loading: false
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.fetchData(id);
  },
  methods: {
    fetchData(id) {
      getRoleInfo(id).then(response => {
        this.roleForm = response.data.data;
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
      this.$router.push('/roles/list');
    }
  }
};
</script>

