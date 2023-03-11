<template>
  <div style="margin: 1%;">
    <q-table
      :loading="loading"
      :columns="columns"
      row-key="id"
      :rows="quotes"
      separator="vertical"
      dense
      v-model:pagination="pagination"
      :filter="filter"
      @request="onRequest"
    >
      <template v-slot:top-left>
        <q-toolbar flat>
          <q-toolbar-title>{{ $t('menu.manage.quote') }}</q-toolbar-title>
          <q-separator vertical inset />
          <q-btn class="q-ml-sm q-mr-sm" color="primary" square @click="getDataFromApi" icon="update"/>
          <q-btn color="primary" square @click="newItemCreate" icon="add_circle_outline"/>
        </q-toolbar>
      </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!--  eslint-disable-next-line -->
      <template v-slot:header-cell="props">
        <q-th :props="props">
          {{ $t(props.col.label) }}
        </q-th>
      </template>
      <!--  eslint-disable-next-line -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round color="primary" icon="edit" size="xs" @click="editItem(props.key)" />
          <q-btn flat round color="primary" icon="delete" size="xs" @click="deleteItem(props.key)" />
        </q-td>
      </template>
      <!--  eslint-disable-next-line -->
      <template v-slot:body-cell-sourceType="props">
        <q-td :props="props">
            <q-chip outlined size="sm" :label="props.value" />
        </q-td>
      </template>

    </q-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {QuoteInfo} from 'src/types/domain';

export default defineComponent({
  name: 'ManageQuoteTableComponent',
  props: {
    loading: {default: true, type: Boolean, required: true},
    quotes: {default: <Array<QuoteInfo>>[], type: Object as PropType<Array<QuoteInfo>>, required: true},
    page: {default: 1, type: Number, required: true},
    elementOnPage: {default: 10, type: Number, required: true},
    totalElements: {default: 0, type: Number, required: true},
  },
  watch: {
    page() {
      this.pagination.page = this.page;
    },
    elementOnPage() {
      this.pagination.rowsPerPage = this.elementOnPage;
    },
    totalElements() {
      this.pagination.rowsNumber = this.totalElements;
    }
  },
  data() {
    return {
      filter: '',
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 10
      },
      columns: [
        {name: 'id', label: 'quote.fields.id', field: 'id', align: 'left', sortable: false},
        {name: 'sourceType', label: 'quote.fields.sourceType', field: 'sourceType', align: 'left', sortable: false},
        {name: 'sourceName', label: 'quote.fields.source', field: 'sourceName', align: 'left', sortable: false},
        {name: 'authorName', label: 'quote.fields.user', field: 'authorName', align: 'left', sortable: false},
        {name: 'text', label: 'quote.fields.text', field: 'text', align: 'left', sortable: false, format: (val: string) => `${val.substring(0, 50)}...`,},
        {name: 'actions', label: 'quote.edit.actions', align: 'left'},
      ]
    }
  },
  methods: {
    onRequest(props: {pagination: { page: number; rowsPerPage: number; }}) {
      this.$emit('pagination', { page: props.pagination.page, size: props.pagination.rowsPerPage});
    },
    editItem(itemId: number) {
      this.$emit('edit', itemId);
    },
    deleteItem(itemId: number) {
      this.$emit('delete', itemId);
    },
    getDataFromApi() {
      this.$emit('reload');
    },
    newItemCreate() {
      this.$emit('newItem');
    }
  },
  beforeMount() {
    this.pagination.page = this.page;
    this.pagination.rowsPerPage = this.elementOnPage;
    this.pagination.rowsNumber = this.totalElements;
  }
})
</script>

<style scoped>

</style>
