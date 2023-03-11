<template>
  <div style="margin: 1%;">
    <q-table
      :loading="loading"
      :columns="columns"
      :rows="sourceTypes"
      row-key="id"
      dense
      v-model:pagination="pagination"
      :filter="filter"
      @request="onRequest"
    >
      <template v-slot:top-left>
        <q-toolbar flat>
          <q-toolbar-title>{{ $t('menu.manage.sourceType') }}</q-toolbar-title>
          <q-separator vertical inset/>
          <q-btn class="q-ml-sm q-mr-sm" color="primary" square @click="getDataFromApi" icon="update"/>
          <q-btn color="primary" square @click="newItemCreate" icon="add_circle_outline"/>
        </q-toolbar>
      </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
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
          <q-btn flat round color="primary" icon="edit" size="xs" @click="editItem(props.key)"/>
          <q-btn flat round color="primary" icon="delete" size="xs" @click="deleteItem(props.key)"/>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {QuoteSourceType} from 'src/types/domain';

export default defineComponent({
  name: 'ManageSourceTypeTableComponent',
  props: {
    loading: {default: true, type: Boolean, required: true},
    sourceTypes: {
      default: <Array<QuoteSourceType>>[],
      type: Object as PropType<Array<QuoteSourceType>>,
      required: true
    },
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
        rowsPerPage: 10,
        rowsNumber: 10
      },
      columns: [
        {name: 'id', label: 'quote.fields.id', field: 'id', align: 'left', sortable: false},
        {name: 'type', label: 'quote.fields.sourceType', field: 'type', align: 'left', sortable: false},
        {name: 'actions', label: 'quote.edit.actions', align: 'left'},
      ]
    }
  },
  methods: {
    onRequest(props: { pagination: { page: number; rowsPerPage: number; } }) {
      this.$emit('pagination', {page: props.pagination.page, size: props.pagination.rowsPerPage});
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
