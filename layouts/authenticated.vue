
<template>
  <a-layout id="auth-view">
    <a-layout-sider style="background: #fff; padding: 0">
      <img src="@/assets/logo.png" class="header-logo" alt="logo" />
      <a-menu theme="light" mode="inline" :default-selected-keys="['1']">
        <a-menu-item key="1" @click="$router.push('/subject')">
          <a-icon type="copy" />
          <span>サブジェクト</span>
        </a-menu-item>
        <a-menu-item key="2" @click="$router.push('/account')">
          <a-icon type="user" />
          <span>アカウント情報</span>
        </a-menu-item>
        <a-menu-item key="3" @click="logoutLogic">
          <a-icon type="logout" />
          <span>ログアウト</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content
        v-if="$cookies.get('teacherAccessToken')"
        id="main-content"
      >
        <Nuxt />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  beforeCreate() {
    if (!this.$cookies.get("teacherAccessToken")) {
      this.$router.push("/auth/login");
      this.$message.info("ログインが必要です");
    }
  },
  methods: {
    logoutLogic() {
      this.$confirm({
        title: "ログアウトしてよろしいでしょうか?",
        content: "ログイン情報がパソコンから削除されます。",
        okText: "はい",
        cancelText: "いいえ",
        onOk: () => {
          this.$cookies.set("teacherAccessToken", null);
          this.$router.push("/auth/login");
        },
      });
    },
  },
};
</script>

<style>
#auth-view {
  height: 100vh;
}
.header-logo {
  height: 32px;
  margin: 16px 32px;
}
#auth-view .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#auth-view .trigger:hover {
  color: #1890ff;
}

html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  height: 100vh;
}

body {
  background-color: #f0f2f5;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

#main-content {
  margin: 24px 16px;
  padding: 24px 24px;
  background: #fff;
  min-height: 280px;
  overflow-y: scroll;
}
</style>



