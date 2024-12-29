<template>
  <div class="inventory">
    <!-- Список стэша -->
    <section class="inventory-box side-left">
      <h3>Предметы</h3>
      <div class="inventory-container container-column">
        <div
          v-for="item in stash"
          :key="item.id"
          class="inventory-side-item"
          @mouseover="showTooltip(item)"
          @mouseleave="hideTooltip"
          draggable="true"
          @dragstart="dragStart(item)"
        >
          <img :src="item.icon" :alt="item.name" />
          <p>{{ item.name }}</p>
        </div>
      </div>
    </section>

    <!-- Инвентарь игрока -->
    <div class="inventory-box side-center">
      <h3>Инвентарь</h3>
      <div class="inventory-container container-center">
        <div class="equipment">
          <div class="equipment-slots">
            <div class="slot equipment_head"></div>
            <div class="slot equipment_vest"></div>
            <div class="slot equipment_clothes_up"></div>
            <div class="slot equipment_clothes_down"></div>
            <div class="slot equipment_accessories"></div>
            <div class="slot equipment_shoes"></div>
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
            @mouseover="showTooltip(slot.item)"
            @mouseleave="hideTooltip"
          />
        </div>
      </div>
      </div>
    </div>

    <!-- Рюкзак -->
    <div class="inventory-box side-right">
      <h3>Рюкзак</h3>
      <div class="inventory-container container-column">
        <div
          v-for="item in stash"
          :key="item.id"
          class="inventory-side-item items-right"
          @mouseover="showTooltip(item)"
          @mouseleave="hideTooltip"
          draggable="true"
          @dragstart="dragStart(item)"
        >
          <p>{{ item.name }}</p>
          <img :src="item.icon" :alt="item.name" />
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div v-if="tooltipVisible" class="tooltip" :style="tooltipStyle">
      <h4>{{ tooltipItem.name }}</h4>
      <p>{{ tooltipItem.description_full }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import { useInventoryItemsStore, type InventoryItem } from "../stores/inventory_items";

export default {
  name: "UserInventory",
  setup() {
    // Список стэша
    const inventoryItemsStore = useInventoryItemsStore();
    const items = inventoryItemsStore.inventoryItems;
    const stash = ref(items);

    // Слоты инвентаря
    const inventorySlots = ref(
      Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        item: <InventoryItem | null>(null),
      }))
    );

    // Перетаскиваемый элемент
    const draggedItem = ref<InventoryItem | null>(null);

    // Tooltip
    const tooltipVisible = ref(false);
    interface TooltipItem {
      name: string;
      description_full: string;
    }
    
    const tooltipItem = ref<TooltipItem>({ name: '', description_full: '' });
    const tooltipStyle = ref({});

    const showTooltip = (item: InventoryItem) => {
      tooltipItem.value = item;
      tooltipVisible.value = true;
    };

    const hideTooltip = () => {
      tooltipVisible.value = false;
    };

    const dragStart = (item: InventoryItem) => {
      draggedItem.value = item;
    };

    const drop = (slotId: number) => {
      const slot = inventorySlots.value.find((s) => s.id === slotId);
      if (slot && !slot.item) {
        slot.item = draggedItem.value;
        stash.value = stash.value.filter((i) => draggedItem.value && i.id !== draggedItem.value.id);
        draggedItem.value = null;
      }
    };

    return {
      stash,
      inventorySlots,
      tooltipVisible,
      tooltipItem,
      tooltipStyle,
      showTooltip,
      hideTooltip,
      dragStart,
      drop,
    };
  },
};
</script>

<style scoped>
.inventory {
  display: flex;
  justify-content: space-between;
  background-color: rgba(112, 128, 144, 0.663);
  width: 60%;
  margin: auto;
  margin-top: 20%;
  padding: 2rem;
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
  font-size: 1.5rem;
  font-weight: 600;
}

.inventory-container {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  margin: 1rem;
  min-height: 500px;
  max-height: 60vh;
  overflow: visible;
  background-color: rgba(106, 119, 132, 0.734);
}

.container-column {
  flex-direction: column;
}

.container-center {
  justify-content: space-between;
}

.inventory-side-item {
  position: relative;
  display: flex;
  justify-content: left;
  align-items: center;
  width: 90%;
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
  background-image: url('/player_background.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 100%;
}

.equipment-slots {
  position: relative;
  display: flex;
  gap: 1rem;
  height: 100%;
}

.slot.equipment_head {
  position: absolute;
  top: 0;
  right: 50%;
}
.slot.equipment_vest {
  position: absolute;
  top: 20%;
  right: 25%;
}
.slot.equipment_clothes_up {
  position: absolute;
  top: 20%;
  left: 25%;
}
.slot.equipment_clothes_down {
  position: absolute;
  bottom: 20%;
  right: 45%;
}
.slot.equipment_accessories {
  position: absolute;
  top: 50%;
  right: 5%;
}
.slot.equipment_shoes {
  position: absolute;
  bottom: 5%;
  right: 45%;
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

.tooltip {
  position: absolute;
  top: 20px;
  left: 45%;
  background: white;
  padding: 10px;
  border: 1px solid gray;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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