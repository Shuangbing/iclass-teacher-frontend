<template>
  <div id="main-login">
    <a-card title="ログイン" :bordered="false">
      <a-input
        v-model="email"
        placeholder="アカウント"
        style="margin-bottom: 1rem"
      >
        <a-icon slot="prefix" type="user" />
      </a-input>
      <a-input
        v-model="password"
        type="password"
        placeholder="パスワード"
        style="margin-bottom: 1rem"
      >
        <a-icon slot="prefix" type="key" />
      </a-input>
      <a-space>
        <a-button type="primary" @click="loginLogic">ログイン</a-button>
        <a-button @click="$router.push('/auth/signup')">新規登録</a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async loginLogic() {
      const loginData = {
        email: this.email,
        password: this.password,
      };
      await this.$nuxt.$axios
        .post("/auth/login", loginData)
        .then((result) => {
          this.$cookies.set("teacherAccessToken", result.data.access_token);
          this.$router.push("/subject");
        })
        .catch((error) => {
          this.password = "";
        });
    },
  },
};
</script>

<style>
#main-login {
  background: #ececec;
  height: 100vh;
  padding: 5rem;
}

#main-login .ant-card {
  max-width: 400px;
  margin: 0 auto;
}
</style>