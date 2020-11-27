<template>
  <div>
    <a-page-header title="サブジェクト">
      <template slot="extra">
        <a-button key="1" type="primary" @click="showNewSubject">
          新規作成
        </a-button>
      </template>
    </a-page-header>

    <a-modal
      :title="editMode ? '編集' : '新規作成'"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="editMode ? editSubject() : createSubject()"
      @cancel="visible = false"
      :okText="editMode ? '編集' : '作成'"
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

    <a-table
      :columns="columns"
      :data-source="subjectData"
      rowKey="title"
      :locale="locale"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="generateShareLink(record)">招待リンク</a>
        <a-divider type="vertical" />
        <a @click="$nuxt.$router.push(`/subject/${record.code}/member`)"
          >メンバー</a
        >
        <a-divider type="vertical" />
        <a @click="$nuxt.$router.push(`/subject/${record.code}/group`)"
          >グループ</a
        >
        <a-divider type="vertical" />
        <a @click="showEditSubject(record.code)">編集</a>
        <a-divider type="vertical" />
        <a @click="deleteSubject(record.code)">削除</a>
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
    title: "作成時間",
    dataIndex: "createdAt",
    key: "createdAt",
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
      editMode: false,
      editSubjectCode: null,
      locale: {
        emptyText: "サブジェクトがありません",
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
        content: `https://i.iclass.buzz/subject/${record.code}?p=${record.password}`,
        onOk() {},
      });
    },
    showNewSubject() {
      this.editMode = false;
      this.visible = true;
      this.form.title = "";
      this.form.description = "";
    },
    showEditSubject(subjectCode) {
      this.editMode = true;
      this.visible = true;
      this.editSubjectCode = subjectCode;
      const editSubjectData = this.subjectData.find(
        (subject) => subject.code == subjectCode
      );
      this.form.title = editSubjectData.title;
      this.form.description = editSubjectData.description;
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
    async editSubject() {
      await this.$axios
        .put(`/subject/${this.editSubjectCode}`, {
          title: this.form.title,
          description: this.form.description,
        })
        .then(() => {
          this.subjectData.map((subject) => {
            if (subject.code == this.editSubjectCode) {
              subject.title = this.form.title;
              subject.description = this.form.description;
              return subject;
            }
          });
          this.visible = false;
          this.form.title = "";
          this.form.description = "";
        });
    },
    async deleteSubject(subjectCode) {
      this.$confirm({
        title: "このサブジェクト削除しますか?",
        content:
          "このサブジェクトのグループ、メンバー、共有ファイルが全て削除されます。",
        okText: "はい",
        okType: "danger",
        cancelText: "いいえ",
        onOk: () => {
          this.$axios.delete(`/subject/${subjectCode}`).then(() => {
            this.subjectData = this.subjectData.filter(
              (subject) => subject.code != subjectCode
            );
          });
        },
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