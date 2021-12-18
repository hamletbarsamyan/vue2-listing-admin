<template>
  <el-form ref="userForm" :model="userForm" :rules="rules" :key="componentKey" class="form-container" auto-complete="of">
    <span v-if="!userForm.iconPath" class="item-picture" style="margin-left: 10px;">
      <img src="@/assets/img/profile.jpg">
      <br>
      <br>
      <el-button :loading="loading" type="primary" icon="upload" size="small" style="float: right; margin-left: 10px" @click="imagecropperShow=true">{{ $t('common.upload_image') }}</el-button>

      <image-cropper
        v-show="imagecropperShow"
        :width="300"
        :height="300"
        :key="imagecropperKey"
        :url="imageUploadPath"
        lang-type="en"
        @close="close"
        @crop-upload-success="cropSuccess"/>
    </span>
    <span v-if="userForm.iconPath" class="item-picture" style="margin-left: 10px;">
      <img :src="userForm.iconPath" class="img-responsive">
      <br>
      <br>
      <el-button :loading="loading" type="primary" icon="upload" size="small" style="float: right; margin-left: 10px" @click.native.prevent="deleteImage">{{ $t('common.delete_image') }}</el-button>
    </span>
    <br>
    <br>
    <el-form-item :label="$t('user.login')" required prop="login">
      <el-input v-model="userForm.login" :maxlength="100" type="text"/>
    </el-form-item>

    <el-form-item :label="$t('user.full_name')" prop="fullName">
      <el-input v-model="userForm.fullName" :maxlength="128" type="text"/>
    </el-form-item>

    <el-form-item :label="$t('user.email')" required prop="email">
      <el-input v-model="userForm.email" :maxlength="128" type="text"/>
    </el-form-item>

    <el-form-item :label="$t('user.zip')" prop="zip">
      <el-input v-model="userForm.zip" :maxlength="128" type="text"/>
    </el-form-item>

    <el-form-item :label="$t('common.created_at')">
      <i class="el-icon-time"/>
      <span>{{ unix2CurrentTime(userForm.createdAt) }}</span>
    </el-form-item>

    <el-form-item :label="$t('user.last_login')">
      <i class="el-icon-time"/>
      <span>{{ unix2CurrentTime(userForm.lastLogin) }}</span>
    </el-form-item>

    <el-form-item>
      <el-button :loading="loading" type="warning" size="small" style="float: right; margin-left: 10px" @click.native.prevent="goToChangePassword">{{ $t('user.changePassword') }}</el-button>
      <el-button :loading="loading" type="success" size="small" style="float: right; margin-left: 10px" @click.native.prevent="saveProfile">{{ $t('common.save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { saveProfile, getProfile, deleteImage, getImageUploadPath } from '@/api/profile';
import { unix2CurrentTime } from '@/utils';
import { validateEmail } from '@/utils/validate';
import ImageCropper from '@/components/ImageCropper';

export default {
  name: 'ViewProfile',
  components: { ImageCropper },
  data() {
    const isValidEmail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error(this.$t('common.email_is_invalid')));
      } else {
        callback();
      }
    };
    return {
      userForm: {},
      loading: false,
      rules: {
        login: [{ required: true, message: this.$t('user.login_is_required'), trigger: 'change' }],
        email: [{ required: true, message: this.$t('common.email_is_required'), trigger: 'change', validator: isValidEmail }]
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      componentKey: 0,
      imageUploadPath: getImageUploadPath()
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    unix2CurrentTime,
    fetchData() {
      getProfile().then(response => {
        const appResponseData = response.data.data;
        this.userForm = appResponseData;
      }).catch(err => {
        console.log(err);
      });
    },
    saveProfile() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true;
          saveProfile(this.userForm).then(res => {
            const appResp = res.data;
            if (appResp.error === true) {
              this.$message({
                message: appResp.data,
                type: 'error'
              });
            } else {
              this.$message.success(appResp.data);
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
    goToChangePassword() {
      this.$router.push('/changePassword');
    },
    deleteImage() {
      this.$confirm(this.$t('common.delete_image_confirm'), 'Warning', {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        deleteImage().then(response => {
          const appResp = response.data;
          if (appResp.error === true) {
            this.$message({
              message: appResp.data,
              type: 'error'
            });
          } else {
            this.userForm.iconPath = null;
            this.forceRerender();
          }
        });
      });
    },
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.userForm.iconPath = resData.data;
      this.forceRerender();
    },
    close() {
      this.imagecropperShow = false;
    },
    forceRerender() {
      this.componentKey += 1;
    }
  }
};
</script>
