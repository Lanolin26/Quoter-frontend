<template>
  <q-card class="vertical-middle">
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>

    <q-card-section>
      <q-form ref="form" class="q-gutter-md">
        <q-input
          id="login"
          :label="$t('quote.fields.login')"
          type="text"
          :readonly="readOnly"
          :rules="[val => (!!val && val !== '') || 'Field is required']"
          dense
          outlined
          v-model="editItem.login"
        />
        <q-input
          id="name"
          :label="$t('quote.fields.name')"
          type="text"
          :readonly="readOnly"
          :rules="[val => (!!val && val !== '') || 'Field is required']"
          dense
          outlined
          v-model="editItem.name"
        />
        <q-input
          id="password"
          :label="$t('quote.fields.password')"
          type="password"
          :readonly="readOnly"
          :rules="[val => (!!val && val !== '') || 'Field is required']"
          dense
          outlined
          v-model="editItem.password"
        />
        <q-input
          id="img"
          :label="$t('quote.fields.image')"
          type="text"
          :readonly="readOnly"
          dense
          outlined
          v-model="editItem.img"
        />
        <q-select
          id="roles"
          :label="$t('quote.fields.roles')"
          dense
          outlined
          multiple
          use-chips
          stack-label
          :readonly="readOnly"
          :options="roles"
          v-model="editItem.roles"
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
import QuoteUser, {UserRoles} from 'src/types/QuoteUser';
import {QForm} from 'quasar';

function createEmptyUser(): QuoteUser {
  return {id: NaN, name: '', login: '', roles: []};
}

export default defineComponent({
  name: 'EditUserCardComponent',
  props: {
    title: {required: true, type: String},
    user: {required: true, type: Object as () => QuoteUser | undefined},
    isSave: {required: false, type: Boolean, default: false},
    isDelete: {required: false, type: Boolean, default: false},
    isClose: {required: false, type: Boolean, default: false},
    readOnly: {required: false, type: Boolean, default: false}
  },
  computed: {
    roles(): Array<UserRoles> {
      return Object.values(UserRoles);
    }
  },
  watch: {
    user: {
      immediate: true,
      handler() {
        this.initEditItem();
      },
    },
  },
  data() {
    return {
      editItem: createEmptyUser(),
    }
  },
  methods: {
    initEditItem() {
      this.editItem = this.user ? this.user : createEmptyUser();
    },
    save() {
      (this.$refs['form'] as typeof QForm).validate().then((success: never) => {
        if (success) {
          if (isNaN(this.editItem.id)) {
            this.$emit('save', this.editItem)
          } else {
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
  beforeMount() {
    this.initEditItem();
  }
})
</script>

<style scoped>

</style>
