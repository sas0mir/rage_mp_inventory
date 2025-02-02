<template>
  <div id="content">
    <Inventory :key="inventoryKey" />
  </div>
</template>

<script lang="ts">
import Inventory from './components/Inventory.vue';
import { ref } from 'vue';
export default {
  components: {
    Inventory
  },
  setup() {
    const inventoryKey = ref(0);
    const resetInventory = () => {
      // Изменяем ключ для перерисовки компонента
      inventoryKey.value++;
    };

    return {
      inventoryKey,
      resetInventory,
    };
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
body {
  overflow: hidden;
}
div {
  user-select: none;
}
/* Настройка стиля скроллбара */
::-webkit-scrollbar {
  width: 5px; /* Ширина скроллбара */
  background: url('/sb.png') no-repeat center; /* Фоновая картинка */
  background-size: cover;
}

/* Ползунок (ползунок внутри скроллбара) */
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5); /* Цвет ползунка */
  border-radius: 2px; /* Закругленные края */
  background-clip: padding-box; /* Сохраняет границы */
}

/* Ползунок при наведении */
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Трек (внутренняя часть скроллбара) */
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.2); /* Цвет трека */
  border-radius: 2px;
}

/* Трек при наведении */
::-webkit-scrollbar-track:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
