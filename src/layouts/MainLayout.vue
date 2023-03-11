<template>
  <q-layout view="lHh lpR lff" class="shadow-2 rounded-borders">

    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" aria-label="Menu" @click="toggleLeftDrawerOpen"/>
        <q-toolbar-title>
          <q-avatar>
            <img src="~assets/quasar-logo-vertical.svg" alt="logo">
          </q-avatar>
          {{ getTitle }}
        </q-toolbar-title>
        <q-select
          v-model="locale"
          :options="localeOptions"
          :label="$t('language')"
          dense
          borderless
          emit-value
          map-options
          options-dense
          style="min-width: 150px"
        />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above elevated v-model="leftDrawerOpen" side="left">
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding class="rounded-borders">
          <q-item clickable v-ripple :to='{ name: "MainPage" }'>
            <q-item-section avatar>
              <q-icon name="home"/>
            </q-item-section>
            <q-item-section>{{ $t('menu.main') }}</q-item-section>
          </q-item>
          <q-item clickable v-ripple :to='{ name: "Create" }'>
            <q-item-section avatar>
              <q-icon name="add"/>
            </q-item-section>
            <q-item-section>{{ $t('menu.create') }}</q-item-section>
          </q-item>
          <q-expansion-item expand-separator icon="settings" :label="$t('menu.manage.manage')">
            <q-item clickable v-ripple :to='{ name: "ManageQuotes" }'>
              <q-item-section avatar>
                <q-icon name="add"/>
              </q-item-section>
              <q-item-section>{{ $t('menu.manage.quote') }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple :to='{ name: "ManageSource" }'>
              <q-item-section avatar>
                <q-icon name="add"/>
              </q-item-section>
              <q-item-section>{{ $t('menu.manage.source') }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple :to='{ name: "ManageSourceType" }'>
              <q-item-section avatar>
                <q-icon name="add"/>
              </q-item-section>
              <q-item-section>{{ $t('menu.manage.sourceType') }}</q-item-section>
            </q-item>
            <q-item clickable v-ripple :to='{ name: "ManageUser" }'>
              <q-item-section avatar>
                <q-icon name="add"/>
              </q-item-section>
              <q-item-section>{{ $t('menu.manage.user') }}</q-item-section>
            </q-item>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
      <q-img class="absolute-top" src="~assets/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="~assets/boy-avatar.png" alt="Avatar">
          </q-avatar>
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <div>{{ getTitle }}</div>
        <q-space/>
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapActions, mapState} from 'pinia'
import {usePageStore} from 'stores/pages';

export default defineComponent({
  name: 'MainLayout',
  components: {},
  computed: {
    ...mapState(usePageStore, ['getTitle']),
    localeOptions(): string[] {
      return this.$i18n.availableLocales;
    }
  },
  watch: {
    locale() {
      this.setLocale(this.locale);
    }
  },
  data() {
    return {
      leftDrawerOpen: false,
      locale: this.$i18n.locale,
    }
  },
  methods: {
    toggleLeftDrawerOpen() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    ...mapActions(usePageStore, ['setTitle', 'setLocale'])
  },
  beforeMount() {
    this.setTitle(this.$t('quoteMainPageTitle'));
  }
});
</script>
