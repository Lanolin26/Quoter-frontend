<template>
  <div>
    <manage-quote-table-component :loading="loading"
                                  :quotes="quotes"
                                  :page="page"
                                  :elementOnPage="elementByPage"
                                  :totalElements="totalElements"
                                  @pagination="updateRows"
                                  @edit="editElement"
                                  @delete="deleteElement"
                                  @reload="reload"
                                  @newItem="newItem"
    />
    <q-dialog v-model="openDialog">
      <q-card-empty v-if="dialogLoading"/>
      <edit-quote-card-component v-else
                            style="width: 700px; max-width: 80vw;"
                            :title="editTitle"
                            :user-list="users"
                            :source-types="quoteSourceTypes"
                            :sources="quoteSources"
                            :quote="editElementIds"
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
import {genNotifyOpts, Pageable} from 'src/types/common';
import {defineComponent} from 'vue';
import QuoteInfo from 'src/types/QuoteInfo';
import {mapActions} from 'pinia';
import {usePageStore} from 'stores/pages';
import QuoteSource from 'src/types/QuoteSource';
import QuoteSourceType from 'src/types/QuoteSourceType';
import QuoteUser from 'src/types/QuoteUser';
import QuoteIdsInfo from 'src/types/QuoteIdsInfo';
import QCardEmpty from 'components/cards/QCardEmpty.vue';
import EditQuoteCardComponent from 'components/cards/EditQuoteCardComponent.vue';
import ManageQuoteTableComponent from 'components/manage/ManageQuoteTableComponent.vue';

export default defineComponent({
  name: 'ManageQuote',
  components: {
    ManageQuoteTableComponent,
    EditQuoteCardComponent,
    QCardEmpty
  },
  data() {
    return {
      quotes: <QuoteInfo[]>[],
      quoteSources: <QuoteSource[]>[],
      quoteSourceTypes: <QuoteSourceType[]>[],
      users: <QuoteUser[]>[],
      loading: true,
      page: 1,
      totalPage: 1,
      elementByPage: 10,
      totalElements: 0,
      editDialog: false,
      deleteDialog: false,
      editElementIds: <QuoteIdsInfo>{},
      dialogLoading: false,
      openDialog: false
    };
  },
  computed: {
    editTitle(): string {
      if (this.editDialog) {
        return isNaN(this.editElementIds.id) ? this.$t('quote.edit.create') : this.$t('quote.edit.update');
      }
      if (this.deleteDialog) {
        return this.$t('quote.delete_confirm');
      }
      return 'Unknown';
    }
  },
  methods: {
    ...mapActions(usePageStore, ['setTitle']),
    loadSource() {
      const page: Pageable = {page: this.page - 1, size: this.elementByPage};
      this.loading = true;
      this.$api.quoteInfo.getAllPageable(page)
        .then(res => {
          this.quotes = res.content;
          this.totalPage = res.totalPages;
          this.elementByPage = res.numberOfElements;
          this.page = res.number + 1;
          this.totalElements = res.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
    },
    updateRows(props: Pageable) {
      this.page = props.page;
      this.elementByPage = props.size;
      this.loadSource();
    },
    editElement(id: number) {
      this.dialogLoading = true;
      this.editDialog = true;
      this.openDialog = true;
      this.$api.quoteInfo.getIdsOne(id)
        .then(res => {
          this.editElementIds = res
          this.dialogLoading = false;
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Quote: ${error}`, 'red')));
    },
    deleteElement(id: number) {
      this.dialogLoading = true;
      this.deleteDialog = true;
      this.openDialog = true;
      this.$api.quoteInfo.getIdsOne(id)
        .then(res => {
          this.editElementIds = res
          this.dialogLoading = false;
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Quote: ${error}`, 'red')));
    },
    reload() {
      this.loadSource();
    },
    newItem() {
      this.editElementIds = {id: NaN, sourceId: 0, sourceTypeId: 0, authorId: 0, text: ''};
      this.editDialog = true;
      this.openDialog = true;
    },
    saveDialogElement(element: QuoteIdsInfo) {
      if (isNaN(element.id)) {
        this.$api.quoteInfo.create(element)
          .then(res => {
            this.$q.notify(genNotifyOpts(`Success save quote ${res.id}`, 'green'))
            this.reload();
          })
          .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
          .finally(() => this.closeAndClearDialog());
      } else {
        this.$api.quoteInfo.update(element.id, element)
          .then(res => {
            this.$q.notify(genNotifyOpts(`Success update quote ${res.id}`, 'green'))
            this.reload();
          })
          .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
          .finally(() => this.closeAndClearDialog());
      }
    },
    deleteDialogElement(element: QuoteIdsInfo) {
      this.$api.quoteInfo.deleteItem(element.id)
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
      this.editElementIds = {id: NaN, sourceId: 0, sourceTypeId: 0, authorId: 0, text: ''};
    }
  },
  beforeMount() {
    this.setTitle('Цитатник | Редактор цитат');
    this.loadSource();
    this.$api.quoteSource.getAll()
      .then(res => this.quoteSources = res)
      .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Source: ${error}`, 'red')));
    this.$api.quoteSourceType.getAll()
      .then(res => this.quoteSourceTypes = res)
      .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Source Type: ${error}`, 'red')));
    // this.users = [this.getCurrentUser]
    this.$api.quoteUser.getAll()
      .then(res => this.users = res)
      .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object User: ${error}`, 'red')));
  }
})
</script>

<style scoped>

</style>
