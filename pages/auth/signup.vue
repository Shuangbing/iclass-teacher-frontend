<template>
  <div id="main-login">
    <a-card title="新規登録" :bordered="false">
      <a-input
        v-model="email"
        placeholder="アカウント"
        style="margin-bottom: 1rem"
        name="email"
      >
      </a-input>
      <a-input
        v-model="lastName"
        placeholder="苗字"
        style="margin-bottom: 1rem"
        name="lastname"
      >
      </a-input>
      <a-input
        v-model="firstName"
        placeholder="名前"
        style="margin-bottom: 1rem"
        name="firstname"
      >
      </a-input>
      <a-input
        v-model="password"
        type="password"
        placeholder="パスワード"
        style="margin-bottom: 1rem"
        name="password"
      >
      </a-input>
      <a-input
        v-model="rePassword"
        type="password"
        placeholder="確認パスワード"
        style="margin-bottom: 1rem"
        name="repassword"
      >
      </a-input>
      <a-space>
        <a-button type="primary" @click="registerLogic">新規登録</a-button>
        <a-button @click="$router.push('/auth/login')">ログイン</a-button>
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
      lastName: "",
      firstName: "",
      rePassword: "",
    };
  },
  methods: {
    async registerLogic() {
      const registerData = {
        email: this.email,
        password: this.password,
        lastName: this.lastName,
        firstName: this.firstName,
      };
      await this.$nuxt.$axios
        .post("/auth/signup", registerData)
        .then((result) => {
          this.$message.success("新規登録完了");
          this.$router.push("/auth/login");
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