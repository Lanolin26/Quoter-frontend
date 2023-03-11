<template>
  <q-card class="vertical-middle">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>

    <q-card-section>
      <q-form ref="form" class="q-gutter-md">
        <q-input id="text"
                 :label="$t('quote.fields.sourceType')"
                 type="text"
                 v-model="editItem.type"
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
import {QuoteSourceType} from 'src/types/domain';

function createEmptySourceType(): QuoteSourceType {
  return {id: NaN, type: ''};
}

export default defineComponent({
  name: 'EditSourceTypeCardComponent',
  props: {
    title: {required: true, type: String},
    sourceType: {required: true, type: Object as () => QuoteSourceType | undefined},
    isSave: {required: false, type: Boolean, default: false},
    isDelete: {required: false, type: Boolean, default: false},
    isClose: {required: false, type: Boolean, default: false},
    readOnly: {required: false, type: Boolean, default: false}
  },
  watch: {
    sourceType: {
      immediate: true,
      handler() {
        this.initEditItem();
      },
    },
  },
  data() {
    return {
      editItem: createEmptySourceType(),
    }
  },
  methods: {
    initEditItem() {
      this.editItem = this.sourceType ? this.sourceType : createEmptySourceType();
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
