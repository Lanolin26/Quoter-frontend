<template>
    <q-card bordered
            class="text-black q-pa-sm q-ma-sm"
            style="min-width: 640px"
    >
      <q-card-section class="flex">
        <div class="text-h6">{{ $t('quote.quote_id', {id}) }}</div>
        <q-space/>
        <q-chip :clickable="false">{{ sourceType }}</q-chip>
        <q-chip>{{ sourceName }}</q-chip>
      </q-card-section>

      <q-card-section>
        <div>

          <div class="row">
            <div class="col-2">{{ $t('quote.fields.user') }}:</div>
            <div class="col-5">
              <div class="fit non-selectable">
                <span v-if="quote.authorName">{{ authorName }}</span>
                <span v-else>{{ authorLogin }}</span>
              </div>
              <q-tooltip :offset="[10, 10]" self="top middle" anchor="bottom middle">
                @{{ authorLogin }}
              </q-tooltip>
            </div>
          </div>

          <div class="row">
            <div class="col-2"><b>{{ sourceType }}:</b></div>
            <div class="col-5">{{ sourceName }}</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <span><b>{{ $t('quote.fields.text') }}:</b></span>
        <p>
          <span style="white-space: pre-line">{{ text }}</span>
        </p>
      </q-card-section>

      <q-card-actions>
        <q-space/>
        <q-btn round icon="edit" v-if="isEdit" @click="clickToEdit"/>
        <q-btn round icon="content_copy" @click="clickToCopyText"/>
        <q-btn round icon="link" @click="clickTiCopyUrl"/>
      </q-card-actions>
    </q-card>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import QuoteInfo from 'src/types/QuoteInfo';

export default defineComponent({
  name: 'OneQuoteComponent',
  components: {},
  props: {
    quote: {
      required: true,
      type: Object as PropType<QuoteInfo>
    },
    isEdit: {
      required: false,
      default: false,
      type: Boolean
    }
  },
  computed: {
    id() {
      return this.quote.id;
    },
    sourceName() {
      return this.quote.sourceName;
    },
    sourceType() {
      return this.quote.sourceType;
    },
    authorName() {
      return this.quote.authorName;
    },
    authorLogin() {
      return this.quote.authorLogin;
    },
    text() {
      return this.quote.text;
    }
  },
  methods: {
    async copyToClipboards(text?: string) {
      try {
        if (text) await navigator.clipboard.writeText(text);
        this.$q.notify({
          progress: true,
          color: 'green',
          message: 'Successful copied to Clipboard!',
          timeout: 2000,
          actions: [
            { label: 'Dismiss', color: 'white', handler: () => { /* ... */ }}
          ]
        });
      } catch ($e) {
        this.$q.notify({
          progress: true,
          message: 'Some error to copy url to Clipboard!',
          color: 'red',
          timeout: 2000,
          actions: [
            {label: 'Dismiss', color: 'white', handler: () => { /* ... */}}
          ]
        });
      }
    },
    clickToEdit() {
      this.$router.push({ name: 'EditOneQuote', params: { id: this.id } })
    },
    clickToCopyText() {
      this.copyToClipboards(this.text)
    },
    clickTiCopyUrl() {
      this.copyToClipboards(`${window.location.origin}/quote/${this.id}`)
    }
  }
})
</script>

<style scoped>

</style>
