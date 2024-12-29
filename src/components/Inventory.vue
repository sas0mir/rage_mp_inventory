<template>
  <div class="inventory">
    <!-- Список стэша -->
    <div class="stash">
      <h3>Stash</h3>
      <div class="item-list">
        <div
          v-for="item in stash"
          :key="item.id"
          class="item"
          @mouseover="showTooltip(item)"
          @mouseleave="hideTooltip"
          draggable="true"
          @dragstart="dragStart(item)"
        >
          <img :src="item.icon" :alt="item.name" />
        </div>
      </div>
    </div>

    <!-- Инвентарь игрока -->
    <div class="inventory-grid">
      <h3>Inventory</h3>
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
  background-color: slategrey;
  width: 60%;
  margin: 2rem auto;
  padding: 2rem;
}

.stash {
  flex-grow: 1;
}

.inventory-grid {
  flex-grow: 2;
}

.stash > h3, .inventory-grid > h3 {
  padding: 1rem;
  margin: 1rem;
  background-color: rgb(45, 45, 45);
  color: whitesmoke;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}

.item {
  position: relative;
}

.item img {
  width: 50px;
  height: 50px;
  cursor: grab;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
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
</style>