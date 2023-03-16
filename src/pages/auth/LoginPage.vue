<template>
  <q-page >


    <q-page-container>
      <q-scroll-area style="height: 85vh; max-width: 100vw;">
        <router-view/>
      </q-scroll-area>
    </q-page-container>

  </q-page>
</template>

<script>
export default {
  name: 'LoginPage'
}
</script>

<style scoped>

</style>
