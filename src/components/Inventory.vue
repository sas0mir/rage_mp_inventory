<template>
  <div class="inventory">
    <!-- Список стэша -->
    <section class="inventory-box side-left">
      <h3>Окружение ({{ inventoryAround.length }})</h3>
      <div
        class="inventory-container container-column"
        :id="'dropzone_left'"
      >
        <div
          v-for="group in groupedInventoryAround"
          :key="group.item.itemId + '-' + group.quantity"
          class="inventory-side-item"
          @mouseover="showLeftTooltip(group.item)"
          @mouseleave="hideTooltip"
        >
          <img :src="group.item.icon" :alt="group.item.name" @mousedown="handleMouseDown('around', $event, group.item)" :id="'movable_left' + group.item.itemId"/>
          <p>{{ group.item.name }} (x{{ group.quantity }})</p>
        </div>
      </div>
      <!-- Tooltip -->
      <div v-if="tooltipLeftVisible" class="tooltip tooltip-left" :style="tooltipStyle">
        <h4>{{ tooltipItem.name }}</h4>
        <p>{{ tooltipItem.dtext1 }}</p>
        <p v-if="tooltipItem.dtext2">{{ tooltipItem.dtext2 }}</p>
        <p v-if="tooltipItem.dtext3">{{ tooltipItem.dtext3 }}</p>
        <p v-if="tooltipItem.dtext4">{{ tooltipItem.dtext4 }}</p>
        <div class="tooltip-footer">
          <p>Состояние: {{ tooltipItem.health }}</p>
          <p>Размер: {{ tooltipItem.itsize }}</p>
        </div>
      </div>
    </section>

    <!-- Инвентарь игрока -->
    <section class="inventory-box side-center">
      <h3>Инвентарь</h3>
      <div class="inventory-container container-column">
        <div class="equipment equipment-weapons">
          <h4>Оружие</h4>
          <div class="grid grid-two-fraction">
            <div class="slot slot-x3" :id="'dropzone_weapons_left'">
              <img
                v-if="inventorySlots.weapons && inventorySlots.weapons[0].itemId"
                :src="inventorySlots.weapons && inventorySlots.weapons[0].icon"
                :alt="inventorySlots.weapons && inventorySlots.weapons[0].name"
                @mousedown="handleMouseDown('weapons_right_slot', $event, inventorySlots.weapons[0])"
                @mouseover="showCenterTooltip(inventorySlots.weapons && inventorySlots.weapons[0])"
                @mouseleave="hideTooltip"
                @load="checkOrientation"
                :class="{ rotated: isVertical }"
                :id="'movable_weapons_left' + inventorySlots.weapons[0].itemId"
              />
            </div>
            <div class="slot slot-x3" :id="'dropzone_weapons_right'">
              <img
                v-if="inventorySlots.weapons && inventorySlots.weapons.length === 2"
                :src="inventorySlots.weapons && inventorySlots.weapons[1].icon"
                :alt="inventorySlots.weapons && inventorySlots.weapons[1].name"
                @mousedown="handleMouseDown('weapons_right_slot', $event, inventorySlots.weapons[1])"
                @mouseover="showCenterTooltip(inventorySlots.weapons && inventorySlots.weapons[1])"
                @mouseleave="hideTooltip"
                @load="checkOrientation"
                :class="{ rotated: isVertical }"
                :id="'movable_weapons_right' + inventorySlots.weapons[1].itemId"
              />
            </div>
          </div>
        </div>
        <div class="equipment equipment-body">
          <h4>Броня</h4>
          <div class="grid">
            <div class="slot" :class="{'slot-bg-head': !inventorySlots.head}" :id="'dropzone_head'">
              <img
                v-if="inventorySlots.head"
                :src="inventorySlots.head.icon"
                :alt="inventorySlots.head.name"
                @mouseover="showCenterTooltip(inventorySlots.head)"
                @mouseleave="hideTooltip"
                @mousedown="handleMouseDown('head', $event, inventorySlots.head)"
                :id="'movable_head' + inventorySlots.head.itemId"
              />
            </div>
            <div class="slot" :class="{'slot-bg-backpack': !inventorySlots.backpack}" :id="'dropzone_backpack'">
              <img
                v-if="inventorySlots.backpack"
                :src="inventorySlots.backpack.icon"
                :alt="inventorySlots.backpack.name"
                @mouseover="showCenterTooltip(inventorySlots.backpack)"
                @mouseleave="hideTooltip"
                @mousedown="handleMouseDown('vest', $event, inventorySlots.backpack)"
                :id="'movable_backpack' + inventorySlots.backpack.itemId"
              />
            </div>
            <div class="slot" :class="{'slot-bg-vest': !inventorySlots.vest}" :id="'dropzone_vest'">
              <img
                v-if="inventorySlots.vest"
                :src="inventorySlots.vest.icon"
                :alt="inventorySlots.vest.name"
                @mouseover="showCenterTooltip(inventorySlots.vest)"
                @mouseleave="hideTooltip"
                @mousedown="handleMouseDown('vest', $event, inventorySlots.vest)"
                :id="'movable_vest' + inventorySlots.vest.itemId"
              />
            </div>
            <div class="slot" :class="{'slot-bg-clothes-up': !inventorySlots.clothesUp}" :id="'dropzone_clothesUp'">
              <img
                v-if="inventorySlots.clothesUp"
                :src="inventorySlots.clothesUp.icon"
                :alt="inventorySlots.clothesUp.name"
                @mouseover="showCenterTooltip(inventorySlots.clothesUp)"
                @mouseleave="hideTooltip"
                @mousedown="handleMouseDown('clothesUp', $event, inventorySlots.clothesUp)"
                :id="'movable_clothesUp' + inventorySlots.clothesUp.itemId"
              />
            </div>
            <div class="slot" :class="{'slot-bg-clothes-down': !inventorySlots.clothesDown}" :id="'dropzone_clothesDown'">
              <img
                v-if="inventorySlots.clothesDown"
                :src="inventorySlots.clothesDown.icon"
                :alt="inventorySlots.clothesDown.name"
                @mouseover="showCenterTooltip(inventorySlots.clothesDown)"
                @mouseleave="hideTooltip"
                @mousedown="handleMouseDown('clothesDown', $event, inventorySlots.clothesDown)"
                :id="'movable_clothesDown' + inventorySlots.clothesDown.itemId"
              />
            </div>
            <div class="slot" :class="{'slot-bg-shoes': !inventorySlots.shoes}" :id="'dropzone_shoes'">
              <img
                v-if="inventorySlots.shoes"
                :src="inventorySlots.shoes.icon"
                :alt="inventorySlots.shoes.name"
                @mouseover="showCenterTooltip(inventorySlots.shoes)"
                @mouseleave="hideTooltip"
                @mousedown="handleMouseDown('shoes', $event, inventorySlots.shoes)"
                :id="'movable_shoes' + inventorySlots.shoes.itemId"
              />
            </div>
          </div>
        </div>
        <div class="equipment equipment-food">
          <h4>Еда и напитки</h4>
          <div class="grid">
            <div
              class="slot"
              v-for="i in 7"
              :key="i"
              :id="'dropzone_food' + i"
            >
              <img
                v-if="inventorySlots.food && inventorySlots.food[i - 1]"
                :src="inventorySlots.food && inventorySlots.food[i - 1].icon"
                :alt="inventorySlots.food && inventorySlots.food[i - 1].name"
                @mouseover="showCenterTooltip(inventorySlots.food && inventorySlots.food[i - 1])"
                @mouseleave="hideTooltip"
                @mousedown="handleMouseDown('food', $event, inventorySlots.food[i - 1], i - 1)"
                :id="'movable_food' + inventorySlots.food[i - 1].itemId"
                />
            </div>
          </div>
        </div>
        <div class="equipment equipment-medicine">
          <h4>Медикаменты</h4>
          <div class="grid">
            <div
              class="slot"
              v-for="i in 7"
              :key="i"
              :id="'dropzone_medicine' + i"
            >
              <img
                v-if="inventorySlots.medicine && inventorySlots.medicine[i - 1]"
                :src="inventorySlots.medicine && inventorySlots.medicine[i - 1].icon"
                :alt="inventorySlots.medicine && inventorySlots.medicine[i - 1].name"
                @mouseover="showCenterTooltip(inventorySlots.medicine && inventorySlots.medicine[i - 1])"
                @mouseleave="hideTooltip"
                @mousedown="handleMouseDown('medicine', $event, inventorySlots.medicine[i - 1], i - 1)"
                :id="'movable_medicine' + inventorySlots.medicine[i - 1].itemId"
                />
            </div>
          </div>
        </div>
        <div class="equipment equipment-accesories">
          <h4>Аксессуары</h4>
          <div class="grid">
            <div
              class="slot"
              v-for="i in 7"
              :key="i"
              :id="'dropzone_accesories' + i"
            >
              <img
                v-if="inventorySlots.accesories && inventorySlots.accesories[i - 1]"
                :src="inventorySlots.accesories && inventorySlots.accesories[i - 1].icon"
                :alt="inventorySlots.accesories && inventorySlots.accesories[i - 1].name"
                @mouseover="showCenterTooltip(inventorySlots.accesories && inventorySlots.accesories[i - 1])"
                @mouseleave="hideTooltip"
                @mousedown="handleMouseDown('accesories', $event, inventorySlots.accesories[i - 1], i - 1)"
                :id="'movable_accesories' + inventorySlots.accesories[i - 1].itemId"
                />
            </div>
          </div>
        </div>
      </div>
      <!-- Tooltip -->
      <div v-if="tooltipCenterVisible" class="tooltip tooltip-left" :style="tooltipStyle">
        <h4>{{ tooltipItem.name }}</h4>
        <p>{{ tooltipItem.dtext1 }}</p>
        <p v-if="tooltipItem.dtext2">{{ tooltipItem.dtext2 }}</p>
        <p v-if="tooltipItem.dtext3">{{ tooltipItem.dtext3 }}</p>
        <p v-if="tooltipItem.dtext4">{{ tooltipItem.dtext4 }}</p>
        <div class="tooltip-footer">
          <p>Состояние: {{ tooltipItem.health }}</p>
          <p>Размер: {{ tooltipItem.itsize }}</p>
        </div>
      </div>
    </section>

    <!-- Рюкзак -->
    <section class="inventory-box side-right">
      <h3>Рюкзак ({{ inventory.length }})</h3>
      <div class="inventory-container container-column" :id="'dropzone_right'">
        <div
          v-for="group in groupedInventory"
          :key="group.item.itemId + '-' + group.quantity"
          class="inventory-side-item items-right"
          @mouseover="showRightTooltip(group.item)"
          @mouseleave="hideTooltip"
        >
          <p>{{ group.item.name }} (x{{ group.quantity }})</p>
          <img :src="group.item.icon" :alt="group.item.name" @mousedown="handleMouseDown('inventory', $event, group.item)" :id="'movable_right' + group.item.itemId"/>
        </div>
      </div>
      <!-- Tooltip -->
      <div v-if="tooltipRightVisible" class="tooltip tooltip-right" :style="tooltipStyle">
        <h4>{{ tooltipItem.name }}</h4>
        <p>{{ tooltipItem.dtext1 }}</p>
        <p v-if="tooltipItem.dtext2">{{ tooltipItem.dtext2 }}</p>
        <p v-if="tooltipItem.dtext3">{{ tooltipItem.dtext3 }}</p>
        <p v-if="tooltipItem.dtext4">{{ tooltipItem.dtext4 }}</p>
        <div class="tooltip-footer">
          <p>Состояние: {{ tooltipItem.health }}</p>
          <p>Размер: {{ tooltipItem.itsize }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, computed, onUnmounted, reactive } from "vue";
import { useInventoryItemsStore, type InventoryItem, type EquippedItems } from "../stores/inventory_items";

export default {
  name: "UserInventory",
  setup() {
    //Данные для рендера 3х блоков инвентаря
    const inventory = ref<InventoryItem[]>([]);
    const inventoryAround = ref<InventoryItem[]>([]);
    const inventorySlots = ref<EquippedItems>({});

    const loadData = async () => {
      try {
        //Подгружаем данные из стора или делаем запрос на сервер
        const inventoryItemsStore = useInventoryItemsStore();
        const inventoryItems = inventoryItemsStore.inventoryItems;
        const aroundItems = inventoryItemsStore.aroundItems;
        const equippedItems = inventoryItemsStore.equippedItems;
        inventoryAround.value = aroundItems;
        inventory.value = inventoryItems;
        inventorySlots.value = equippedItems;
      } catch (error) {
        console.error('Ошибка получения предметов->', error);
      }
    }

    const changeData = (action: string, item: InventoryItem, path: string) => {
      try {
        //тут можно реализовать изменение данных в сторе или отправку на сервер
        console.log('action->', action, 'item->', item, 'path->', path);
        //const inventoryItemsStore = useInventoryItemsStore();
      if (action === 'delete') {
        // Удаляем предмет из инвентаря по path
      } else if (action === 'put') {
        // Кладем предмет в инвентарь по path
      }
      } catch(error) {
        console.error('Ошибка изменения данных->', error);
      }
    }

    onMounted(() => {
      loadData();
    });

    onUnmounted(() => {
      //Очищаем данные при уничтожении компонента
      inventory.value = [];
      inventoryAround.value = [];
      inventorySlots.value = {};
    })

    // Группировка предметов в зависимости от stackable
    const groupedInventoryAround = computed(() => {
      const groups: Record<string, { item: InventoryItem; quantity: number }[]> = {};
      inventoryAround.value.forEach((item) => {
        if (!groups[item.itemId]) {
          groups[item.itemId] = [{item, quantity: 1}];
        }
        //todo
        const group = groups[item.itemId];
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
      const groups: Record<string, { item: InventoryItem; quantity: number }[]> = {};
      inventory.value.forEach((item) => {
        if (!groups[item.itemId]) {
          groups[item.itemId] = [];
        }
        const group = groups[item.itemId];
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
      name: '',
      itemId: '',
      icon: '',
      health: 0,
      itsize: 0,
      slotable: 0,
      stackable: 0,
      dtext1: ''
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

    //final dragndrop version
    const draggedElement = ref<HTMLElement | null>(null);
    const draggedItem = ref<{ from: string, item: InventoryItem } | null>(null);
    const dragOffset = reactive({ x: 0, y: 0 });

    const handleMouseDown = (from: string, event: MouseEvent, drItem: InventoryItem, fromIndex?: number) => {
      hideTooltip();
      const target = event.target as HTMLElement;
      const item = target.closest("[id*='movable']") as HTMLElement;
      if (!item) return;

      // Устанавливаем перетаскиваемый элемент
      draggedElement.value = item;
      draggedItem.value = { from, item: drItem };

      // Сохраняем смещение курсора относительно элемента
      const rect = item.getBoundingClientRect();
      dragOffset.x = event.clientX - rect.left;
      dragOffset.y = event.clientY - rect.top;
      const shiftX = event.clientX - rect.left;
      const shiftY = event.clientY - rect.top;

      // Удаляем предмет из прошлого расположения (объект inventorySlots | stack | inventory)
      if (from === 'around') {
        const delIndex = inventoryAround.value.findIndex((i) => i.itemId === drItem.itemId);
        if (delIndex !== -1) {
          inventoryAround.value.splice(delIndex, 1);
        }
      } else if (from === 'inventory') {
        const delIndex = inventory.value.findIndex((i) => i.itemId === drItem.itemId);
        if (delIndex !== -1) {
          inventory.value.splice(delIndex, 1);
        }
      } else if (from === 'weapons_left_slot' && inventorySlots.value.weapons) {
        inventorySlots.value.weapons[0] = {
          name: '',
          itemId: '',
          icon: '',
          health: 0,
          itsize: 0,
          slotable: 0,
          stackable: 0
        };
      } else if (from === 'weapons_right_slot' && inventorySlots.value.weapons) {
        inventorySlots.value.weapons[1] = {
          name: '',
          itemId: '',
          icon: '',
          health: 0,
          itsize: 0,
          slotable: 0,
          stackable: 0
        };
      } else if (from === 'head') {
        inventorySlots.value.head = null;
      } else if (from === 'vest') {
        inventorySlots.value.vest = null;
      } else if (from === 'clothesUp') {
        inventorySlots.value.clothesUp = null;
      } else if (from === 'clothesDown') {
        inventorySlots.value.clothesDown = null;
      } else if (from === 'shoes') {
        inventorySlots.value.shoes = null;
      } else if (from === 'food') {
        const delIndex = inventorySlots.value.food ? inventorySlots.value.food.findIndex((i) => i.itemId === drItem.itemId) : -1;
        if (delIndex !== -1 && inventorySlots.value.food) {
          inventorySlots.value.food.splice(delIndex, 1);
        }
      } else if (from === 'medicine') {
        const delIndex = inventorySlots.value.medicine ? inventorySlots.value.medicine.findIndex((i) => i.itemId === drItem.itemId) : -1;
        if (delIndex !== -1 && inventorySlots.value.medicine) {
          inventorySlots.value.medicine.splice(delIndex, 1);
        }
      } else if (from === 'accesories') {
        const delIndex = inventorySlots.value.accesories ? inventorySlots.value.accesories.findIndex((i) => i.itemId === drItem.itemId) : -1;
        if (delIndex !== -1 && inventorySlots.value.accesories) {
          inventorySlots.value.accesories.splice(delIndex, 1);
        }
      }

      function onMouseMove(event: MouseEvent) {
          // Переводим элемент в абсолютное позиционирование
          item.style.position = "absolute";
          item.style.zIndex = "1000";
          item.style.pointerEvents = "none";
          item.style.left = event.pageX - shiftX + 'px';
          item.style.top = event.pageY - shiftY + 'px';
          item.style.width = '60px';
          item.style.height = '60px';
          document.body.appendChild(item);
          //подсвечиваем элемент, на который можно положить предмет
          const target = event.target as HTMLElement;
          if (target) {
            //тут можно визуализировать что предмет не подходит для этого слота при наведении
            const isSideZone = ['dropzone_left', 'dropzone_right'].includes(target.id);
            const isDropzone = /^dropzone/i.test(target.id);
            if(isSideZone) {
              target.style.border = "2px dashed orange";
            } else if (isDropzone && !isSideZone) {
              target.style.borderColor = "orange";
            }
            target.onmouseout = () => {
              if(isSideZone) {
                target.style.border = "none";
              } else if (isDropzone && !isSideZone) {
                target.style.borderColor = "gray";
              }
            }
          }
      }
      function onMouseUp(event: MouseEvent) {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          const target = event.target as HTMLElement;
          if (target && /^dropzone/i.test(target.id) && drItem) {
            item.onmouseup = null;
            item.style.pointerEvents = "";
            item.remove();
            //кладем предмет в слот или боковые контейнеры
            const dropzone = target.id;
            if (dropzone === 'dropzone_garbage') {
              //удаляем предмет
              changeData('delete', drItem, from);
              return;
            } else if (dropzone === 'dropzone_left') {
              inventoryAround.value.push(drItem);
            } else if (dropzone === 'dropzone_right') {
              inventory.value.push(drItem);
            } else if (dropzone === 'dropzone_weapons_left') {
              if (!inventorySlots.value.weapons) {
                inventorySlots.value.weapons = [];
              }
              // if(drItem.type !== 'weapon') {
              //   return;
              // }
              inventorySlots.value.weapons[0] = drItem;
            } else if (dropzone === 'dropzone_weapons_right') {
              if (!inventorySlots.value.weapons) {
                inventorySlots.value.weapons = [];
              }
              // if(drItem.type !== 'weapon') {
              //   return;
              // }
              inventorySlots.value.weapons[1] = drItem;
            } else if (dropzone === 'dropzone_head') {
              inventorySlots.value.head = drItem;
            } else if (dropzone === 'dropzone_vest') {
              inventorySlots.value.vest = drItem;
            } else if (dropzone === 'dropzone_clothesUp') {
              inventorySlots.value.clothesUp = drItem;
            } else if (dropzone === 'dropzone_clothesDown') {
              inventorySlots.value.clothesDown = drItem;
            } else if (dropzone === 'dropzone_shoes') {
              inventorySlots.value.shoes = drItem;
            } else if (dropzone.includes('dropzone_food')) {
              if (!inventorySlots.value.food) {
                inventorySlots.value.food = [];
              }
              const putIndex = parseInt(dropzone.replace('dropzone_food', ''));
              inventorySlots.value.food[putIndex - 1] = drItem;
            } else if (dropzone.includes('dropzone_medicine')) {
              if (!inventorySlots.value.medicine) {
                inventorySlots.value.medicine = [];
              }
              const putIndex = parseInt(dropzone.replace('dropzone_medicine', ''));
              inventorySlots.value.medicine[putIndex - 1] = drItem;
            } else if (dropzone.includes('dropzone_accesories')) {
              if (!inventorySlots.value.accesories) {
                inventorySlots.value.accesories = [];
              }
              const putIndex = parseInt(dropzone.replace('dropzone_accesories', ''));
              inventorySlots.value.accesories[putIndex - 1] = drItem;
            }
          } else {
            //возвращаем предмет на место если опустили вне слота
            item.remove();
            if (from === 'stack') {
              inventoryAround.value.push(drItem);
            } else if (from === 'inventory') {
              inventory.value.push(drItem);
            } else if (from === 'weapons_left_slot' && inventorySlots.value.weapons) {
              inventorySlots.value.weapons[0] = drItem;
            } else if (from === 'weapons_right_slot' && inventorySlots.value.weapons) {
              inventorySlots.value.weapons[1] = drItem;
            } else if (from === 'head') {
              inventorySlots.value.head = drItem;
            } else if (from === 'vest') {
              inventorySlots.value.vest = drItem;
            } else if (from === 'clothesUp') {
              inventorySlots.value.clothesUp = drItem;
            } else if (from === 'clothesDown') {
              inventorySlots.value.clothesDown = drItem;
            } else if (from === 'shoes') {
              inventorySlots.value.shoes = drItem;
            } else if (from === 'food') {
              if (!inventorySlots.value.food) {
                inventorySlots.value.food = [];
              }
              if (fromIndex && fromIndex >= 0) {
                inventorySlots.value.food[fromIndex] = drItem;
              } else inventorySlots.value.food.push(drItem);
              
            } else if (from === 'medicine') {
              if (!inventorySlots.value.medicine) {
                inventorySlots.value.medicine = [];
              }
              if (fromIndex && fromIndex >= 0) {
                inventorySlots.value.medicine[fromIndex] = drItem;
              } else inventorySlots.value.medicine.push(drItem);
            } else if (from === 'accesories') {
              if (!inventorySlots.value.accesories) {
                inventorySlots.value.accesories = [];
              }
              if (fromIndex && fromIndex >= 0) {
                inventorySlots.value.accesories[fromIndex] = drItem;
              } else inventorySlots.value.accesories.push(drItem);
            }
          }
          draggedItem.value = null;
          draggedElement.value = null;
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      event.preventDefault();
    };

    //драгндроп html5 нативный (не работает)
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
      inventoryAround,
      inventorySlots,
      groupedInventoryAround,
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
      isVertical,
      checkOrientation,
      draggedItem,
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
  background-color: black;
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
  background-image: url('/bgi.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  background-color: black;
  /* display: flex;
  flex-direction: column;
  justify-content: space-between; */
}

.side-left, .side-right {
  flex-grow: 1;
}
.inventory-box.side-left {
  background-image: url('/bgl.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
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
.inventory-box h4 {
  color: whitesmoke;
  text-transform: uppercase;
}

.side-center > .inventory-container {
  padding: 0;
  margin: 0;
  gap: unset;
  justify-content: space-between;
}
.inventory-container {
  position: relative;
  display: flex;
  /* flex-wrap: wrap; */
  gap: 1rem;
  padding: 1rem;
  margin: 1rem;
  min-height: 35vh;
  height: 90%;
  overflow: auto;
  scrollbar-width: 10px;
  scrollbar-color: #c8c8c8;
}
/* scrollbar */
.inventory-container::-webkit-scrollbar {
  width: 10px;
	background-color: #c8c8c8;
  border-radius: 10px;
}
.inventory-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	border-radius: 10px;
	background-color: #a1a1a1;
}
.inventory-container::-webkit-scrollbar-thumb {
  border-radius: 10px;
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
	background-color: #2d2d2d;
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
  padding: 0.6rem;
  /* background-color: rgba(78, 75, 71, 0.911); */
}

.items-right {
  justify-content: right;
}

.inventory-side-item > img {
  width: auto;
  height: 60px;
  cursor: grab;
  background-color: rgba(72, 72, 72, 0.75);
}

.inventory-side-item > p {
  padding: 0 1rem;
  font-size: 1rem;
  text-align: center;
  color: white;
}

.equipment {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 17%;
  /* min-height: 20%; */
  /* flex-direction: column; */
  /* gap: 1rem; */
  /* min-width: 17%; */
  /* padding: 1rem; */
  /* background-image: url('/player_background.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 100%; */
}
.equipment-weapons {
  flex-grow: 2;
  min-height: 32%;
}
.equipment-accesories {
  background-image: url('/bgt.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.grid {
  display: grid;
  /* flex-grow: 2; */
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
  padding: 1rem;
}
.grid-two-fraction {
  grid-template-columns: 50% 50%;
  justify-content: center;
  justify-items: center;
}

.slot {
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed gray;
}
.slot > img {
  cursor: grab;
}
.slot.slot-x2 {
  width: 120px;
}
.slot.slot-x3 {
  width: 180px;
}
.slot-x3 > img {
  width: auto;
  height: auto;
}
.slot-bg-head {
  background-image: url('/inventory_slot_helm.png');
  background-color: rgba(72, 72, 72, 0.75);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.slot-bg-vest {
  background-image: url('/inventory_slot_backpack.png');
  background-color: rgba(72, 72, 72, 0.75);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.slot-bg-vest {
  background-image: url('/inventory_slot_vest.png');
  background-color: rgba(72, 72, 72, 0.75);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.slot-bg-clothes-up {
  background-image: url('/inventory_slot_clothes_up.png');
  background-color: rgba(72, 72, 72, 0.75);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.slot-bg-clothes-down {
  background-image: url('/inventory_slot_clothes_down.png');
  background-color: rgba(72, 72, 72, 0.75);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.slot-bg-shoes {
  background-image: url('/inventory_slot_shoes.png');
  background-color: rgba(72, 72, 72, 0.75);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.dropzone_garbage {
  position: absolute;
  bottom: -5rem;
  left: 0;
  width: 100%;
  height: 5rem;
  border: 2px dashed gray;
  background-color: rgba(232, 15, 15, 0.5);
  background-image: url('/inventory_bg_garbage.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60px 60px;
  z-index: 1000;
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