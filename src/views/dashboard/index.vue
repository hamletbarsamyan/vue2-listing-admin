<template>
  <div class="dashboard-container">
    <component :is="currentRole"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import adminDashboard from './admin';
import editorDashboard from './editor';

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    };
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  },
  created() {
    this.currentRole = 'adminDashboard';
    // if (!this.permissions.includes('admin.dashboard')) {
    //   this.currentRole = 'editorDashboard'
    // } else {
    //   this.currentRole = 'adminDashboard'
    // }
  }
};
</script>
