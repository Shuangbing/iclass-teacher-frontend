<template>
  <div>
    <a-page-header title="サブジェクト" sub-title="サブジェクトの管理" Ï>
      <template slot="extra">
        <a-button key="1" type="primary" @click="showNewSubject">
          新規作成
        </a-button>
      </template>
    </a-page-header>

    <a-modal
      title="新規作成"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="createSubject"
      @cancel="visible = false"
      okText="作成"
      cancelText="閉じる"
    >
      <a-form-model :layout="form.layout" :model="form">
        <a-form-model-item label="タイトル">
          <a-input v-model="form.title" placeholder="サブジェクトのタイトル" />
        </a-form-model-item>
        <a-form-model-item label="詳細">
          <a-input
            v-model="form.description"
            placeholder="サブジェクトの詳細"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-table :columns="columns" :data-source="subjectData" rowKey="title">
      <a slot="name" slot-scope="text">{{ text }}</a>
      <span slot="action" slot-scope="text, record">
        <a @click="generateShareLink(record)">招待リンク</a>
        <a-divider type="vertical" />
        <a @click="$nuxt.$router.push(`/subject/${record.code}/member`)"
          >グループ</a
        >
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
      visible: false,
      confirmLoading: false,
      form: {
        layout: "vertical",
        title: "",
        description: "",
      },
    };
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get("/subject");
    return { subjectData: data };
  },
  methods: {
    generateShareLink(record) {
      this.$success({
        title: "招待リンク",
        content: `https://dev--i.iclass.buzz/subject/${record.code}?p=${record.password}`,
        onOk() {},
      });
    },
    showNewSubject() {
      this.visible = true;
    },
    async createSubject() {
      const createSubjectData = {
        title: this.form.title,
        description: this.form.description,
      };
      await this.$axios.post("/subject", createSubjectData).then((result) => {
        this.visible = false;
        this.form.title = "";
        this.form.description = "";
        this.subjectData.push(result.data);
      });
    },
  },
};
</script>

<style>
#subject-manage-view {
  min-width: 800px;
  overflow-x: scroll;
}
</style>