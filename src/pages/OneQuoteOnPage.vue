<template>
  <q-layout view="lHh lpR fFf">

    <q-page-container>
      <one-quote-component
        v-if="hasQuote"
        :quote="quote"
        :is-edit="false"
      />
      <q-card v-else>
        <q-card-section>{{ $t('quote.quote_id', {id}) }}</q-card-section>
        <q-card-section>{{ $t('quote.not_found') }}</q-card-section>
      </q-card>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapActions} from 'pinia';
import {usePageStore} from 'stores/pages';
import OneQuoteComponent from 'components/cards/OneQuoteComponent.vue';
import {QuoteInfo} from 'src/types/domain';

interface DataV {
  loading: boolean,
  quote?: QuoteInfo
}

export default defineComponent({
  name: 'OneQuoteOnPage',
  components: {OneQuoteComponent},
  computed: {
    id(): number {
        return Number.parseInt(this.$route.params.id as string);
    },
    hasQuote(): boolean {
      return !this.loading && this.quote != undefined
    },
  },
  data(): DataV {
    return {
      loading: false,
      quote: undefined
    }
  },
  methods: {
    ...mapActions(usePageStore, ['setTitle']),
  },
  beforeMount() {
    this.setTitle(`Цитата #${this.id}`)
    if(!isNaN(this.id)) {
      this.$api.quoteInfo.getOne(this.id)
        .then(found => this.quote = found)
        .catch(() => this.quote = undefined)
        .finally(() => this.loading = false);
    }
  }
})
</script>

<style scoped>

</style>
