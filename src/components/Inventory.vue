<template>
  <div class="inventory">
    <!-- Список стэша -->
    <section class="inventory-box side-left">
      <h3>Предметы ({{ stack.length }})</h3>
      <div
        class="inventory-container container-column"
      >
        <div
          v-for="group in groupedStack"
          :key="group.item.id + '-' + group.quantity"
          class="inventory-side-item"
          @mousedown="handleMouseDown('stack', group.item, $event)"
          @mouseover="showLeftTooltip(group.item)"
          @mouseleave="hideTooltip"
        >
          <img :src="group.item.icon" :alt="group.item.name" />
          <p>{{ group.item.name }} (x{{ group.quantity }})</p>
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
    <section class="inventory-box side-center">
      <h3>Инвентарь</h3>
      <div class="inventory-container container-column">
        <div class="equipment-weapons">
          <h4>Оружие</h4>
          <div class="grid grid-two-fraction">
            <div class="slot slot-x3">
              <img
                v-if="inventorySlots.weapons && inventorySlots.weapons[0].id"
                :src="inventorySlots.weapons && inventorySlots.weapons[0].icon"
                :alt="inventorySlots.weapons && inventorySlots.weapons[0].name"
                @mousedown="handleMouseDown('weapons_right_slot', inventorySlots.weapons[0], $event)"
                @mouseover="showCenterTooltip(inventorySlots.weapons && inventorySlots.weapons[0])"
                @mouseleave="hideTooltip"
                @load="checkOrientation"
                :class="{ rotated: isVertical }"
              />
            </div>
            <div class="slot slot-x3">
              <img
                v-if="inventorySlots.weapons && inventorySlots.weapons.length === 2"
                :src="inventorySlots.weapons && inventorySlots.weapons[1].icon"
                :alt="inventorySlots.weapons && inventorySlots.weapons[1].name"
                @mousedown="handleMouseDown('weapons_right_slot', inventorySlots.weapons[1], $event)"
                @mouseover="showCenterTooltip(inventorySlots.weapons && inventorySlots.weapons[1])"
                @mouseleave="hideTooltip"
                @load="checkOrientation"
                :class="{ rotated: isVertical }"
              />
            </div>
          </div>
        </div>
        <div class="equipment-body">
          <h4>Броня</h4>
          <div class="grid">
            <div class="slot">
              <img
                v-if="inventorySlots.head"
                :src="inventorySlots.head.icon"
                :alt="inventorySlots.head.name"
                @mouseover="showCenterTooltip(inventorySlots.head)"
                @mouseleave="hideTooltip"
              />
            </div>
            <div class="slot">
              <img
                v-if="inventorySlots.vest"
                :src="inventorySlots.vest.icon"
                :alt="inventorySlots.vest.name"
                @mouseover="showCenterTooltip(inventorySlots.vest)"
                @mouseleave="hideTooltip"
              />
            </div>
            <div class="slot">
              <img
                v-if="inventorySlots.clothesUp"
                :src="inventorySlots.clothesUp.icon"
                :alt="inventorySlots.clothesUp.name"
                @mouseover="showCenterTooltip(inventorySlots.clothesUp)"
                @mouseleave="hideTooltip"
              />
            </div>
            <div class="slot"></div>
            <div class="slot"></div>
            <div class="slot"></div>
          </div>
        </div>
        <div class="equipment-food">
          <h4>Еда и напитки</h4>
          <div class="grid">
            <div
              class="slot"
              v-for="i in 7"
              :key="i"
            ></div>
          </div>
        </div>
        <div class="equipment-medical">
          <h4>Медикаменты</h4>
          <div class="grid">
            <div
              class="slot"
              v-for="i in 14"
              :key="i"
            ></div>
          </div>
        </div>
      </div>
      <!-- Tooltip -->
      <div v-if="tooltipCenterVisible" class="tooltip tooltip-left" :style="tooltipStyle">
        <h4>{{ tooltipItem.name }}</h4>
        <p>{{ tooltipItem.description_full }}</p>
        <div class="tooltip-footer">
          <p>Состояние: {{ tooltipItem.health }}</p>
          <p>Размер: {{ tooltipItem.slotable }}</p>
        </div>
      </div>
    </section>

    <!-- Рюкзак -->
    <section class="inventory-box side-right">
      <h3>Рюкзак ({{ inventory.length }})</h3>
      <div class="inventory-container container-column">
        <div
          v-for="group in groupedInventory"
          :key="group.item.id + '-' + group.quantity"
          class="inventory-side-item items-right"
          @mouseover="showRightTooltip(group.item)"
          @mouseleave="hideTooltip"
          @mmousedown="handleMouseDown('inventory', group.item, $event)"
        >
          <p>{{ group.item.name }} (x{{ group.quantity }})</p>
          <img :src="group.item.icon" :alt="group.item.name" />
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
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed } from "vue";
import { useInventoryItemsStore, type InventoryItem, type EquippedItems } from "../stores/inventory_items";

export default {
  name: "UserInventory",
  setup() {
    //Данные для рендера 3х блоков инвентаря
    const inventory = ref<InventoryItem[]>([]);
    const stack = ref<InventoryItem[]>([]);
    const inventorySlots = ref<EquippedItems>({});

    const loadData = async () => {
      try {
        //Подгружаем данные из стора или делаем запрос на сервер
        const inventoryItemsStore = useInventoryItemsStore();
        const inventoryItems = inventoryItemsStore.inventoryItems;
        const stackItems = inventoryItemsStore.stackItems;
        const equippedItems = inventoryItemsStore.equippedItems;
        stack.value = stackItems;
        inventory.value = inventoryItems;
        inventorySlots.value = equippedItems;
      } catch (error) {
        console.error('Ошибка получения проедиетов->', error);
      }
    }

    onMounted(() => {
      loadData();
    });

    // Группировка предметов в зависимости от stackable
    const groupedStack = computed(() => {
      const groups: Record<number, { item: InventoryItem; quantity: number }[]> = {};
      stack.value.forEach((item) => {
        if (!groups[item.id]) {
          groups[item.id] = [];
        }
        const group = groups[item.id];
        const stackable = item.stackable;
        const slot = group.find((g) => g.quantity < stackable);
        if (slot) {
          slot.quantity += 1;
        } else {
          group.push({ item, quantity: 1 });
        }
      });
      return Object.values(groups).flat();
    });
    const groupedInventory = computed(() => {
      const groups: Record<number, { item: InventoryItem; quantity: number }[]> = {};
      inventory.value.forEach((item) => {
        if (!groups[item.id]) {
          groups[item.id] = [];
        }
        const group = groups[item.id];
        const stackable = item.stackable;
        const slot = group.find((g) => g.quantity < stackable);
        if (slot) {
          slot.quantity += 1;
        } else {
          group.push({ item, quantity: 1 });
        }
      });
      console.log('groups', groups);
      return Object.values(groups).flat();
    });

    // для проверки ориентации изображения
    const isVertical = ref(false);
    const checkOrientation = (event: Event) => {
      const img = event.target as HTMLImageElement;
      if (img.naturalHeight > img.naturalWidth) {
        isVertical.value = true; // Если высота больше ширины, изображение вертикальное
      } else {
        isVertical.value = false; // Изображение горизонтальное
      }
    };

    // Всплывающая подсказка
    const tooltipLeftVisible = ref(false);
    const tooltipRightVisible = ref(false);
    const tooltipCenterVisible = ref(false);
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
    const showCenterTooltip = (item: InventoryItem) => {
      tooltipItem.value = item;
      tooltipCenterVisible.value = true;
    };
    const hideTooltip = () => {
      tooltipLeftVisible.value = false;
      tooltipRightVisible.value = false;
      tooltipCenterVisible.value = false;
    };

    // Вариант драгндропа с onmousedown по координатам
    const handleMouseDown = (from: string, item: InventoryItem, event: MouseEvent) => {
      const itemElement = (event.target as Element).closest(".inventory-side-item");
      if (!itemElement) return;

      const initialX = event.clientX;
      const initialY = event.clientY;

      const itemRect = itemElement.getBoundingClientRect();
      const shiftX = initialX - itemRect.left;
      const shiftY = initialY - itemRect.top;
      // Устанавливаем абсолютное позиционирование
      itemElement.setAttribute("style", "position: absolute; z-index: 1000;");
      document.body.append(itemElement);

      moveAt(event.pageX, event.pageY, itemElement);

      function moveAt(pageX: number, pageY: number, itemElement: Element) {
        itemElement.setAttribute("style", "left: " + (pageX - shiftX) + "px; top: " + (pageY - shiftY) + "px;");
      }

      function onMouseMove(event: MouseEvent) {
        moveAt(event.pageX, event.pageY);
      }

      document.addEventListener("mousemove", onMouseMove);

      itemElement.onmouseup = function (event) {
        document.removeEventListener("mousemove", onMouseMove);
        itemElement.onmouseup = null;

        // Получаем слот, куда был перенесен предмет
        const dropSlot = getSlotFromEvent(event);
        if (dropSlot) {
          handleDrop(item, dropSlot);
        }

        // Возвращаем предмет на место, если перенос не удался
        resetItemPosition(itemElement);
      };
    };

    const getSlotFromEvent = (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const slots = document.querySelectorAll(".inventory-slot");
      for (const slot of slots) {
        const rect = slot.getBoundingClientRect();
        if (
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom
        ) {
          return slot;
        }
      }
      return null;
    };

    const handleDrop = (group, dropSlot) => {
      console.log("Перенос предмета:", group);
      console.log("Новый слот:", dropSlot);
      // Логика перемещения предмета в новый слот
    };

    const resetItemPosition = (itemElement) => {
      itemElement.style.position = "";
      itemElement.style.zIndex = "";
      itemElement.style.left = "";
      itemElement.style.top = "";
    };

    // Перетаскиваемый элемент
    // const draggedItem = ref<{from: string, item: InventoryItem} | null>(null);

    // const dragStart = (from: string, item: InventoryItem) => {
    //   draggedItem.value = { from, item };
    //   hideTooltip();
    // };

    // Обработка события drop
    // const handleDrop = (to: string) => {
    //   console.log('to', to, 'draggedItem', draggedItem.value);
    //   if (draggedItem.value) {
    //     //вставляем перетаскиваемый предмет в новое расположение (to)
    //     if (to === 'inventory') {
    //       inventory.value.push(draggedItem.value.item);
    //       // todo добавить изменение стейта
    //     } else if (to === 'stack') {
    //       stack.value.push(draggedItem.value.item);
    //     } else if (to === 'weapons_left_slot') {
    //       if (!inventorySlots.value.weapons) {
    //         inventorySlots.value.weapons = [];
    //       }
    //       if(draggedItem.value.item.type !== 'weapon') {
    //         return;
    //       }
    //       inventorySlots.value.weapons[0] = draggedItem.value.item;
    //     } else if (to === 'weapons_right_slot') {
    //       if (!inventorySlots.value.weapons) {
    //         inventorySlots.value.weapons = [];
    //       }
    //       if(draggedItem.value.item.type !== 'weapon') {
    //         return;
    //       }
    //       inventorySlots.value.weapons[1] = draggedItem.value.item;
    //     } else if (to === 'head') {
    //       inventorySlots.value.head = draggedItem.value.item;
    //     } else if (to === 'vest') {
    //       inventorySlots.value.vest = draggedItem.value.item;
    //     } else if (to === 'clothesUp') {
    //       inventorySlots.value.clothesUp = draggedItem.value.item;
    //     }
    //     //удаляем перетаскиваемый предмет из прошлого расположения (from)
    //     if (draggedItem.value.from === 'stack') {
    //       const delIndex = stack.value.findIndex((i) => i.id === draggedItem.value?.item.id);
    //       if (delIndex !== -1) {
    //         stack.value.splice(delIndex, 1);
    //       }
    //     } else if (draggedItem.value.from === 'inventory') {
    //       const delIndex = inventory.value.findIndex((i) => i.id === draggedItem.value?.item.id);
    //       if (delIndex !== -1) {
    //         inventory.value.splice(delIndex, 1);
    //       }
    //     } else if (draggedItem.value.from === 'weapons_left_slot' && inventorySlots.value.weapons) {
    //       inventorySlots.value.weapons[0] = {
    //         name: '',
    //         description_full: '',
    //         id: 0,
    //         description: '',
    //         icon: '',
    //         health: 0,
    //         size: 0,
    //         slotable: 0,
    //         stackable: 0
    //       };
    //     } else if (draggedItem.value.from === 'weapons_right_slot' && inventorySlots.value.weapons) {
    //       inventorySlots.value.weapons[1] = {
    //         name: '',
    //         description_full: '',
    //         id: 0,
    //         description: '',
    //         icon: '',
    //         health: 0,
    //         size: 0,
    //         slotable: 0,
    //         stackable: 0
    //       };
    //     } else if (draggedItem.value.from === 'head') {
    //       inventorySlots.value.head = null;
    //     } else if (draggedItem.value.from === 'vest') {
    //       inventorySlots.value.vest = null;
    //     } else if (draggedItem.value.from === 'clothesUp') {
    //       inventorySlots.value.clothesUp = null;
    //     }
    //   }
    // }

    // const drop = (slotId: number) => {
    //   const slot = inventorySlots.value.find((s) => s.id === slotId);
    //   if (slot && !slot.item) {
    //     slot.item = draggedItem.value;
    //     inventory.value = inventory.value.filter((i) => draggedItem.value && i.id !== draggedItem.value.id);
    //     draggedItem.value = null;
    //   }
    // };

    return {
      inventory,
      stack,
      inventorySlots,
      groupedStack,
      groupedInventory,
      tooltipLeftVisible,
      tooltipRightVisible,
      tooltipCenterVisible,
      tooltipItem,
      tooltipStyle,
      showLeftTooltip,
      showRightTooltip,
      showCenterTooltip,
      hideTooltip,
      handleMouseDown,
      //dragStart,
      handleDrop,
      isVertical,
      checkOrientation
    };
  },
};
</script>

<style scoped>
.inventory {
  position: fixed;
  top: 15vh;
  left: 20vw;
  display: flex;
  justify-content: space-between;
  background-color: rgba(112, 128, 144, 0.663);
  width: 60%;
  margin: auto;
  border-radius: 1rem;
  /* padding: 2rem; */
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

.inventory-box.side-right {
  background-image: url('/bgb.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.inventory-box > h3 {
  padding: 0.5rem;
  margin: 1rem;
  border-radius: 1rem;
  background-color: rgb(65, 68, 66);
  background-image: url('/background_camouflage_headers.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  color: whitesmoke;
  text-align: center;
  text-transform: uppercase;
  font-size: 1.2rem;
  font-weight: 600;
}

.inventory-container {
  position: relative;
  display: flex;
  /* flex-wrap: wrap; */
  gap: 1rem;
  padding: 1rem;
  margin: 1rem;
  min-height: 35vh;
  max-height: 40vh;
  overflow: auto;
  /* background-color: rgba(106, 119, 132, 0.734); */
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
  /* background-color: rgba(78, 75, 71, 0.911); */
}

.items-right {
  justify-content: right;
}

.inventory-side-item > img {
  width: 60px;
  height: 60px;
  cursor: grab;
  background-color: rgba(0,0,0,0.75);
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
  /* flex-grow: 2; */
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  padding: 1rem;
}
.grid-two-fraction {
  grid-template-columns: repeat(2, 3fr);
  justify-content: space-around;
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
.slot-x3 > img {
  width: 60px;
  height: auto;
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

img.rotated {
  transform: rotate(90deg);
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