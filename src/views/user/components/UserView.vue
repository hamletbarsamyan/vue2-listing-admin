<template>
  <el-form ref="userForm" :model="userForm" class="form-container">
    <span v-if="userForm.iconPath" class="item-picture" style="margin-left: 10px;">
      <img :src="userForm.iconPath" class="img-responsive">
    </span>
    <br>
    <br>
    <div class="item-info item-info-striped">
      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('user.login') }} </div>
        <div class="item-info-value">
          <span>{{ userForm.login }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('user.full_name') }} </div>
        <div class="item-info-value">
          <span>{{ userForm.fullName }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('user.email') }} </div>
        <div class="item-info-value">
          <span>{{ userForm.email }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('user.zip') }} </div>
        <div class="item-info-value">
          <span>{{ userForm.zip }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('user.role') }} </div>
        <div class="item-info-value">
          <span>{{ userForm.role }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('user.enabled') }} </div>
        <div class="item-info-value">
          <i v-if="userForm.enabled" class="active-icon el-icon-check"/>
          <i v-if="!userForm.enabled" class="in-active-icon el-icon-close"/>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('common.created_at') }} </div>
        <div class="item-info-value">
          <span>{{ unix2CurrentTime(userForm.createdAt) }}</span>
        </div>
      </div>

      <div class="item-info-row">
        <div class="item-info-name"> {{ $t('user.last_login') }} </div>
        <div class="item-info-value">
          <span>{{ unix2CurrentTime(userForm.lastLogin) }}</span>
        </div>
      </div>
    </div>
    <br>
    <el-button type="primary" size="small" style="float: right; margin-right: 10px;" @click.native.prevent="backToList">{{ $t('common.back') }}</el-button>
    <br>
  </el-form>
</template>

<script>
import { getUserView } from '@/api/user';
import { unix2CurrentTime } from '@/utils';

export default {
  name: 'UserView',
  data() {
    return {
      userForm: {},
      loading: false
    };
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.fetchData(id);
  },
  methods: {
    unix2CurrentTime,
    fetchData(id) {
      getUserView(id).then(response => {
        this.userForm = response.data.data;
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
      this.$router.push('/users/list');
    }
  }
};
</script>
