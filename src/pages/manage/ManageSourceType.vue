<template>
  <div>
    <manage-source-type-table-component :loading="loading"
                                        :page="page"
                                        :elementOnPage="elementByPage"
                                        :totalElements="totalElements"
                                        :sourceTypes="sourceTypes"
                                        @pagination="updateRows"
                                        @edit="editElement"
                                        @delete="deleteElement"
                                        @reload="reload"
                                        @newItem="newItem"
    />
    <q-dialog v-model="openDialog">
      <q-card-empty v-if="dialogLoading"/>
      <edit-source-type-card-component v-else
                                       style="width: 700px; max-width: 80vw;"
                                       :title="editTitle"
                                       :source-type="editElementType"
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
import {mapActions} from 'pinia';
import {usePageStore} from 'stores/pages';
import QuoteSourceType from 'src/types/QuoteSourceType';
import {defineComponent} from 'vue';
import {genNotifyOpts, Pageable} from 'src/types/common';
import ManageSourceTypeTableComponent from 'components/manage/ManageSourceTypeTableComponent.vue';
import QCardEmpty from 'components/cards/QCardEmpty.vue';
import EditSourceTypeCardComponent from 'components/cards/EditSourceTypeCardComponent.vue';

export default defineComponent({
  name: 'ManageSourceType',
  components: {EditSourceTypeCardComponent, QCardEmpty, ManageSourceTypeTableComponent},
  props: {},
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
  data() {
    return {
      editDialog: false,
      deleteDialog: false,
      dialogLoading: false,
      openDialog: false,
      editElementType: <QuoteSourceType>{},
      sourceTypes: <QuoteSourceType[]>[],
      loading: true,
      page: 1,
      totalPage: 1,
      elementByPage: 10,
      totalElements: 0,
    }
  },
  methods: {
    ...mapActions(usePageStore, ['setTitle']),
    loadSourceType() {
      const page: Pageable = {page: this.page - 1, size: this.elementByPage};
      this.loading = true;
      this.$api.quoteSourceType.getAllPageable(page)
        .then(res => {
          this.sourceTypes = res.content;
          this.totalPage = res.totalPages;
          this.elementByPage = res.numberOfElements;
          this.page = res.number + 1;
          this.totalElements = res.totalElements;
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Source Types: ${error}`, 'red')))
        .finally(() => this.loading = false)
    },
    updateRows(props: Pageable) {
      this.page = props.page;
      this.elementByPage = props.size;
      this.loadSourceType();
    },
    editElement(id: number) {
      this.dialogLoading = true;
      this.editDialog = true;
      this.openDialog = true;
      this.$api.quoteSourceType.getOne(id)
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
      this.$api.quoteSourceType.getOne(id)
        .then(res => {
          this.editElementType = res
          this.dialogLoading = false;
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Source: ${error}`, 'red')));
    },
    reload() {
      this.loadSourceType();
    },
    newItem() {
      this.editElementType = {id: NaN, type: ''};
      this.editDialog = true;
      this.openDialog = true;
    },
    saveDialogElement(element: QuoteSourceType) {
      if (isNaN(element.id)) {
        this.$api.quoteSourceType.create(element)
          .then(res => {
            this.$q.notify(genNotifyOpts(`Success save quote ${res.id}`, 'green'))
            this.reload();
          })
          .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
          .finally(() => this.closeAndClearDialog());
      } else {
        this.$api.quoteSourceType.update(element.id, element)
          .then(res => {
            this.$q.notify(genNotifyOpts(`Success update quote ${res.id}`, 'green'))
            this.reload();
          })
          .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
          .finally(() => this.closeAndClearDialog());
      }
    },
    deleteDialogElement(element: QuoteSourceType) {
      this.$api.quoteSourceType.deleteItem(element.id)
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
      this.editElementType = {id: NaN, type: ''};
    }
  },
  beforeMount() {
    this.setTitle('Цитатник | Редактор типов источника цитат');
    this.loadSourceType();
  }
})
</script>

<style scoped>

</style>
