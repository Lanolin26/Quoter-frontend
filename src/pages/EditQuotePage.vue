<template>
  <q-page>
    <q-card-empty v-if="loading"/>
    <edit-quote-card-component v-else
                          is-save
                          :title="title"
                          :is-delete="!!quote"
                          :user-list="users"
                          :sources="sources"
                          :source-types="sourceTypes"
                          :quote="quote"
                          @save="save"
                          @delete="deleteItem"
                          @update="update"
                          :no-data-label="noDataTitle"
    />
    <q-btn v-if="quote" @click="prev()" icon="chevron_left"/>
    <q-btn v-if="quote" @click="next()" icon="chevron_right"/>
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import QuoteSourceType from 'src/types/QuoteSourceType';
import QuoteSource from 'src/types/QuoteSource';
import QuoteIdsInfo from 'src/types/QuoteIdsInfo';
import {mapActions} from 'pinia';
import {usePageStore} from 'stores/pages';
import QuoteUser from 'src/types/QuoteUser';
import {genNotifyOpts} from 'src/types/common';
import QCardEmpty from 'components/cards/QCardEmpty.vue';
import EditQuoteCardComponent from 'components/cards/EditQuoteCardComponent.vue';

interface dataV {
  quote?: QuoteIdsInfo,
  loading: boolean,
  sources: Array<QuoteSource>,
  sourceTypes: Array<QuoteSourceType>,
  users: Array<QuoteUser>,
}

export default defineComponent({
  name: 'EditQuotePage',
  components: {EditQuoteCardComponent, QCardEmpty},
  computed: {
    id(): number {
      return Number.parseInt(this.$route.params.id as string);
    },
    title(): string {
      return this.quote ? `Edit #${this.id}` : 'New'
    },
    noDataTitle(): string {
      return 'I didn\'t find anything for you';
    }
  },
  watch: {
    id() {
      this.getQuote(this.id)
    },
    quote() {
      this.setTitle(`Редактор цитаты | #${isNaN(this.id) ? 'New' : this.id}`)
    }
  },
  data(): dataV {
    return {
      quote: undefined,
      loading: true,
      sources: [],
      sourceTypes: [],
      users: []
    }
  },
  methods: {
    ...mapActions(usePageStore, ['setTitle']),
    getQuote(id: number) {
      this.loading = true;
      if (isNaN(id)) {
        this.loading = false;
        this.quote = undefined
      } else {
        this.$api.quoteInfo
          .getIdsOne(id)
          .then(res => this.quote = res)
          .catch(() => this.quote = undefined)
          .finally(() => this.loading = false);
      }
    },
    initialize() {
      this.getQuote(this.id)
      this.$api.quoteSource
        .getAll()
        .then(res => this.sources = res)
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Source: ${error}`,'red')));

      this.$api.quoteSourceType
        .getAll()
        .then(res => this.sourceTypes = res)
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object Source Type: ${error}`,'red')));

      this.$api.quoteUser
        .getAll()
        .then(res => this.users = res)
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to load object User: ${error}`,'red')));
    },
    save(item: QuoteIdsInfo) {
      this.$api.quoteInfo.create(item)
        .then(res => {
          this.$q.notify(genNotifyOpts(`Success save quote ${res.id}`, 'green'))
          this.$router.push({name: 'EditOneQuote', params: {id: `${res.id + 1}`}})
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`,'red')))
    },
    deleteItem(item: QuoteIdsInfo) {
      this.$api.quoteInfo.deleteItem(item.id)
        .then(() => {
          this.$q.notify(genNotifyOpts('Success delete quote', 'green'))
          this.$router.push({name: 'MainPage'})
        })
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`,'red')))
    },
    update(item: QuoteIdsInfo) {
      this.$api.quoteInfo.update(item.id, item)
        .then(res => this.$q.notify(genNotifyOpts(`Success update quote ${res.id}`, 'green')))
        .catch(error => this.$q.notify(genNotifyOpts(`Some error to save object: ${error}`, 'red')))
    },
    next() {
      if (this.quote) this.$router.push({name: 'EditOneQuote', params: {id: `${this.quote.id + 1}`}})
    },
    prev() {
      if (this.quote) this.$router.push({name: 'EditOneQuote', params: {id: `${this.quote.id - 1}`}})
    },
  },
  beforeMount() {
    this.setTitle(`Редактор цитаты | #${this.id ? this.id : 'New'}`)
    this.initialize();
  }
})
</script>

<style scoped>

</style>
