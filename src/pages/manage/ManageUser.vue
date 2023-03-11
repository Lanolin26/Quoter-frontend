<template>
  <div>
    <manage-user-table-component
      :loading="loading"
      :page="page"
      :elementOnPage="elementByPage"
      :totalElements="totalElements"
      :users="users"
      @pagination="updateRows"
      @edit="editElement"
      @delete="deleteElement"
      @reload="reload"
      @newItem="newItem"
    />
    <q-dialog v-model="openDialog">
      <q-card-empty v-if="dialogLoading"/>
      <edit-user-card-component
        v-else
        style="width: 700px; max-width: 80vw;"
        :title="editTitle"
        :user="editElementItem"
        @close="closeAndClearDialog"
        @save="saveDialogElement"
        @update="saveDialogElement"
        @delete="deleteDialogElement"
        is-close
        :is-save="editDialog"
        :is-delete="deleteDialog"
        :read-only="deleteDialog"
      />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import ManageUserTableComponent from 'components/manage/ManageUserTableComponent.vue';
import QCardEmpty from 'components/cards/QCardEmpty.vue';
import EditUserCardComponent from 'components/cards/EditUserCardComponent.vue';
import {defineComponent} from 'vue';
import {mapActions} from 'pinia';
import {usePageStore} from 'stores/pages';
import {genNotifyOpts, Pageable} from 'src/types/common';
import {QuoteUser} from 'src/types/domain';

export default defineComponent({
  name: 'ManageUser',
  components: {EditUserCardComponent, QCardEmpty, ManageUserTableComponent},
  computed: {
    editTitle(): string {
      if (this.editDialog) {
        return isNaN(this.editElementItem.id) ? this.$t('quote.edit.create') : this.$t('quote.edit.update');
      }
      if (this.deleteDialog) {
        return this.$t('quote.delete_confirm');
      }
      return 'Unknown';
    }
  },
  data() {
    return {
      editDialog: false,
      deleteDialog: false,
      dialogLoading: false,
      openDialog: false,
      loading: true,
      page: 1,
      totalPage: 1,
      elementByPage: 10,
      totalElements: 0,
      editElementItem: <QuoteUser>{},
      users: <QuoteUser[]>[],
    }
  },
  methods: {
    ...mapActions(usePageStore, ['setTitle']),
    loadUsers() {
      const page: Pageable = {page: this.page - 1, size: this.elementByPage};
      this.loading = true;
      this.$api.quoteUser.getAllPageable(page)
        .then(res => {
          this.users = res.content;
          this.totalPage = res.totalPages;
          this.elementByPage = res.numberOfElements;
          this.page = res.number + 1;
          this.totalElements = res.totalElements;
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Users: ${error}`, 'red')))
        .finally(() => this.loading = false)
    },
    updateRows(props: Pageable) {
      this.page = props.page;
      this.elementByPage = props.size;
      this.loadUsers();
    },
    editElement(id: number) {
      this.dialogLoading = true;
      this.editDialog = true;
      this.openDialog = true;
      this.$api.quoteUser.getOne(id)
        .then(res => {
          this.editElementItem = res
          this.dialogLoading = false;
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Users: ${error}`, 'red')));
    },
    deleteElement(id: number) {
      this.dialogLoading = true;
      this.deleteDialog = true;
      this.openDialog = true;
      this.$api.quoteUser.getOne(id)
        .then(res => {
          this.editElementItem = res
          this.dialogLoading = false;
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Users: ${error}`, 'red')));
    },
    reload() {
      this.loadUsers();
    },
    newItem() {
      this.editElementItem = {id: NaN, name: '', login: '', roles: []};
      this.editDialog = true;
      this.openDialog = true;
    },
    saveDialogElement(element: QuoteUser) {
      if (isNaN(element.id)) {
        this.$api.quoteUser.create(element)
          .then(res => {
            this.$q.notify(genNotifyOpts(`Success save users ${res.id}`, 'green'))
            this.reload();
          })
          .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
          .finally(() => this.closeAndClearDialog());
      } else {
        this.$api.quoteUser.update(element.id, element)
          .then(res => {
            this.$q.notify(genNotifyOpts(`Success update quote ${res.id}`, 'green'))
            this.reload();
          })
          .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
          .finally(() => this.closeAndClearDialog());
      }
    },
    deleteDialogElement(element: QuoteUser) {
      this.$api.quoteUser.deleteItem(element.id)
        .then(() => {
          this.$q.notify(genNotifyOpts('Success delete quote', 'green'))
          this.reload();
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
        .finally(() => this.closeAndClearDialog());
    },
    closeAndClearDialog() {
      this.deleteDialog = false;
      this.editDialog = false;
      this.openDialog = false;
      this.editElementItem = {id: NaN, name: '', login: '', roles: []};
    }
  },
  beforeMount() {
    this.setTitle('Цитатник | Редактор пользователей');
    this.loadUsers();
  }
})
</script>

<style scoped>

</style>
