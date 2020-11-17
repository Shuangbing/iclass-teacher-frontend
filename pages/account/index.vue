<template>
  <div>
    <a-page-header title="アカウント情報"> </a-page-header>
    <a-row type="flex" justify="center" align="top">
      <a-col :span="12">
        <a-card id="profile">
          <a-form-model>
            <a-form-model-item label="氏名">
              <p>{{ profileData.firstName }} {{ profileData.lastName }}</p>
            </a-form-model-item>
            <a-form-model-item label="メールアドレス">
              <p>{{ profileData.email }}</p>
            </a-form-model-item>
            <a-form-model-item>
              <a-button type="primary"> パスワード変更 </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  layout: "authenticated",
  async asyncData({ $axios }) {
    const { data } = await $axios.get("/user/profile");
    return { profileData: data };
  },
};
</script>

<style>
</style>