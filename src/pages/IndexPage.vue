<template>
  <q-page padding>
    <q-card-empty v-if="loading"/>
    <div v-else>
        <one-quote-component
          v-for="item in quotes"
          :key="item.id"
          :quote="item"
          is-edit
        />
        <q-pagination
          v-model="page"
          :max="totalPage"
          :max-pages="6"
          boundary-numbers
          direction-links
          class="q-pa-lg relative-position vertical-middle flex-center"
          color="grey"
          active-color="primary"
        />
    </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import OneQuoteComponent from 'components/cards/OneQuoteComponent.vue';
import QCardEmpty from 'components/cards/QCardEmpty.vue';
import {mapActions} from 'pinia';
import {usePageStore} from 'stores/pages';
import {Pageable} from 'src/types/common';
import {QuoteInfo} from 'src/types/domain';

export default defineComponent({
  name: 'IndexPage',
  components: {
    QCardEmpty,
    OneQuoteComponent
  },
  watch: {
    page() {
      this.loadElements();
    }
  },
  data() {
    return {
      quotes: new Array<QuoteInfo>(),
      loading: false,
      page: 1,
      totalPage: 1,
      elementByPage: 10,
    }
  },
  methods: {
    ...mapActions(usePageStore, ['setTitle']),
    loadElements() {
      const paging: Pageable = {
        size: this.elementByPage,
        page: this.page - 1
      };
      this.loading = true;

      this.$api.quoteInfo
        .getAllPageable(paging)
        .then(res => {
          this.quotes = res.content;
          this.totalPage = res.totalPages;
          this.elementByPage = res.numberOfElements;
          this.page = res.number + 1;
        })
        .catch(err => console.log(err))
        .finally(() => this.loading = false)
    }
  },
  beforeMount() {
    this.setTitle('Цитатник v2');
    this.loadElements();
  }
});
</script>
