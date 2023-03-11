<template>
  <div>
    <manage-source-table-component :loading="loading"
                                   :page="page"
                                   :elementOnPage="elementByPage"
                                   :totalElements="totalElements"
                                   :sources="sources"
                                   @pagination="updateRows"
                                   @edit="editElement"
                                   @delete="deleteElement"
                                   @reload="reload"
                                   @newItem="newItem"
    />

    <q-dialog v-model="openDialog">
      <q-card-empty v-if="dialogLoading"/>
      <edit-source-card-component v-else
                                  style="width: 700px; max-width: 80vw;"
                                  :title="editTitle"
                                  :source="editElementType"
                                  :source-types="sourceTypes"
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
import ManageSourceTableComponent from 'components/manage/ManageSourceTableComponent.vue';
import {mapActions} from 'pinia';
import {usePageStore} from 'stores/pages';
import QCardEmpty from 'components/cards/QCardEmpty.vue';
import {defineComponent} from 'vue';
import {genNotifyOpts, Pageable} from 'src/types/common';
import EditSourceCardComponent from 'components/cards/EditSourceCardComponent.vue';
import {QuoteSource, QuoteSourceType} from 'src/types/domain';

export default defineComponent({
  name: 'ManageSource',
  components: {EditSourceCardComponent, QCardEmpty, ManageSourceTableComponent},
  data() {
    return {
      editDialog: false,
      deleteDialog: false,
      editElementType: <QuoteSource>{},
      dialogLoading: false,
      openDialog: false,
      sources: <QuoteSource[]>[],
      sourceTypes: <QuoteSourceType[]>[],
      loading: true,
      page: 1,
      totalPage: 1,
      elementByPage: 10,
      totalElements: 0,
    }
  },
  computed: {
    editTitle(): string {
      if (this.editDialog) {
        return isNaN(this.editElementType.id) ? this.$t('quote.edit.create') : this.$t('quote.edit.update');
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
      this.$api.quoteSource.getAllPageable(page)
        .then(res => {
          this.sources = res.content;
          this.totalPage = res.totalPages;
          this.elementByPage = res.numberOfElements;
          this.page = res.number + 1;
          this.totalElements = res.totalElements;
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Sources: ${error}`, 'red')))
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
      this.$api.quoteSource.getOne(id)
        .then(res => {
          this.editElementType = res
          this.dialogLoading = false;
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Source: ${error}`, 'red')));
    },
    deleteElement(id: number) {
      this.dialogLoading = true;
      this.deleteDialog = true;
      this.openDialog = true;
      this.$api.quoteSource.getOne(id)
        .then(res => {
          this.editElementType = res
          this.dialogLoading = false;
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Source: ${error}`, 'red')));
    },
    reload() {
      this.loadSource();
    },
    newItem() {
      this.editElementType = {id: NaN, sourceName: '', type: {id: NaN, type: ''}};
      this.editDialog = true;
      this.openDialog = true;
    },
    saveDialogElement(element: QuoteSource) {
      if (isNaN(element.id)) {
        this.$api.quoteSource.create(element)
          .then(res => {
            this.$q.notify(genNotifyOpts(`Success save quote ${res.id}`, 'green'))
            this.reload();
          })
          .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
          .finally(() => this.closeAndClearDialog());
      } else {
        this.$api.quoteSource.update(element.id, element)
          .then(res => {
            this.$q.notify(genNotifyOpts(`Success update quote ${res.id}`, 'green'))
            this.reload();
          })
          .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
          .finally(() => this.closeAndClearDialog());
      }
    },
    deleteDialogElement(element: QuoteSource) {
      this.$api.quoteSource.deleteItem(element.id)
        .then(() => {
          this.$q.notify(genNotifyOpts('Success delete type', 'green'))
          this.reload();
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
        .finally(() => this.closeAndClearDialog());
    },
    closeAndClearDialog() {
      this.deleteDialog = false;
      this.editDialog = false;
      this.openDialog = false;
      this.editElementType = {id: NaN, sourceName: '', type: {id: NaN, type: ''}};
    }
  },
  beforeMount() {
    this.setTitle('Цитатник | Редактор источников цитат');
    this.loadSource();
    this.$api.quoteSourceType.getAll()
      .then(res => this.sourceTypes = res)
      .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Source Type: ${error}`, 'red')));
  }
})
</script>

<style scoped>

</style>
