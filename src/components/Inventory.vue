<template>
  <div class="inventory">
    <!-- Список стэша -->
    <section class="inventory-box side-left">
      <h3>Предметы ({{ stack.length }})</h3>
      <div class="inventory-container container-column">
        <div
          v-for="item in stack"
          :key="item.id"
          class="inventory-side-item"
          @mouseover="showLeftTooltip(item)"
          @mouseleave="hideTooltip"
          draggable="true"
          @dragstart="dragStart(item)"
        >
          <img :src="item.icon" :alt="item.name" />
          <p>{{ item.name }}</p>
        </div>
      </div>
      <!-- Tooltip -->
      <div v-if="tooltipLeftVisible" class="tooltip tooltip-left" :style="tooltipStyle">
        <h4>{{ tooltipItem.name }}</h4>
        <p>{{ tooltipItem.description_full }}</p>
        <div class="tooltip-footer">
          <p>Состояние: {{ tooltipItem.health }}</p>
          <p>Размер: {{ tooltipItem.slotable }}</p>
        </div>
      </div>
    </section>

    <!-- Инвентарь игрока -->
    <div class="inventory-box side-center">
      <h3>Инвентарь</h3>
      <div class="inventory-container container-column">
        <div class="equipment-weapons">
          <h4>Оружие</h4>
          <div class="grid">
            <div class="slot slot-x3"></div>
            <div class="slot slot-x3"></div>
          </div>
        </div>
        <div class="equipment-body">
          <h4>Броня</h4>
          <div class="grid">
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
          </div>
        </div>
        <div class="grid">
        <div
          v-for="slot in inventorySlots"
          :key="slot.id"
          class="slot"
          @drop="drop(slot.id)"
          @dragover.prevent
          @dragenter.prevent
        >
          <img
            v-if="slot.item"
            :src="slot.item.icon"
            :alt="slot.item.name"
            @mouseover="showLeftTooltip(slot.item)"
            @mouseleave="hideTooltip"
          />
        </div>
      </div>
      </div>
    </div>

    <!-- Рюкзак -->
    <section class="inventory-box side-right">
      <h3>Рюкзак ({{ inventory.length }})</h3>
      <div class="inventory-container container-column">
        <div
          v-for="item in inventory"
          :key="item.id"
          class="inventory-side-item items-right"
          @mouseover="showRightTooltip(item)"
          @mouseleave="hideTooltip"
          draggable="true"
          @dragstart="dragStart(item)"
        >
          <p>{{ item.name }}</p>
          <img :src="item.icon" :alt="item.name" />
        </div>
      </div>
      <!-- Tooltip -->
      <div v-if="tooltipRightVisible" class="tooltip tooltip-right" :style="tooltipStyle">
        <h4>{{ tooltipItem.name }}</h4>
        <p>{{ tooltipItem.description_full }}</p>
        <div class="tooltip-footer">
          <p>Состояние: {{ tooltipItem.health }}</p>
          <p>Размер: {{ tooltipItem.slotable }}</p>
        </div>
      </div>
    </section>

    <!-- Tooltip -->
    <!-- <div v-if="tooltipVisible" class="tooltip" :style="tooltipStyle">
      <h4>{{ tooltipItem.name }}</h4>
      <p>{{ tooltipItem.description_full }}</p>
    </div> -->
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useInventoryItemsStore, type InventoryItem } from "../stores/inventory_items";

export default {
  name: "UserInventory",
  setup() {
    // Получаем данные из стейта
    const inventoryItemsStore = useInventoryItemsStore();
    const inventoryItems = inventoryItemsStore.inventoryItems;
    const stackItems = inventoryItemsStore.stackItems;
    const inventory = ref(inventoryItems);
    const stack = ref(stackItems);

    // Слоты инвентаря
    const inventorySlots = ref(
      Array.from({ length: inventory.value.length }, (_, i) => ({
        id: i + 1,
        item: <InventoryItem | null>(null),
      }))
    );

    // Всплывающая подсказка
    const tooltipLeftVisible = ref(false);
    const tooltipRightVisible = ref(false);
    const tooltipItem = ref<InventoryItem>({
      name: '', description_full: '',
      id: 0,
      description: '',
      icon: '',
      health: 0,
      size: 0,
      slotable: 0,
      stackable: 0
    });
    const tooltipStyle = ref({});
    const showLeftTooltip = (item: InventoryItem) => {
      tooltipItem.value = item;
      tooltipLeftVisible.value = true;
    };
    const showRightTooltip = (item: InventoryItem) => {
      tooltipItem.value = item;
      tooltipRightVisible.value = true;
    };
    const hideTooltip = () => {
      tooltipLeftVisible.value = false;
      tooltipRightVisible.value = false;
    };

    // Перетаскиваемый элемент
    const draggedItem = ref<InventoryItem | null>(null);

    const dragStart = (item: InventoryItem) => {
      draggedItem.value = item;
      tooltipLeftVisible.value = false;
    };

    const drop = (slotId: number) => {
      const slot = inventorySlots.value.find((s) => s.id === slotId);
      if (slot && !slot.item) {
        slot.item = draggedItem.value;
        inventory.value = inventory.value.filter((i) => draggedItem.value && i.id !== draggedItem.value.id);
        draggedItem.value = null;
      }
    };

    return {
      inventory,
      stack,
      inventorySlots,
      tooltipLeftVisible,
      tooltipRightVisible,
      tooltipItem,
      tooltipStyle,
      showLeftTooltip,
      showRightTooltip,
      hideTooltip,
      dragStart,
      drop,
    };
  },
};
</script>

<style scoped>
.inventory {
  position: fixed;
  top: 10vh;
  left: 20vw;
  display: flex;
  justify-content: space-between;
  background-color: rgba(112, 128, 144, 0.663);
  width: 60%;
  margin: auto;
  margin-top: 20%;
  padding: 2rem;
  font-family: "Roboto", serif;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;;
}

.inventory-box {
  display: block;
  position: relative;
  flex-grow: 2;
}

.side-center {
  flex-grow: 2;
}

.side-left, .side-right {
  flex-grow: 1;
}

.inventory-box > h3 {
  padding: 1rem;
  margin: 1rem;
  background-color: rgb(45, 45, 45);
  color: whitesmoke;
  text-align: center;
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 600;
}

.inventory-container {
  position: relative;
  display: flex;
  /* flex-wrap: wrap; */
  gap: 1rem;
  padding: 1rem;
  margin: 1rem;
  min-height: 500px;
  max-height: 40vh;
  overflow: auto;
  background-color: rgba(106, 119, 132, 0.734);
}

.container-column {
  flex-direction: column;
}

.inventory-side-item {
  position: relative;
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
  height: fit-content;
  padding: 1rem;
  background-color: rgba(78, 75, 71, 0.911);
}

.items-right {
  justify-content: right;
}

.inventory-side-item > img {
  width: 50px;
  height: 50px;
  cursor: grab;
}

.inventory-side-item > p {
  padding: 0 1rem;
  font-size: 1.2rem;
  text-align: center;
  color: white;
}

.equipment {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 1rem;
  min-width: 30%;
  padding: 1rem;
  /* background-image: url('/player_background.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 100%; */
}


.grid {
  display: grid;
  flex-grow: 2;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
}

.slot {
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed gray;
}

.slot.slot-x2 {
  width: 120px;
}
.slot.slot-x3 {
  width: 180px;
}

.tooltip {
  position: absolute;
  width: 60%;
  top: 6rem;
  background: rgba(216, 221, 226, 0.847);
  padding: 1rem;
  border: 1px solid gray;
  text-wrap: wrap;
  font-size: 1.1rem;
  z-index: 10;
  -webkit-box-shadow: 9px 2px 12px 5px rgba(0,0,0,0.75); 
  box-shadow: 9px 2px 12px 5px rgba(0,0,0,0.75);
}
.tooltip.tooltip-right {
  left: -60%;
}
.tooltip.tooltip-left {
  right: -60%;
}
.tooltip h4 {
  font-size: 1.3rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 1rem;
  background-color: rgb(62, 71, 72);
  color: white;
}
.tooltip-footer {
  display: flex;
  justify-content: space-between;
}
/* max-width: 3840px

max-width: 2560px

max-width: 2048px

max-width: 1920px

max-width: 1680px

max-width: 1600px

max-width: 1440px

max-width: 1368px

max-width: 1280px */
</style>