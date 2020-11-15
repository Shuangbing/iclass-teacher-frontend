<template>
  <div>
    <a-page-header
      title="参加メンバー"
      sub-title="サブジェクトのメンバー"
      @back="$router.go(-1)"
    >
    </a-page-header>
    <a-row type="flex" justify="space-around">
      <a-col :span="12">
        <div id="spin-waitting">
          <a-spin />
        </div>
        <div>
          <a-list
            id="list-waitting-members"
            item-layout="horizontal"
            :data-source="waittingMember"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta :description="item.memberCode">
                <a-avatar
                  slot="avatar"
                  style="backgroundcolor: #87d068"
                  icon="user"
                />
                <a slot="title">{{ item.name }}</a>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </div>
      </a-col>
      <a-col :span="10">
        <a-form-model>
          <a-form-model-item>
            <a-statistic
              title="グルーピング待ち人数"
              :value="waittingMember.length"
              style="margin-right: 50px"
            >
              <template #suffix>
                <a-icon type="user" />
              </template>
            </a-statistic>
          </a-form-model-item>
          <a-form-model-item label="グループ人数">
            <a-input v-model="amount" :min="2" :max="9" />
            <a-slider v-model="amount" :min="2" :max="9" />
            <p>{{ amount }}人に１グループを編成します。</p>
            <p>
              合計{{
                waittingMember.length % amount == 0
                  ? waittingMember.length / amount
                  : parseInt(waittingMember.length / amount) + 1
              }}グループが作成されます。
            </p>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="grouping"> グルーピング </a-button>
          </a-form-model-item>
        </a-form-model>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  layout: "authenticated",
  data() {
    return {
      waittingMember: [],
      waittingInterval: null,
      subjectId: null,
      amount: 2,
    };
  },
  mounted() {
    this.subjectId = this.$nuxt.$route.params.subjectId;
    this.refreshWaittingMember();
    this.waittingInterval = setInterval(async () => {
      await this.refreshWaittingMember();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.waittingInterval);
  },
  methods: {
    async refreshWaittingMember() {
      const members = await this.$nuxt.$axios
        .get(`/subject/${this.subjectId}/member/waitting`)
        .then(async (result) => {
          this.waittingMember = result.data;
        });
    },
    getGroupCount() {
      if (this.waittingMember % this.amount == 0) {
        return this.waittingMember / this.amount;
      } else {
        return Number(this.waittingMember / this.amount) + 1;
      }
    },
    async grouping() {
      await this.$nuxt.$axios
        .post(`/subject/${this.subjectId}/group`, { amount: this.amount })
        .then(async (result) => {
          console.log(result);
          this.$nuxt.$router.push(`/subject/${this.subjectId}/group`);
        });
    },
  },
};
</script>

<style>
#list-waitting-members {
  overflow-y: scroll;
  height: 70vh;
}
#spin-waitting {
  text-align: center;
}
</style>