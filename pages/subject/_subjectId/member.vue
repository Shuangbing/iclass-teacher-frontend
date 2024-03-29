<template>
  <div>
    <a-page-header
      title="グルーピング"
      sub-title="参加メンバ一覧"
      @back="$router.go(-1)"
    >
    </a-page-header>
    <a-row type="flex" justify="space-around">
      <a-col :span="12">
        <a-progress :percent="percent" status="active" :showInfo="false" />
        <div>
          <a-list
            id="list-waitting-members"
            item-layout="horizontal"
            :data-source="waittingMember"
            :locale="locale"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta :description="item.memberCode">
                <a-avatar
                  slot="avatar"
                  style="backgroundcolor: #87d068"
                  icon="user"
                />
                <a slot="title">
                  <a-checkbox
                    :name="`${item.memberCode}`"
                    :disabled="!!item.group"
                    @change="createGroup"
                  >
                    {{ item.name }}
                  </a-checkbox>
                  <a-tag color="red" v-if="!!item.group"> 編成済 </a-tag>
                </a>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </div>
      </a-col>
      <a-col :span="10">
        <a-form-model>
          <a-form-model-item label="サブジェクト">
            <a-page-header
              :title="subject.title"
              :sub-title="subject.description"
            />
          </a-form-model-item>
          <a-form-model-item>
            <a-statistic
              title="参加人数"
              :value="waittingMember.length"
              style="margin-right: 50px"
            >
              <template #suffix>
                <a-icon type="user" />
              </template>
            </a-statistic>
          </a-form-model-item>
          <a-form-model-item>
            <a-statistic
              title="グルーピング待ち人数"
              :value="waittingMemberWithoutGrouped.length"
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
              合計{{waittingMemberWithoutGrouped.length % amount &lt;= 1
                  ? parseInt(waittingMemberWithoutGrouped.length / amount)
                  : parseInt(waittingMemberWithoutGrouped.length / amount) + 1



              }}グループが作成されます。
            </p>
          </a-form-model-item>
          <a-form-model-item>
            <a-button type="primary" @click="grouping"> グルーピング </a-button>
          </a-form-model-item>
          <a-form-model-item>
            <a-button
              @click="customGrouping"
              :disabled="createGroupMembers.length < 2"
            >
              選択したメンバーでグルーピング
            </a-button>
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
      waittingMemberWithoutGrouped: [],
      waittingInterval: null,
      subjectId: null,
      subject: {},
      amount: 2,
      percent: 0,
      createGroupMembers: [],
      locale: {
        emptyText: "メンバーがいません",
      },
    };
  },
  mounted() {
    this.subjectId = this.$nuxt.$route.params.subjectId;
    this.refreshWaittingMember();
    this.waittingInterval = setInterval(async () => {
      this.percent >= 100
        ? await this.refreshWaittingMember()
        : (this.percent += 20);
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.waittingInterval);
  },
  methods: {
    async refreshWaittingMember() {
      this.percent = 0;
      await this.$nuxt.$axios
        .get(`/subject/${this.subjectId}/member/waitting`)
        .then(async (result) => {
          this.subject = result.data;
          this.waittingMember = this.subject.members;
          this.waittingMemberWithoutGrouped = this.waittingMember.filter(
            (member) => !member.group
          );
        });
    },
    getGroupCount() {
      if (this.waittingMember % this.amount == 0) {
        return this.waittingMember / this.amount;
      } else {
        return Number(this.waittingMember / this.amount) + 1;
      }
    },
    createGroup(e) {
      if (e.target.checked) {
        this.createGroupMembers.push(e.target.name);
      } else {
        this.createGroupMembers = this.createGroupMembers.filter(
          (item) => item != e.target.name
        );
      }
    },
    async grouping() {
      await this.$nuxt.$axios
        .post(`/subject/${this.subjectId}/group`, { amount: this.amount })
        .then(async (result) => {
          this.$nuxt.$router.push(`/subject/${this.subjectId}/group`);
        });
    },
    async customGrouping() {
      await this.$nuxt.$axios
        .post(`/subject/${this.subjectId}/group/custom`, {
          members: this.createGroupMembers,
        })
        .then(async (result) => {
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