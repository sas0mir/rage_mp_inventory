<template>
  <div class="inventory">
    <!-- Список стэша -->
    <section class="inventory-box side-left">
      <h3>Окружение</h3>
      <div
        class="inventory-container container-column"
        :id="'dropzone_left'"
      >
        <div
          v-for="(group, idx) in groupedAround"
          :key="group.item.id + '-' + group.quantity"
          class="inventory-side-item"
          @mouseover="showLeftTooltip(group.item)"
          @mouseleave="hideTooltip"
          @mousedown="handleMouseDown('around', $event, group.item, idx)"
          :id="'movable_left' + group.item.id"
          @dblclick="handleDblClick('around', $event, group.item, idx)"
          @contextmenu="handleRightClick('around', $event, group.item)"
        >
          <img :src="group.item.icon" :alt="group.item.name"/>
          <p draggable="false">{{ group.item.name }}</p>
          <label class="inventory-side-label-left">{{ group.quantity }}</label>
        </div>
      </div>
      <!-- Tooltip -->
      <div v-if="tooltipLeftVisible" class="tooltip tooltip-left" :style="tooltipStyle">
        <h4>{{ tooltipItem.name }}</h4>
        <p>{{ tooltipItem.description }}</p>
        <p v-if="tooltipItem.description_full">{{ tooltipItem.description_full }}</p>
        <p>Занимает слотов : {{ calcSlots(tooltipItem.size, tooltipItem.stackable, tooltipItem.slotable) }}</p>
        <div class="tooltip-footer">
          <p>Состояние: {{ tooltipItem.health }}</p>
          <p>Размер: {{ tooltipItem.slotable }}</p>
        </div>
      </div>
    </section>

    <!-- Инвентарь игрока -->
    <section class="inventory-box side-center">
      <h3>Быстрые слоты</h3>
      <div class="inventory-container container-column inventory-space-between">
        <div class="equipment equipment-weapons">
          <h4>Оружие</h4>
          <div class="grid grid-two-fraction">
            <div
              class="slot slot-x3"
              :class="{with_arrow: inventorySlots.weapons_first && inventorySlots.weapons_first.health > 70}"
              :id="'dropzone_weapons_first'"
            >
              <img
                v-if="inventorySlots.weapons_first?.id"
                :src="inventorySlots.weapons_first.icon"
                :alt="inventorySlots.weapons_first.name"
                @mousedown="handleMouseDown('weapons_first', $event, inventorySlots.weapons_first)"
                @mouseover="showCenterTooltip(inventorySlots.weapons_first)"
                @mouseleave="hideTooltip"
                :id="'movable_weapons_first'"
                @dblclick="handleDblClick('weapons_first', $event, inventorySlots.weapons_first)"
                @contextmenu="handleRightClick('weapons_first', $event, inventorySlots.weapons_first)"
              />
            </div>
            <div
              class="slot slot-x3"
              :class="{with_arrow: inventorySlots.weapons_second && inventorySlots.weapons_second.health > 70}"
              :id="'dropzone_weapons_second'"
            >
              <img
                v-if="inventorySlots.weapons_second?.id"
                :src="inventorySlots.weapons_second.icon"
                :alt="inventorySlots.weapons_second.name"
                @mousedown="handleMouseDown('weapons_second', $event, inventorySlots.weapons_second)"
                @mouseover="showCenterTooltip(inventorySlots.weapons_second)"
                @mouseleave="hideTooltip"
                :id="'movable_weapons_second'"
                @dblclick="handleDblClick('weapons_second', $event, inventorySlots.weapons_second)"
                @contextmenu="handleRightClick('weapons_second', $event, inventorySlots.weapons_second)"
              />
            </div>
          </div>
          <div class="grid grid-one-fraction">
            <div
              class="slot slot-x3"
              :class="{with_arrow: inventorySlots.weapons_special && inventorySlots.weapons_special.health > 70}"
              :id="'dropzone_weapons_special'"
            >
              <img
                v-if="inventorySlots.weapons_special?.id"
                :src="inventorySlots.weapons_special.icon"
                :alt="inventorySlots.weapons_special.name"
                @mousedown="handleMouseDown('weapons_special', $event, inventorySlots.weapons_special)"
                @mouseover="showCenterTooltip(inventorySlots.weapons_special)"
                @mouseleave="hideTooltip"
                :id="'movable_weapons_special'"
                @dblclick="handleDblClick('weapons_special', $event, inventorySlots.weapons_special)"
                @contextmenu="handleRightClick('weapons_special', $event, inventorySlots.weapons_special)"
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
                :id="'movable_head'"
                @dblclick="handleDblClick('head', $event, inventorySlots.head)"
                @contextmenu="handleRightClick('head', $event, inventorySlots.head)"
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
                :id="'movable_vest'"
                @dblclick="handleDblClick('vest', $event, inventorySlots.vest)"
                @contextmenu="handleRightClick('vest', $event, inventorySlots.vest)"
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
                :id="'movable_clothesUp'"
                @dblclick="handleDblClick('clothesUp', $event, inventorySlots.clothesUp)"
                @contextmenu="handleRightClick('clothesUp', $event, inventorySlots.clothesUp)"
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
                :id="'movable_clothesDown'"
                @dblclick="handleDblClick('clothesDown', $event, inventorySlots.clothesDown)"
                @contextmenu="handleRightClick('clothesDown', $event, inventorySlots.clothesDown)"
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
                :id="'movable_shoes'"
                @dblclick="handleDblClick('shoes', $event, inventorySlots.shoes)"
                @contextmenu="handleRightClick('shoes', $event, inventorySlots.shoes)"
              />
            </div>
            <!-- <div class="slot" :class="{'slot-bg-backpack': !inventorySlots.backpack}" :id="'dropzone_backpack'">
              <img
                v-if="inventorySlots.backpack"
                :src="inventorySlots.backpack.icon"
                :alt="inventorySlots.backpack.name"
                @mouseover="showCenterTooltip(inventorySlots.backpack)"
                @mouseleave="hideTooltip"
                @mousedown="handleMouseDown('shoes', $event, inventorySlots.backpack)"
                :id="'movable_shoes' + inventorySlots.backpack.id"
              />
            </div> -->
          </div>
        </div>
        <div class="equipment equipment-food">
          <h4>Еда и напитки</h4>
          <div class="grid">
            <div
              class="slot"
              v-for="(item, idx) in inventorySlots.food"
              :key="idx"
              :id="`dropzone_food_${idx}`"
            >
              <template v-if="item?.item">
                <img
                  v-if="item?.item"
                  :src="item.item.icon"
                  :alt="item.item.name"
                  @mouseover="showCenterTooltip(item.item)"
                  @mouseleave="hideTooltip"
                  @mousedown="handleMouseDown('food', $event, item.item, idx)"
                  :id="'movable_food' + idx"
                  @dblclick="handleDblClick('food', $event, item.item, idx)"
                  @contextmenu="handleRightClick('food', $event, item.item)"
                />
                <label v-if="item?.quantity" class="equipment-quantity-label">{{ item.quantity }}</label>
              </template>
              <template v-else>
                <!-- пустой слот -->
                 <div class="empty-slot"></div>
              </template>
            </div>
          </div>
        </div>
        <div class="equipment equipment-medicine">
          <h4>Медикаменты</h4>
          <div class="grid">
            <div
              class="slot"
              v-for="(item, idx) in inventorySlots.medicine"
              :key="idx"
              :id="`dropzone_medicine_${idx}`"
            >
              <template v-if="item?.item">
                <img
                  v-if="item?.item"
                  :src="item.item.icon"
                  :alt="item.item.name"
                  @mouseover="showCenterTooltip(item.item)"
                  @mouseleave="hideTooltip"
                  @mousedown="handleMouseDown('medicine', $event, item.item, idx)"
                  :id="'movable_medicine' + idx"
                  @dblclick="handleDblClick('medicine', $event, item.item, idx)"
                  @contextmenu="handleRightClick('medicine', $event, item.item)"
                />
                <label v-if="item?.quantity" class="equipment-quantity-label">{{ item.quantity }}</label>
              </template>
              <template v-else>
                <!-- пустой слот -->
                 <div class="empty-slot"></div>
              </template>
            </div>
          </div>
        </div>
        <div class="equipment equipment-accesories">
          <h4></h4>
          <div class="grid">
            <div
              class="slot"
              v-for="(item, idx) in inventorySlots.other"
              :key="idx"
              :id="`dropzone_other_${idx}`"
            >
              <template v-if="item?.item">
                <img
                  v-if="item?.item"
                  :src="item.item.icon"
                  :alt="item.item.name"
                  @mouseover="showCenterTooltip(item.item)"
                  @mouseleave="hideTooltip"
                  @mousedown="handleMouseDown('other', $event, item.item, idx)"
                  :id="'movable_other' + idx"
                  @dblclick="handleDblClick('other', $event, item.item, idx)"
                  @contextmenu="handleRightClick('other', $event, item.item)"
                />
                <label v-if="item?.quantity" class="equipment-quantity-label">{{ item.quantity }}</label>
              </template>
              <template v-else>
                <!-- пустой слот -->
                 <div class="empty-slot"></div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <!-- Tooltip -->
      <div v-if="tooltipCenterVisible" class="tooltip tooltip-left" :style="tooltipStyle">
        <h4>{{ tooltipItem.name }}</h4>
        <p>{{ tooltipItem.description }}</p>
        <p v-if="tooltipItem.description_full">{{ tooltipItem.description_full }}</p>
        <p>Занимает слотов : {{ calcSlots(tooltipItem.size, tooltipItem.stackable, tooltipItem.slotable) }}</p>
        <div class="tooltip-footer">
          <p>Состояние: {{ tooltipItem.health }}</p>
          <p>Размер: {{ tooltipItem.slotable }}</p>
        </div>
      </div>
    </section>

    <!-- Рюкзак -->
    <section class="inventory-box side-right">
      <h3>Инвентарь ({{ inventorySize + ' / ' + backpackSize }})</h3>
      <div class="inventory-container container-column" :id="'dropzone_right'">
        <div
          v-for="(group, idx) in groupedInventory"
          :key="group.item.id + '-' + group.quantity"
          class="inventory-side-item items-right"
          @mouseover="showRightTooltip(group.item)"
          @mouseleave="hideTooltip"
          @mousedown="handleMouseDown('inventory', $event, group.item, idx)"
          :id="'movable_right' + group.item.id"
          @dblclick="handleDblClick('inventory', $event, group.item, idx)"
          @contextmenu="handleRightClick('inventory', $event, group.item)"
        >
          <p draggable="false">{{ group.item.name }}</p>
          <label class="inventory-side-label-right">{{ group.quantity }}</label>
          <img :src="group.item.icon" :alt="group.item.name"/>
        </div>
      </div>
      <!-- Tooltip -->
      <div v-if="tooltipRightVisible" class="tooltip tooltip-right" :style="tooltipStyle">
        <h4>{{ tooltipItem.name }}</h4>
        <p>{{ tooltipItem.description }}</p>
        <p v-if="tooltipItem.description_full">{{ tooltipItem.description_full }}</p>
        <p>Занимает слотов : {{ calcSlots(tooltipItem.size, tooltipItem.stackable, tooltipItem.slotable) }}</p>
        <div class="tooltip-footer">
          <p>Состояние: {{ tooltipItem.health }}</p>
          <p>Размер: {{ tooltipItem.slotable }}</p>
        </div>
      </div>
      <button class="logger-btn" @click="activateLogger">{{ isActiveLogger ? 'Logger+' : 'Logger-' }}</button>
    </section>
    <div
        v-if="showLogger"
        class="logger"
        @mouseenter="cancelAutoHideLogger"
        @mouseleave="returnAutoHideLogger"
      >
        <p v-for="(log, index) in logs" :key="index">{{ log }}</p>
      </div>
      
  </div>
  <ContextMenu
      :visible="contextMenuVisible"
      :position="contextMenuPosition"
      :from="contextFromProp"
      :item="contextItemProp"
    />
</template>

<script lang="ts">
import { onMounted, ref, computed, onUnmounted, reactive, watch } from "vue";
import { useInventoryItemsStore, type InventoryItem, type EquippedItems, type EquippedItemsKeys } from "../stores/inventory_items";
import { useLogger } from "../stores/logger";
import { mockAroundItems, mockInventoryItems } from "../constants/mockData";
import ContextMenu from "./contextMenu.vue"
import { storeToRefs } from "pinia";

export default {
  name: "UserInventory",
  components: {
    ContextMenu
  },
  setup() {
    //тут подключить библиотеку mp
    const mp = null; 
    //стор для всех данных и работы с ними
    const inventoryItemsStore = useInventoryItemsStore();
    const { setAround, setInventory, setEquippedItems } = inventoryItemsStore;
    const { equippedItems, aroundItems, inventoryItems } = storeToRefs(inventoryItemsStore)
    //стор с логами (действия в инвентаре)
    const loggerStore = useLogger();
    const { setLog, clearLogs } = loggerStore;
    //Данные для рендера 3х блоков инвентаря
    const inventory = ref<InventoryItem[]>([]);
    const around = ref<InventoryItem[]>([]);
    const inventorySlots = ref<EquippedItems>({
      weapons_first: null,
        weapons_second: null,
        weapons_special: null,
        head: null,
        vest: null,
        clothesUp: null,
        clothesDown: null,
        shoes: null,
        food: [null, null, null, null, null, null, null],
        medicine: [null, null, null, null, null, null, null],
        other: [null, null, null, null, null, null],
    });
    //логгер
    const logs = ref<string[]>([]);
    const isActiveLogger = ref(true);
    const showLogger = ref(false);
    let hideLoggerTimer: ReturnType<typeof setTimeout>;; //таймер скрытия логов
    const isLoggerHovered = ref(false);
    //тип для всех параметров from
    type ValidFrom = "around" | "inventory" | EquippedItemsKeys;
    //пропсы контекстного меню на правый клик
    const contextMenuVisible = ref(false);
    const contextMenuPosition = ref({ top: "0px", left: "0px" });
    const contextFromProp = ref<string>('');
    const contextItemProp = ref<InventoryItem>({} as InventoryItem);

    const loadData = async () => {
      try {
        //если мы в игре подгружаем реальные данные
        if (mp) {
          //setAround(mp.trigger(получение предметов окружения)); //левый список
          //setInventory(получение предметов инвентаря)); //правый список
        } else {
          //Подгружаем мок данные из стора если нет реальных
          setAround('init', mockAroundItems);
          setInventory('init', mockInventoryItems);
        }
        //если пришла расстановка предметов из игры или есть в сторе то ставим их
        const inGameSlots = null;//mp.trigger(getEquippedItems);
        if (inGameSlots) {
          inventorySlots.value = inGameSlots;
        } else {
          //если расставленные слоты не пришли, то заполняем их в setEquippedStore
          setEquippedItems('init', inventory.value);
        }
      } catch (error) {
        console.error('Ошибка получения предметов->', error);
      }
    }

    onMounted(() => {
      loadData();
    });

    onUnmounted(() => {
      //Очищаем данные при уничтожении компонента
      inventory.value = [];
      around.value = [];
      inventorySlots.value = {
        weapons_first: null,
        weapons_second: null,
        weapons_special: null,
        head: null,
        vest: null,
        clothesUp: null,
        clothesDown: null,
        shoes: null,
        food: [],
        medicine: [],
        other: [],
      };
      setEquippedItems('clear', []);
      setAround('clear', []);
      setInventory('clear', []);
      clearLogs();
    });

    watch(
      () => inventorySlots.value.food,
      (newFood) => {
        console.log('FOOD->', newFood[0], newFood)
      }, {deep: true}
    )

    //отслеживаем изменения в сторе и перерисовываем инвентарь
    watch(
      () => equippedItems,
      (newSlots) => {
        if (newSlots.value) {
          console.log('WATCH-EQUIP-1->', newSlots.value.food);
          inventorySlots.value = {...newSlots.value};
        }
      }, {deep: true}
    );
    watch(
      () => aroundItems,
      (newAround) => {
        if (newAround.value) {
          around.value = newAround.value;
        }
      }, {deep: true}
    );
    watch(
      () => inventoryItems,
      (newInventory) => {
        if (newInventory.value) {
          inventory.value = newInventory.value;
        }
      }, {deep: true}
    );
    watch(
      () => loggerStore.logs,
      (newLogs, oldLogs) => {
        logs.value = [...newLogs].reverse();
        if (newLogs.length && oldLogs && isActiveLogger.value) {
          showLogger.value = true;
          startAutoHideLogger();
        }
      }, {deep: true}
    );
    // watch(
    //   () => tooltipItem.value,
    //   (newTooltipiten, oldTooltipitem) => {
    //     console.log('TOOLTIP->', newTooltipiten, oldTooltipitem, tooltipLeftVisible.value, tooltipRightVisible.value, tooltipCenterVisible.value)
    //   }
    // )

    //работа логгера
    const activateLogger = () => {
      if (isActiveLogger.value) {
        showLogger.value = false;
        isActiveLogger.value = false;
      } else isActiveLogger.value = true;
    }
    const startAutoHideLogger = () => {
      if (isLoggerHovered.value) return; //курсор на логгере
      hideLoggerTimer = setTimeout(() => {
        showLogger.value = false;
      }, 3000);
    }
    const cancelAutoHideLogger = () => {
      isLoggerHovered.value = true;
      clearTimeout(hideLoggerTimer);
    }
    const returnAutoHideLogger = () => {
      isLoggerHovered.value = false;
      startAutoHideLogger();
    }

    //вычисляем количество слотов
    const calcSlots = (size: number, stackable: number, slotable: number) => {
      //количество делим на "размер стака" и умножаем на "количество слотов на один стак"
      if (!stackable || stackable < 1) {
        //не стакается
        return size * slotable
      } else {
        if (size % stackable === 0) {
          return Math.ceil(size / stackable) * slotable;
        } else {
          return (Math.ceil(size / stackable) * slotable) + slotable;
        }
      }
    }

    //размер рюкзака в инвентаре
    const backpackSize = computed(() => {
      if (inventory.value.length) {
        const biggestBackpack = inventory.value.reduce((max, item) => 
          /рюкзак|сумка/ig.test(item.name) && item.size > max.size ? item : max
        )
        return biggestBackpack.size
      } else return 10
    });

    //размер всего стака в инвентаре
    const inventorySize = computed(() => {
      if (inventory.value.length) {
        let counter = 0;
        for (let i = 0; i < inventory.value.length; i++) {
          counter += calcSlots(inventory.value[i].size, inventory.value[i].stackable, inventory.value[i].slotable)
        }
        return counter
      } else return 0
    })

    // Группировка предметов
    const groupedAround = computed(() => {
      const groups: { item: InventoryItem; quantity: number }[] = [];
      around.value.forEach((item) => {
        const existIndex = groups.findIndex((el) => el.item.id === item.id);
        if (existIndex >= 0) {
          groups[existIndex].quantity++;
        } else {
          groups.push({item, quantity: 1});
        }
      });
      return groups;
    });
    const groupedInventory = computed(() => {
      const groups: { item: InventoryItem; quantity: number }[] = [];
      inventory.value.forEach((item) => {
        const existIndex = groups.findIndex((el) => el.item.id === item.id);
        if (existIndex >= 0) {
          groups[existIndex].quantity++;
        } else {
          groups.push({item, quantity: 1});
        }
      });
      return groups;
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
      stackable: 0,
      category: ''
    });
    const tooltipStyle = ref({});
    const showLeftTooltip = (item: InventoryItem) => {
      if (!item || draggedElement.value) return
      tooltipItem.value = item;
      tooltipLeftVisible.value = true;
    };
    const showRightTooltip = (item: InventoryItem) => {
      if (!item || draggedElement.value) return
      tooltipItem.value = item;
      tooltipRightVisible.value = true;
    };
    const showCenterTooltip = (item: InventoryItem | null) => {
      if (!item || draggedElement.value) return
      tooltipItem.value = item;
      tooltipCenterVisible.value = true;
    };
    const hideTooltip = () => {
      tooltipLeftVisible.value = false;
      tooltipRightVisible.value = false;
      tooltipCenterVisible.value = false;
    };

    const checkDropCompatibility = (itemCategory: string | undefined, dropzoneCategory: string | undefined) => {
      if (dropzoneCategory === 'dropzone_left' || dropzoneCategory === 'dropzone_right') {
        return true
      }
      if (!dropzoneCategory || !itemCategory) return false
      return dropzoneCategory.includes(itemCategory);
    }

    //final dragndrop version
    const draggedElement = ref<HTMLElement | null>(null);
    const draggedItem = ref<{ from: string, item: InventoryItem } | null>(null);
    const dragOffset = reactive({ x: 0, y: 0 });
    let clickTimeout: ReturnType<typeof setTimeout>;

    const handleMouseDown = (from: ValidFrom, event: MouseEvent, drItem: InventoryItem, fromIndex?: number) => {
      event.preventDefault();
      if (event.button === 2) return;
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        if (event.button === 0 && drItem) {
          hideTooltip();
          const target = event.target as HTMLElement;
          const item = target.closest("[id*='movable']") as HTMLElement;
          const itemStackSize = calcSlots(drItem.size, drItem.stackable, drItem.slotable);
          const isEnoughPlace = itemStackSize + inventorySize.value <= backpackSize.value;
          if (!item) return;

          // Устанавливаем перетаскиваемый элемент
          draggedElement.value = item;
          draggedItem.value = { from, item: drItem };
          let movedItemDeleted = false;

          // Сохраняем смещение курсора относительно элемента
          const rect = item.getBoundingClientRect();
          dragOffset.x = event.clientX - rect.left;
          dragOffset.y = event.clientY - rect.top;
          const shiftX = event.clientX - rect.left;
          const shiftY = event.clientY - rect.top;

          function onMouseMove(event: MouseEvent) {
              // Удаляем предмет из прошлого расположения (объект inventorySlots | around | inventory)
              if (!movedItemDeleted) {
                if (from === 'around') {
                  setAround('delete', [drItem]);
                  movedItemDeleted = true;
                } else if (from === 'inventory') {
                  setInventory('delete', [drItem]);
                  movedItemDeleted = true;
                } else {
                  setEquippedItems('delete', [drItem], drItem?.category as keyof EquippedItems, fromIndex);
                  movedItemDeleted = true;
                }
              }
              // Переводим элемент в абсолютное позиционирование
              item.style.position = "absolute";
              item.style.zIndex = "1000";
              item.style.pointerEvents = "none";
              document.body.appendChild(item);
              item.style.left = event.pageX - shiftX + 'px';
              item.style.top = event.pageY - shiftY + 'px';
              item.style.width = '80px';
              item.style.height = '80px';
              //подсвечиваем элемент, на который можно положить предмет
              const target = event.target as HTMLElement;
              if (target) {
                console.log('TARGET->', target.id);
                if (/^movable/ig.test(target.id)) {
                  console.log('NO-POINTER');
                  target.style.pointerEvents = 'none';
                }
                const isSideZone = ['dropzone_left', 'dropzone_right'].includes(target.id);
                const isDropzone = /^dropzone/i.test(target.id);
                //проверка подходит ли перетаскиваемый предмет в слот по category и по размеру рюкзака
                const isCompatible = checkDropCompatibility(drItem?.category, target.id);
                if(isSideZone) {
                  target.style.border = isCompatible && isEnoughPlace ? "2px dashed orange" : "2px dashed red";
                } else if (isDropzone && !isSideZone) {
                  target.style.borderColor = isCompatible && isEnoughPlace ? "orange" : "red";
                }
                target.onmouseout = () => {
                  if(isSideZone) {
                    target.style.border = "none";
                  } else if (isDropzone && !isSideZone) {
                    target.style.borderColor = "gray";
                  }
                  if (/^movable/ig.test(target.id)) {
                    target.style.pointerEvents = 'auto'
                  }
                }
              }
          }
          function onMouseUp(event: MouseEvent) {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
              const target = event.target as HTMLElement;
              if (target && /^dropzone/i.test(target.id) && drItem && checkDropCompatibility(drItem.category, target.id)) {
                item.onmouseup = null;
                item.style.pointerEvents = "auto";
                //target.appendChild(item);
                item.remove();
                
                const dropzone = target.id;
                //отменяем перенос если места в рюкзаке нет
                if (from === 'around' && dropzone !== 'dropzone_left' && !isEnoughPlace) {
                  setAround('add', [drItem]);
                  setLog(`Перемещение ${drItem?.name} не удалось, рюкзак полон. ${new Date().getHours() + ':' + new Date().getMinutes()}`)
                }
                //кладем предмет в слот или боковые контейнеры
                if (dropzone === 'dropzone_left') {
                  setAround('add', [drItem]);
                } else if (dropzone === 'dropzone_right') {
                  setInventory('add', [drItem]);
                } else if (dropzone === 'dropzone_weapons_first') {
                  setEquippedItems('add', [drItem], 'weapons_first');
                  //todo if (from === around) setInventory(add, item)++
                } else if (dropzone === 'dropzone_weapons_second') {
                  setEquippedItems('add', [drItem], 'weapons_second');
                } else if (dropzone === 'dropzone_weapons_special') {
                  setEquippedItems('add', [drItem], 'weapons_special');
                }else if (dropzone === 'dropzone_head') {
                  setEquippedItems('add', [drItem], 'head');
                } else if (dropzone === 'dropzone_vest') {
                  setEquippedItems('add', [drItem], 'vest');
                } else if (dropzone === 'dropzone_clothesUp') {
                  setEquippedItems('add', [drItem], 'clothesUp');
                } else if (dropzone === 'dropzone_clothesDown') {
                  setEquippedItems('add', [drItem], 'clothesDown');
                } else if (dropzone === 'dropzone_shoes') {
                  setEquippedItems('add', [drItem], 'shoes');
                } else if (dropzone.includes('dropzone_food')) {
                  const putIndex = parseInt(dropzone.replace('dropzone_food_', ''));
                  setEquippedItems('add', [drItem], 'food', putIndex);
                } else if (dropzone.includes('dropzone_medicine')) {
                  const putIndex = parseInt(dropzone.replace('dropzone_medicine_', ''));
                  setEquippedItems('add', [drItem], 'medicine', putIndex);
                } else if (dropzone.includes('dropzone_accesories')) {
                  const putIndex = parseInt(dropzone.replace('dropzone_other_', ''));
                  setEquippedItems('add', [drItem], 'other', putIndex);
                }
                //если положили в экипировку, также кладем в инвентарь
                // if (from === 'around' && dropzone !== 'dropzone_right') {
                //   setInventory('add', [drItem])
                // }
              } else {
                //возвращаем предмет на место если опустили вне слота
                item.remove();
                if (from === 'around') {
                  setAround('add', [drItem]);
                } else if (from === 'inventory') {
                  setInventory('add', [drItem]);
                } else {
                  setEquippedItems('add', [drItem], from, fromIndex);
                }
              }
              setLog(`Перемещение ${drItem?.name} из ${from} в ${target.id} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
              draggedItem.value = null;
              draggedElement.value = null;
          }

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);

          event.preventDefault();
        }
      }, 300);
    };

    //использование предмета на даблклик
    const handleDblClick = (from: ValidFrom, event: MouseEvent, item: InventoryItem, fromIndex?: number) => {
      clearTimeout(clickTimeout);
      if (mp) {
        //mp.trigger(использование предмета)
        //если мп возвращает промис, то можно использовать async await или then для удаления использованного предмета
        //удаляем использованный предмет
        if (from === 'around') {
          setAround('delete', [item], fromIndex);
        } else if (from === 'inventory') {
          setInventory('delete', [item], fromIndex);
        } else {
          setEquippedItems('delete', [item], from);
        }
        setLog(`Использование ${item?.name} из ${from} ${new Date().getHours() + ':' + new Date().getMinutes()}`)
      }
    }

    const handleRightClick = (from: string, event: MouseEvent, item: InventoryItem) => {
      //отменяем вызов браузерного контекстного меню
      event.preventDefault();
      contextFromProp.value = from;
      contextItemProp.value = item;
      contextMenuVisible.value = true;
      contextMenuPosition.value = {
        top: event.clientY + 'px',
        left: event.clientX + 'px',
      };
    }

    // Скрыть меню при клике в любом месте
    const hideContextMenu = () => {
      contextMenuVisible.value = false;
    };
    document.addEventListener("click", hideContextMenu);

    return {
      inventory,
      around,
      inventorySlots,
      groupedAround,
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
      handleDblClick,
      handleRightClick,
      isVertical,
      checkOrientation,
      draggedItem,
      calcSlots,
      backpackSize,
      inventorySize, 
      showLogger,
      logs,
      isActiveLogger,
      activateLogger,
      startAutoHideLogger,
      cancelAutoHideLogger,
      returnAutoHideLogger,
      contextMenuVisible,
      contextMenuPosition,
      contextFromProp,
      contextItemProp
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
  height: 45%;
  margin: auto;
  border-radius: 1rem;
  /* padding: 2rem; */
  font-family: "Roboto", serif;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;;
}

.inventory-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  height: 100%;
}

.side-center {
  /* flex-grow: 2; */
  width: 50%;
  height: 100%;
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
  /* flex-grow: 1; */
  width: 25%;
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
  /* height: 10%; */
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
  /* gap: 1rem; */
  margin: 1rem;
  /* margin: 1rem; */
  /* min-height: 35vh; */
  min-height: 90%;
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
.inventory-space-between {
  justify-content: space-between;
}
.container-column {
  flex-direction: column;
}

.inventory-side-item {
  position: relative;
  display: flex;
  justify-content: left;
  align-items: center;
  width: 90%;
  height: fit-content;
  margin-bottom: 0.5rem;
  transition: transform .2s;
  /* padding: 0.6rem; */
  /* background-color: rgba(78, 75, 71, 0.911); */
}
.inventory-side-item:hover {
  cursor: grab;
  transform: scale(1.1);
}

.items-right {
  justify-content: right;
}

.inventory-side-item > img {
  width: auto;
  height: 60px;
  cursor: grab;
  background-color: black;
}

.inventory-side-item > p {
  padding: 0 1rem;
  font-size: 1rem;
  text-align: center;
  color: white;
}
.inventory-side-label-left {
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  color: white;
  font-size: 1rem;
  font-weight: bold;
}
.inventory-side-label-right {
  position: absolute;
  top: 0;
  right: 0;
  background-color: black;
  color: white;
  font-size: 1rem;
  font-weight: bold;
}

.equipment {
  display: flex;
  flex-direction: column;
  min-height: 15%;
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
.equipment h4 {
  text-align: center;
}
.equipment-overflow {
  overflow: auto;
}
.equipment-weapons {
  height: 25%;
}
.equipment-overflow {
  height: 60%;
}
.equipment-accesories {
  height: 15%;
  background-image: url('/bgt.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.equipment-quantity-label {
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  color: white;
  font-size: 1rem;
  font-weight: bold;
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
.grid-one-fraction {
  grid-template-columns: 50%;
  justify-content: center;
  justify-items: center;
}

.slot {
  position: relative;
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
  height: 60px;
}
.slot.with_arrow {
  background-image: url('/arrow.png');
  background-repeat: no-repeat;
  background-position: right;
  background-size: auto 100%;
}
.slot-bg-head {
  background-image: url('/inventory_slot_helm.png');
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
.slot-bg-backpack {
  background-image: url('/inventory_slot_backpack.png');
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

/* logger */
.logger-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  cursor: pointer;
  font-size: 1rem;
  color: green;
  background-color: black;
  padding: 0.1rem;
  border-radius: 0.3rem;
  border: none;
}
.logger {
  position: absolute;
  bottom: -10rem;
  right: 1rem;
  height: 9rem;
  width: 25rem;
  background-color: #1b1b1bcb;
  padding: 0.5rem;
  overflow: auto;
  z-index: 1000;
  transition: opacity 0.3s ease-in-out;
}
.logger p {
  font-family: monospace;
  color: rgb(12, 176, 12);
  border-bottom: 1px solid green;
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