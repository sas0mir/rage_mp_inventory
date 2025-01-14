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
div {
  user-select: none;
}
/* Настройка стиля скроллбара */
::-webkit-scrollbar {
  width: 1rem; /* Ширина скроллбара */
  background: url('/sb.png') no-repeat center; /* Фоновая картинка */
  background-size: cover;
}

/* Ползунок (ползунок внутри скроллбара) */
::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5); /* Цвет ползунка */
  border-radius: 0.6rem; /* Закругленные края */
  border: 2px solid transparent; /* Пространство между ползунком и скроллбаром */
  background-clip: padding-box; /* Сохраняет границы */
}

/* Ползунок при наведении */
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Трек (внутренняя часть скроллбара) */
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.2); /* Цвет трека */
  border-radius: 6px;
}

/* Трек при наведении */
::-webkit-scrollbar-track:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
