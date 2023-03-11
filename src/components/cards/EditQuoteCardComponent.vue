<template>
  <q-card class="vertical-middle">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>
    <q-card-section>
      <q-form ref="form" class="q-gutter-md">
        <q-select v-model="editItem.authorId" id="author" :label="$t('quote.fields.user')"
                  :readonly="readOnly"
                  :options="userList"
                  :option-value="opt => Object(opt) === opt && 'id' in opt ? opt.id : null"
                  :option-label="opt => Object(opt) === opt && 'name' in opt ? opt.name : ''"
                  dense
                  map-options
                  emit-value
                  stack-label
                  :rules="[val => (!!val && !isNaN(val)) || 'Field is required']"
        />
        <q-select v-model="editItem.sourceTypeId" id="sourceType" :label="$t('quote.fields.sourceType')"
                  :options="sourceTypes"
                  :readonly="readOnly"
                  :option-value="opt => Object(opt) === opt && 'id' in opt ? opt.id : null"
                  :option-label="opt => Object(opt) === opt && 'type' in opt ? opt.type : ''"
                  dense
                  map-options
                  emit-value
                  stack-label
                  :rules="[val => (!!val && !isNaN(val)) || 'Field is required']"
        />
        <q-select v-model="editItem.sourceId" id="source" :label="$t('quote.fields.source')"
                  :options="filteredSources"
                  :readonly="readOnly"
                  :option-value="opt => Object(opt) === opt && 'id' in opt ? opt.id : null"
                  :option-label="opt => Object(opt) === opt && 'sourceName' in opt ? opt.sourceName : ''"
                  dense
                  map-options
                  emit-value
                  stack-label
                  :rules="[val => (!!val && !isNaN(val)) || 'Field is required']"
        />
        <q-input id="text"
                 :label="$t('quote.fields.text')"
                 type="textarea"
                 v-model="editItem.text"
                 :readonly="readOnly"
                 clear-icon="highlight_off"
                 stack-label
                 :rules="[val => (!!val && val !== '') || 'Field is required']"
                 clearable
                 autogrow
                 dense
                 counter
                 outlined
        />
      </q-form>
    </q-card-section>
    <q-card-actions>
      <q-btn color="positive" v-if="isSave" @click="save" :label="$t('quote.edit.save')"/>
      <q-btn color="negative" v-if="isDelete" @click="deleteQuote" :label="$t('quote.edit.delete')"/>
      <q-btn v-if="isSave" @click="cleanNextLine" :label="$t('quote.edit.clear')"/>
      <q-btn v-if="isClose" @click="close" :label="$t('quote.edit.close')"/>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import QuoteSource from 'src/types/QuoteSource';
import QuoteSourceType from 'src/types/QuoteSourceType';
import QuoteUser from 'src/types/QuoteUser';
import QuoteIdsInfo from 'src/types/QuoteIdsInfo';
import {QForm} from 'quasar';

interface DataV {
  editItem: QuoteIdsInfo
}

function createEmptyQuote(): QuoteIdsInfo {
  return {id: NaN, authorId: NaN, sourceId: NaN, sourceTypeId: NaN, text: ''};
}

export default defineComponent({
  name: 'EditQuoteCardComponent',
  props: {
    title: {required: true, type: String},
    quote: {required: true, type: Object as () => QuoteIdsInfo | undefined},
    sources: {required: true, type: Array as () => Array<QuoteSource>},
    sourceTypes: {required: true, type: Array as () => Array<QuoteSourceType>},
    userList: {required: true, type: Array as () => Array<QuoteUser>},
    isSave: {required: false, type: Boolean, default: false},
    isDelete: {required: false, type: Boolean, default: false},
    isClose: {required: false, type: Boolean, default: false},
    readOnly: {required: false, type: Boolean, default: false}
  },
  computed: {
    filteredSources(): Array<QuoteSource> {
      if (this.editItem)
        return this.sources.filter(item => item.type.id === this.editItem?.sourceTypeId);
      else
        return this.sources;
    }
  },
  watch: {
    quote: {
      immediate: true,
      handler() {
        this.initEditItem();
      }
    },
  },
  data(): DataV {
    return {
      editItem: createEmptyQuote(),
    }
  },
  methods: {
    initEditItem() {
      this.editItem = this.quote ? this.quote : createEmptyQuote();
    },
    save() {
      (this.$refs['form'] as typeof QForm).validate().then((success: never) => {
        if (success) {
          if(isNaN(this.editItem.id)) {
            this.$emit('save', this.editItem)
          }else{
            this.$emit('update', this.editItem)
          }
        }
      })

    },
    deleteQuote() {
      this.$emit('delete', this.editItem)
    },
    close() {
      this.$emit('close')
    },
    cleanNextLine() {
      this.editItem.text = this.editItem?.text
        .replace(/(?<=[\s\S])\n(?=.)/g, ' ')
        .replace(/—/g, '-')
        .replace(/--/g, '-')
        .replace('  ', ' ')
        .replace(/^\w/g, '')
        .replace(/\n\s/g, '\n\n')
        .replace(/\r/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(String.fromCharCode(160), ' ')
    },
  },
  mount() {
    this.initEditItem();
  },
})
</script>

<style scoped>

</style>
