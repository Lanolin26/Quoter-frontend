<template>
  <q-card class="vertical-middle">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>

    <q-card-section>
      <q-form ref="form" class="q-gutter-md">
        <q-select v-model="editItem.type.id"
                  id="sourceType"
                  :label="$t('quote.fields.sourceType')"
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
        <q-input id="text"
                 :label="$t('quote.fields.source')"
                 type="text"
                 v-model="editItem.sourceName"
                 :readonly="readOnly"
                 clear-icon="highlight_off"
                 stack-label
                 :rules="[val => (!!val && val !== '') || 'Field is required']"
                 clearable
                 dense
                 outlined
        />
      </q-form>
    </q-card-section>

    <q-card-actions>
      <q-btn color="positive" v-if="isSave" @click="save" :label="$t('quote.edit.save')"/>
      <q-btn color="negative" v-if="isDelete" @click="deleteQuote" :label="$t('quote.edit.delete')"/>
      <q-btn v-if="isClose" @click="close" :label="$t('quote.edit.close')"/>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {QForm} from 'quasar';
import {QuoteSource, QuoteSourceType} from 'src/types/domain';

function createEmptySource(): QuoteSource {
  return {id: NaN, sourceName: '', type: { id: NaN, type: '' }};
}

export default defineComponent({
  name: 'EditSourceCardComponent',
  props: {
    title: { required: true, type: String },
    source: {required: true, type: Object as () => QuoteSource | undefined},
    sourceTypes: {required: true, type: Array as () => Array<QuoteSourceType>},
    isSave: {required: false, type: Boolean, default: false},
    isDelete: {required: false, type: Boolean, default: false},
    isClose: {required: false, type: Boolean, default: false},
    readOnly: {required: false, type: Boolean, default: false}
  },
  watch: {
    source: {
      immediate: true,
      handler() {
        this.initEditItem();
      },
    },
  },
  data() {
    return {
      editItem: createEmptySource(),
    }
  },
  methods: {
    initEditItem() {
      this.editItem = this.source ? this.source : createEmptySource();
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
  },
  mount() {
    this.initEditItem();
  },
})
</script>

<style scoped>

</style>
