<template>
  <div>
    <a-page-header
      title="サブジェクト"
      sub-title="サブジェクトの管理"Ï
    >
      <template slot="extra">
        <a-button key="1" type="primary">
          新規作成
        </a-button>
      </template>
    </a-page-header>

    <a-table :columns="columns" :data-source="subjectData">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="action" slot-scope="text, record">
        <a @click="generateShareLink(record)">招待リンク</a>
        <a-divider type="vertical" />
        <a>削除</a>
      </span>
    </a-table>
  </div>
</template>
<script>
const columns = [
  {
    dataIndex: "title",
    title: "タイトル",
    key: "title",
  },
  {
    title: "コード",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  layout: "authenticated",
  data() {
    return {
      columns,
    };
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get(`/subject`);
    return { subjectData: data };
  },
  methods: {
    generateShareLink(record) {
      this.$info({
        title: "招待リンク",
        content: `https://dev--i.iclass.buzz/subject/${record.code}?p=${record.password}`,
        onOk() {},
      });
    },
  },
};
</script>

<style>
</style>