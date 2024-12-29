<template>
  <div id="content">
    <Inventory />
  </div>
</template>

<script lang="ts">
import Inventory from './components/Inventory.vue';
export default {
  components: {
    Inventory
  }
}
</script>

<style scoped>

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>
