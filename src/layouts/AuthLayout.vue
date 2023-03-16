<template>
<q-layout view="lHh lpR lff" class="shadow-2 rounded-borders">
  <q-page-container>
    <q-scroll-area style="height: 85vh; max-width: 100vw;">
      <router-view/>
    </q-scroll-area>
  </q-page-container>
</q-layout>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>

</style>
