<template>
  <div>
    <a-page-header title="グループ" @back="$router.go(-1)">
      <template slot="extra">
        <a-button type="danger" @click="resetGroup">
          グループリセット
        </a-button>
      </template>
    </a-page-header>
    <a-table :columns="columns" :data-source="groupData" :locale="locale">
      <span slot="members" slot-scope="members">
        <a-tag v-for="member in members" :key="member.id" color="blue">
          {{ member.name }}
        </a-tag>
      </span>
    </a-table>
  </div>
</template>
<script>
const columns = [
  {
    title: "グループ名",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "識別コード",
    dataIndex: "groupCode",
    key: "groupCode",
  },
  {
    title: "メンバー",
    dataIndex: "members",
    key: "members",
    scopedSlots: { customRender: "members" },
  },
];

export default {
  layout: "authenticated",
  mounted() {
    this.subjectId = this.$nuxt.$route.params.subjectId;
  },
  async asyncData({ $axios, params }) {
    const { data } = await $axios.get(`/subject/${params.subjectId}/group`);
    return { groupData: data };
  },
  methods: {
    resetGroup() {
      this.$confirm({
        title: "このサブジェクトのグループをリセットしますか?",
        content: "グループ内の共有ファイルが全て削除されます。",
        okText: "はい",
        okType: "danger",
        cancelText: "いいえ",
        onOk: () => {
          this.$axios.delete(`/subject/${this.subjectId}/group`).then(() => {
            this.$nuxt.$router.push("member");
          });
        },
      });
    },
  },
  data() {
    return {
      subjectId: null,
      columns,
      locale: {
        emptyText: "グループがありません",
      },
    };
  },
};
</script>