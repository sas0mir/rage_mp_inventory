<template>
  <div class="inventory">
    <!-- Список стэша -->
    <section class="inventory-box side-left">
      <h3>Окружение ({{ aroundSize + ' / ' + aroundCapacity }})</h3>
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
          <img :src="group.item.icon" :alt="group.item.name" :class="/^weapons/i.test(group.item.category) ? 'double_image' : ''"/>
          <p draggable="false">{{ group.item.name }}</p>
          <label class="inventory-side-label-left">{{ group.quantity }}</label>
          <img :src="'./arrow.png'" :alt="''" class="left-arrow" @click="handleArrowClick('left', group.item, $event)">
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

    <!-- Быстрые слоты -->
    <section class="inventory-box side-center">
      <h3>Быстрые слоты</h3>
      <div class="inventory-container container-column inventory-space-between">
        <div class="equipment equipment-weapons">
          <h4>Оружие</h4>
          <div class="grid grid-two-fraction">
            <div
              class="slot slot-x3"
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
        </div>
        <div class="equipment equipment-weapons">
          <h4></h4>
          <div class="grid grid-one-fraction">
            <div
              class="slot slot-x3"
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
                @mousedown="handleMouseDown('backpack', $event, inventorySlots.backpack)"
                :id="'movable_backpack'"
                @dblclick="handleDblClick('backpack', $event, inventorySlots.backpack)"
                @contextmenu="handleRightClick('backpack', $event, inventorySlots.backpack)"
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
                  @mousedown="handleMouseDown('food', $event, item.item, idx, ['dropzone_left', 'dropzone_right'])"
                  :id="'movable_food_' + idx"
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
                  @mousedown="handleMouseDown('medicine', $event, item.item, idx, ['dropzone_left', 'dropzone_right'])"
                  :id="'movable_medicine_' + idx"
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
                  @mousedown="handleMouseDown('other', $event, item.item, idx, ['dropzone_left', 'dropzone_right'])"
                  :id="'movable_other_' + idx"
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
          <img :src="'./arrow.png'" :alt="''" class="right-arrow" v-on:click="handleArrowClick('right', group.item, $event)">
          <p draggable="false">{{ group.item.name }}</p>
          <label class="inventory-side-label-right">{{ group.quantity }}</label>
          <img :src="group.item.icon" :alt="group.item.name" :class="/^weapons/i.test(group.item.category) ? 'double_image' : ''"/>
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
      <button class="logger-btn" :class="isActiveLogger ? 'logger-btn-active' : ''" @click="activateLogger">
        <img :src="'./logger-btn-icon.png'" :alt="'logger'" />
      </button>
      <button class="indicator-btn" :class="isActiveIndicator ? 'logger-btn-active' : ''" @click="activateIndicator">
        <img :src="'./indicator-btn-icon.png'" :alt="'indicator'" />
      </button>
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
      @contextEvent="handleContextUsage"
    />
</template>

<script lang="ts">
import { onMounted, ref, computed, onUnmounted, reactive, watch } from "vue";
import { type InventoryItem, type EquippedItems, type EquippedItemsKeys } from "../stores/inventory_items";
import { useLogger } from "../stores/logger";
import { mockAroundItems, mockInventoryItems } from "../constants/mockData";
import ContextMenu from "./contextMenu.vue"

export default {
  name: "UserInventory",
  components: {
    ContextMenu
  },
  emits: [],
  setup() {
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
    //индикатор состояния перетаскивания предмета
    const isDragComplete = ref(true);
    //логгер
    const logs = ref<string[]>([]);
    const isActiveLogger = ref(true);
    const isActiveIndicator = ref(false);
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
    //для для остановки срабатывания драгндропа на нажатие стрелки
    const isArrowClicked = ref(false);
    //вместимость окружения (машина, сундук...)
    const aroundCapacity = ref(0);
    //мап для вычиления вместимости рюкзака
    const backpackSizes = new Map([
    ["Рюкзак-XS", 10],
    ["Рюкзак-L", 12],
    ["Сумка-XS", 14],
    ["Сумка-S", 16],
    ["Рюкзак-Зеленый", 50],
    ["Сумка-XXL", 19],
    ["Сумка-Пучи", 20],
    ["Рюкзак-Берген", 73],
    ["Рюкзак-Городской", 35],
    ["Рюкзак-Койот", 40],
    ["Рюкзак-Тактик", 56],
    ["Рюкзак-Тортила", 43],
    ["Рюкзак-Бореалес", 38],
    ["Сумка-Спортивная", 30],
    ["Рюкзак-Калифорния", 45],
    ["Сумка-Талун", 15],
    ["Сумка-Оружейная", 20],
    ["Рюкзак-Камуфляжный", 28]
    ]);

    const loadData = async () => {
      try {
        //если мы в игре подгружаем реальные данные
        if (mp) {
          mp.events.add("initSlots", (mpData: string) => setInventorySlots('init', JSON.parse(mpData)));
          mp.events.add("openVueInventory", (mpData: string) => setInventory('init', JSON.parse(mpData)));
          mp.events.add("openVueInventoryAround", (mpData:string) => setAround('init', JSON.parse(mpData)));
          mp.events.add("clearLastInventory", () => clearInventory());
        } else {
          //Подгружаем мок данные из стора если нет реальных
          setAround('init', mockAroundItems);
          setInventory('init', mockInventoryItems);
          setInventorySlots('init', inventory.value);
        }
        //хардкод вместимости окружения
        aroundCapacity.value = 100;
      } catch (error) {
        setLog('Ошибка подгрузки с MP ->' + error);
      }
    }

    const clearInventory = () => {
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
      setInventorySlots('clear', []);
      setAround('clear', []);
      setInventory('clear', []);
      clearLogs();
    }

    onMounted(() => {
      loadData();
    });

    onUnmounted(() => {
      clearInventory();
    });

    //init, clear, add, delete для каждой зоны (Окружение/Экипировка/Инвентарь)
    function setAround(action: string, items: InventoryItem[], _idx?: number) {
        console.log(_idx);
        if (action === 'init' && items) {
            around.value = items;//.sort(sortItemsLists);
        } else if (action === 'delete' && items[0]) {
            const delIndex = around.value.findIndex(el => el && el.id === items[0]?.id);
            if (delIndex > -1) {
                around.value.splice(delIndex, 1);
            }
        } else if (action === 'clear') {
            around.value = [];
        } else if (action === 'add') {
            around.value.push(items[0]);
            //aroundItems.value.sort(sortItemsLists);
        }
    }
    function setInventory(action: string, items: InventoryItem[], _idx?: number) {
        console.log(_idx);
        if (action === 'init' && items) {
            inventory.value = items;//.sort(sortItemsLists);
        } else if (action === 'delete' && items[0]) {
            const delIndex = inventory.value.findIndex(el => el && el.id === items[0]?.id);
            if (delIndex > -1) {
                inventory.value.splice(delIndex, 1);
            }
        } else if (action === 'clear') {
            inventory.value = [];
        } else if (action === 'add') {
            inventory.value.push(items[0]);
            // inventoryItems.value.sort(sortItemsLists);
        }
    }
    function setInventorySlots(action: string, items: InventoryItem[], category?: EquippedItemsKeys, index?: number) {
        if (action === 'init') {
            const inventoryItems = items.length ? items : inventory.value;
            if (inventoryItems) {
                inventoryItems.map(item => {
                    if (
                        item.category === 'food' ||
                        item.category === 'medicine' ||
                        item.category === 'other'
                    ) {
                        if (inventorySlots.value[item.category].length) {
                            const pushIndex = inventorySlots.value[item.category].findIndex((el) => el?.item.name === item.name);
                            const nullIndex = inventorySlots.value[item.category].findIndex((el) => el === null);
                            if (
                                pushIndex >= 0 &&
                                inventorySlots.value[item.category][pushIndex] !== null &&
                                inventorySlots.value[item.category][pushIndex]?.quantity
                            ) {
                                inventorySlots.value[item.category][pushIndex]!.quantity ++
                            } else if (nullIndex >= 0) {
                                inventorySlots.value[item.category][nullIndex] = ({item, quantity: 1})
                            }
                        }
                    } else if (
                        item.category === 'weapons_first' ||
                        item.category === 'weapons_second' ||
                        item.category === 'weapons_special' ||
                        item.category === 'head' ||
                        item.category === 'vest' ||
                        item.category === 'clothesUp' ||
                        item.category === 'clothesDown' ||
                        item.category === 'shoes'
                    ) {
                        inventorySlots.value[item.category] = item;
                        const fastSlot = item.category === 'weapons_first' ? 'One' :
                        item.category === 'weapons_second' ? 'Two' :
                        item.category === 'weapons_special' ? 'Three' : '';
                        if (fastSlot) {
                          trigger(`setSlot${fastSlot}`, item);
                        }
                    } 
                    // else if (item.category === 'backpack') {
                    //     //вешаем самый большой по size рюкзак
                    //     if (inventorySlots.value.backpack !== null && item.size > inventorySlots.value.backpack.size) {
                    //         inventorySlots.value.backpack = item;
                    //     } else if (inventorySlots.value.backpack === null) {
                    //         inventorySlots.value.backpack = item;
                    //     }
                    // }
                })
            }
        } else if (action === 'refresh') {
            const inventoryItems = inventory.value;
            if (inventoryItems) {
                inventorySlots.value.food = [null, null, null, null, null, null, null];
                inventorySlots.value.medicine = [null, null, null, null, null, null, null];
                inventorySlots.value.other = [null, null, null, null, null, null];
                inventoryItems.map(item => {
                    if (
                        item.category === 'food' ||
                        item.category === 'medicine' ||
                        item.category === 'other'
                    ) {
                        if (inventorySlots.value[item.category].length) {
                            const pushIndex = inventorySlots.value[item.category].findIndex((el) => el?.item.name === item.name);
                            const nullIndex = inventorySlots.value[item.category].findIndex((el) => el === null);
                            if (
                                pushIndex >= 0 &&
                                inventorySlots.value[item.category][pushIndex] !== null &&
                                inventorySlots.value[item.category][pushIndex]?.quantity
                            ) {
                                inventorySlots.value[item.category][pushIndex]!.quantity ++
                            } else if (nullIndex >= 0) {
                                inventorySlots.value[item.category][nullIndex] = ({item, quantity: 1})
                            }
                        }
                    }
                })
            }
        } else if (action === 'delete' && items[0] && category) {
            if (
                category === 'food' ||
                category === 'medicine' ||
                category === 'other'
            ) {
                const delIndex = index !== undefined && index >= 0 ?
                    index :
                    inventorySlots.value[category].findIndex(el => el !== null && el.item && el.item.id === items[0]?.id);
                if (
                    inventorySlots.value[category][delIndex] !== null &&
                    inventorySlots.value[category][delIndex].quantity > 1) 
                {
                    inventorySlots.value[category].splice(delIndex, 1, {item: items[0], quantity: inventorySlots.value[category][delIndex].quantity - 1});
                } else {
                    inventorySlots.value[category].splice(delIndex, 1, null);
                }
            } else {
                inventorySlots.value[category] = null;
                const fastSlot = category === 'weapons_first' ? 'One' :
                  category === 'weapons_second' ? 'Two' :
                  category === 'weapons_special' ? 'Three' : '';
                if (fastSlot) {
                  trigger(`removeSlot${fastSlot}`, items[0]);
                }
            }
        } else if (action === 'clear') {
            inventorySlots.value = {
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
            }
            //if (inventoryItems.value.length) inventoryItems.value = []
        } else if (action === 'add') {
            if (
                category === 'food' ||
                category === 'medicine' ||
                category === 'other'
            ) {
                if (index !== undefined && inventorySlots.value[category][index] === null) {
                    inventorySlots.value[category].splice(index, 1, {item: items[0], quantity: 1});
                } else if (index !== undefined && inventorySlots.value[category][index]?.quantity) {
                    //если слот занят
                    if (inventorySlots.value[category][index].item.name === items[0].name) {
                        inventorySlots.value[category][index].quantity ++;
                    } else {
                        inventorySlots.value[category][index] = {item: items[0], quantity: 1}
                    }
                }
            } else if (
                category === 'weapons_first' ||
                category === 'weapons_second' ||
                category === 'weapons_special' ||
                category === 'head' ||
                category === 'vest' ||
                category === 'clothesUp' ||
                category === 'clothesDown' ||
                category === 'shoes'
            ) {
                inventorySlots.value[category] = items[0]
                const fastSlot = category === 'weapons_first' ? 'One' :
                  category === 'weapons_second' ? 'Two' :
                  category === 'weapons_special' ? 'Three' : '';
                if (fastSlot) {
                  trigger(`setSlot${fastSlot}`, items[0]);
                }
            }
        }
    }

    watch(
      () => inventory.value,
      (newInventory) => {
        if (newInventory && isDragComplete.value) {
          //как только в инвентавь падает предмет, добавляем его в слот если необходимо
          setInventorySlots('refresh', []);
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

    //срабатывание методов контекстного меню
    const handleContextUsage = (action: string, from: string, item: InventoryItem) => {
      if (!item) return
      const itemIndex = from === 'inventory' ? inventory.value.findIndex(i => i.id === item.id) :
        from === 'around' ? around.value.findIndex(i => i.id === item.id) : -1;
      if (action === 'useItem') {
        if (from === 'around') {
            setAround('delete', [item]);
        }
        if (from === 'inventory') {
            setInventory('delete', [item]);
            trigger('dropFromInventory', item, itemIndex);
        }
        if (
            (from === 'weapons_first' ||
            from === 'weapons_second' ||
            from === 'weapons_special' ||
            from === 'head' ||
            from === 'vest' ||
            from === 'clothesUp' ||
            from === 'clothesDown' ||
            from === 'shoes' ||
            from === 'food' ||
            from === 'medicine' ||
            from === 'other') && item.category
        ) {
            setInventorySlots('delete', [item], item.category as EquippedItemsKeys);
            setInventory('delete', [item]);
            trigger('dropFromInventory', item, itemIndex);
        }
        trigger('useItem', item, itemIndex);
        setLog(`Использован ${item?.name} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
      }
      if (action === 'dropItem') {
        if (from === 'around') {
            setAround('delete', [item]);
        }
        if (from === 'inventory') {
            setAround('add', [item]);
            setInventory('delete', [item]);
            trigger('dropFromInventory', item, itemIndex);
        }
        if (
            (from === 'weapons_first' ||
            from === 'weapons_second' ||
            from === 'weapons_special' ||
            from === 'head' ||
            from === 'vest' ||
            from === 'clothesUp' ||
            from === 'clothesDown' ||
            from === 'shoes' ||
            from === 'food' ||
            from === 'medicine' ||
            from === 'other') && item.category
        ) {
            setInventorySlots('delete', [item], item.category as EquippedItemsKeys);
            setAround('add', [item]);
            setInventory('delete', [item]);
            trigger('dropFromInventory', item, itemIndex);
        }
        setLog(`Выкинут ${item?.name} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
      }
      if (action === 'equip') {
        setInventorySlots('add', [item], item.category as EquippedItemsKeys);
        if (from === 'around') {
            setInventory('add', [item]);
            setAround('delete', [item]);
            trigger('pickFromAround', item, itemIndex);
        }
        setLog(`Надет ${item?.name} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
      }
      if (action === 'unEquip') {
        setInventorySlots('delete', [item], item.category as EquippedItemsKeys);
        setLog(`Снят ${item?.name} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
      }
      if (action === 'moveToInventory') {
        setInventory('add', [item]);
        setAround('delete', [item]);
        trigger('pickFromAround', item, itemIndex);
        setLog(`Перемещен ${item?.name} в инвентарь ${new Date().getHours() + ':' + new Date().getMinutes()}`);
      }
    }

    const trigger = (action: string, item: InventoryItem, index?: number) => {
      if (mp) {
        //выкидываем в окружение из инвентаря (передаем индекс придмета в массиве inventory)
        if (action === 'dropFromInventory' && index) {
          mp.trigger('dropCallRemote', 'dropCallServer', index.toString());
        }
        //поднимаем из окружения в инвентарь (передаем индекс придмета в массиве around)
        if (action === 'pickFromAround' && index) {
          mp.trigger("pickRemoteCallClient", "pickRemoteCall", index.toString());
        }
        //ставим предмет в быстрые слоты (передаем не индекс а id предмета)
        if (['setSlotOne', 'setSlotTwo', 'setSlotThree'].indexOf(action) >= 0) {
          mp.trigger('remoteCallServer', action, item.id.toString());
        }
        //убираем предмет из быстрого слота (передаем не индекс а id предмета)
        if (['removeSlotOne', 'removeSlotTwo', 'removeSlotThree'].indexOf(action) >= 0) {
          mp.trigger('remoteCallServer', action, item.id.toString());
        }
        //использование предмета
        if (action === 'useItem') {
          mp.trigger('remoteCallServer', "use", item.id.toString());
        }
        setLog(`Триггер ${action} index=${index}`);
      }
    }

    //работа логгера
    const activateLogger = () => {
      if (isActiveLogger.value) {
        showLogger.value = false;
        isActiveLogger.value = false;
      } else isActiveLogger.value = true;
    }
    const activateIndicator = () => {
      isActiveIndicator.value = !isActiveIndicator.value;
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

    //сортировка боковых списков по category
    // const sortItemsLists = (a: InventoryItem, b: InventoryItem) => {
    //   if (a === null || b === null) {
    //     return 0;
    //   }
    //   return customOrder.indexOf(a.category) - customOrder.indexOf(b.category);
    // }

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
          /сумка|рюкзак/gi.test(item.name) && item.size > max.size ? item : max
        )
        return biggestBackpack ? backpackSizes.get(biggestBackpack.name) : 10;
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
    });

    //размер всего стака в окружении
    const aroundSize = computed(() => {
      if (around.value.length) {
        let counter = 0;
        for (let i = 0; i < around.value.length; i++) {
          counter += calcSlots(around.value[i].size, around.value[i].stackable, around.value[i].slotable)
        }
        return counter
      } else return 0
    });

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
      if (
        !dropzoneCategory ||
        !itemCategory ||
        (dropzoneCategory && /food|medicine|other/gi.test(dropzoneCategory))
      ) {
        return false
      }
      if (dropzoneCategory === 'dropzone_left' || dropzoneCategory === 'dropzone_right') {
        return true
      }
      if (dropzoneCategory.includes('movable_left') || dropzoneCategory.includes('movable_right')) {
        return true
      }
      return dropzoneCategory.includes(itemCategory);
    }

    const isItemEquipped = (item: InventoryItem) => {
      const slot = inventorySlots.value[item.category as EquippedItemsKeys];
      if (Array.isArray(slot)) {
        return slot.findIndex((el: {item: InventoryItem, quantity: number} | null) => el !== null && el.item.name === item.name) >= 0;
      } else {
        return slot?.name === item.name
      }
    }

    //final dragndrop version
    const draggedElement = ref<HTMLElement | null>(null);
    const draggedItem = ref<{ from: string, item: InventoryItem } | null>(null);
    const dragOffset = reactive({ x: 0, y: 0 });
    let clickTimeout: ReturnType<typeof setTimeout>;
    let arrowTimeout: ReturnType<typeof setTimeout>;

    const handleMouseDown = (from: ValidFrom, eventD: MouseEvent, drItem: InventoryItem, fromIndex?: number, properTargets?: string[]) => {
      eventD.preventDefault();
      isDragComplete.value = false;
      let forceStop = false;
      let isMouseMoved = false;
      if (eventD.button === 2) return;
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        //останавливаем проваливание события клика на стрелку
        if (isArrowClicked.value || forceStop) return;
        if (eventD.button === 0 && drItem) {
          hideTooltip();
          const target = eventD.target as HTMLElement;
          let item = target.closest("[id*='movable']") as HTMLElement;
          const itemStackSize = calcSlots(drItem.size, drItem.stackable, drItem.slotable);
          const isEnoughInventoryPlace = from === 'around' && backpackSize.value ?
            itemStackSize + inventorySize.value <= backpackSize.value : true;
          const isEnoughAroundPlace = from !== 'around' ? itemStackSize + aroundSize.value <= aroundCapacity.value : true;
          const triggerIndex = from === 'around' ? around.value.findIndex(i => i.id === drItem.id) :
            from === 'inventory' ? inventory.value.findIndex(i => i.id === drItem.id) : -1;

          if (!item) return;

          // Устанавливаем перетаскиваемый элемент
          draggedElement.value = item;
          draggedItem.value = { from, item: drItem };
          let movedItemDeleted = false;
          let isItemCloned = false;

          // Сохраняем смещение курсора относительно элемента
          const rect = item.getBoundingClientRect();
          dragOffset.x = eventD.clientX - rect.left;
          dragOffset.y = eventD.clientY - rect.top;
          //const shiftX = event.clientX - rect.left;
          //const shiftY = event.clientY - rect.top;

          function onMouseMove(event: MouseEvent) {
            if (event.buttons !== 1) {
              event.preventDefault();
              return
            }
              
              //проверяем что предмет не один в слоте
              if(
                (from === 'food' ||
                from === 'medicine' ||
                from === 'other') &&
                fromIndex !== undefined &&
                fromIndex >= 0 &&
                inventorySlots.value[from][fromIndex]
              ) {
                if (inventorySlots.value[from][fromIndex].quantity > 1 && !isItemCloned) {
                  item = item.cloneNode(true) as HTMLElement;
                  isItemCloned = true;
                }
              }

              // Удаляем предмет из прошлого расположения (объект inventorySlots | around | inventory)
              if (!movedItemDeleted) {
                if (from === 'around') {
                  setAround('delete', [drItem]);
                  movedItemDeleted = true;
                } else if (from === 'inventory') {
                  setInventory('delete', [drItem]);
                  trigger('dropFromInventory', drItem, triggerIndex);
                  if (isItemEquipped(drItem)) {
                    setInventorySlots('delete', [drItem], drItem.category as keyof EquippedItems);
                  }
                  movedItemDeleted = true;
                } else {
                  setInventorySlots('delete', [drItem], drItem?.category as keyof EquippedItems, fromIndex);
                  setInventory('delete', [drItem]);
                  trigger('dropFromInventory', drItem, triggerIndex);
                  movedItemDeleted = true;
                }
              }

              // Переводим элемент в абсолютное позиционирование
              item.style.position = "absolute";
              item.style.zIndex = "1000";
              item.style.pointerEvents = "none";
              document.body.appendChild(item);
              item.style.left = `${event.pageX - 15}px`;
              item.style.top = `${event.pageY - 15}px`;
              if (/^movable_right/i.test(item.id)) {
                item.style.flexDirection = 'row-reverse';
                item.style.justifyContent = 'flex-end';
              }
              if (window.innerWidth < 1280) {
                item.style.height = '30px';
                item.style.maxWidth = /^movable_left|^movable_right/i.test(item.id) || /^movable_weapons/i.test(item.id) ? '90px' : '30px'; 
              } else if (window.innerWidth < 1440) {
                item.style.height = '33px';
                item.style.maxWidth = /^movable_left|^movable_right/i.test(item.id) || /^movable_weapons/i.test(item.id) ? '99px' : '33px'; 
              } else if (window.innerWidth < 1680) {
                item.style.height = '40px';
                item.style.maxWidth = /^movable_left|^movable_right/i.test(item.id) || /^movable_weapons/i.test(item.id) ? '120px' : '40px'; 
              } else if (window.innerWidth < 1920) {
                item.style.height = '47px';
                item.style.maxWidth = /^movable_left|^movable_right/i.test(item.id) || /^movable_weapons/i.test(item.id) ? '141px' : '47px'; 
              } else if (window.innerWidth < 2560) {
                item.style.height = '53px';
                item.style.maxWidth = /^movable_left|^movable_right/i.test(item.id) || /^movable_weapons/i.test(item.id) ? '159px' : '53px';
              } else {
                item.style.height = '60px';
                item.style.maxWidth = /^movable_left|^movable_right/i.test(item.id) || /^movable_weapons/i.test(item.id) ? '180px' : '60px';
              }
              //подсвечиваем элемент, на который можно положить предмет
              const target = event.target as HTMLElement;
              if (target && isActiveIndicator.value) {
                const isSideZone = ['dropzone_left', 'dropzone_right'].includes(target.id);
                const isDropzone = /^dropzone/i.test(target.id);
                const isImageInSlot = /^movable/i.test(target.id) && !/food|medicine|other/gi.test(target.id);
                const isFastSlot = /food|medicine|other/gi.test(target.id);
                const isBackpackItem = /рюкзак|сумка/gi.test(drItem.name);
                //проверка подходит ли перетаскиваемый предмет в слот по category и по размеру рюкзака
                const isCompatible = checkDropCompatibility(drItem?.category, target.id);
                if (target.tagName === 'BODY') {
                  //наводим предмет вне окна инвентаря и подсвечиваем окружение
                  const leftZone = document.getElementById('dropzone_left');
                  if (leftZone) {
                    leftZone.style.border = isEnoughAroundPlace ?
                      `${window.screen.width > 1920 ? '2px' : '1px'} dashed orange` :
                      `${window.screen.width > 1920 ? '2px' : '1px'} dashed red`;
                  }
                }
                if(target.id === 'dropzone_right') {
                  target.style.border = (isCompatible && isEnoughInventoryPlace) || (!isEnoughInventoryPlace && isBackpackItem) ?
                  `${window.screen.width > 1920 ? '2px' : '1px'} dashed orange` :
                  `${window.screen.width > 1920 ? '2px' : '1px'} dashed red`;
                } else if (target.id === 'dropzone_left') {
                  target.style.border = isEnoughAroundPlace ?
                  `${window.screen.width > 1920 ? '2px' : '1px'} dashed orange` :
                  `${window.screen.width > 1920 ? '2px' : '1px'} dashed red`;
                } else if (isDropzone && !isSideZone && !isFastSlot) {
                  target.style.border = isCompatible && isEnoughInventoryPlace ? 
                  `${window.screen.width > 1920 ? '2px' : '1px'} dashed orange` :
                  `${window.screen.width > 1920 ? '2px' : '1px'} dashed red`;
                } else if (isImageInSlot) {
                  target.style.border = (isCompatible && isEnoughInventoryPlace) ||
                  (isCompatible && !isEnoughInventoryPlace && isBackpackItem) ||
                  (/^movable_left/i.test(target.id) && isEnoughAroundPlace) ||
                  (/^movable_right/i.test(target.id) && isEnoughInventoryPlace) ||
                  (/^movable_right/i.test(target.id) && !isEnoughInventoryPlace && isBackpackItem) ?
                  `${window.screen.width > 1920 ? '2px' : '1px'} dashed orange` :
                  `${window.screen.width > 1920 ? '2px' : '1px'} dashed red`;
                }
                target.onmouseout = () => {
                  if(isSideZone || isImageInSlot) {
                    target.style.border = "none";
                  } else if (isDropzone && !isSideZone) {
                    target.style.border = `${window.screen.width > 1920 ? '2px' : '1px'} solid rgb(75, 75, 75)`;
                  }
                }
              }
              isMouseMoved = true;
          }
          function onMouseUp(eventUp: MouseEvent) {
              if (!isMouseMoved) {
                //событие перетаскивания не успело сработать, удаляем с прошлого расположения принудительно
                if (!movedItemDeleted) {
                  if (from === 'around') {
                    setAround('delete', [drItem]);
                    movedItemDeleted = true;
                  } else if (from === 'inventory') {
                    setInventory('delete', [drItem]);
                    trigger('dropFromInventory', drItem, triggerIndex);
                    if (isItemEquipped(drItem)) {
                      setInventorySlots('delete', [drItem], drItem.category as keyof EquippedItems);
                    }
                    movedItemDeleted = true;
                  } else {
                    setInventorySlots('delete', [drItem], drItem?.category as keyof EquippedItems, fromIndex);
                    setInventory('delete', [drItem]);
                    trigger('dropFromInventory', drItem, triggerIndex);
                    movedItemDeleted = true;
                  }
                }
              }
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
              const target = eventUp.target as HTMLElement;
              //если предмет выносим за окно инвентаря
              if (properTargets && properTargets.includes(target.id)) {
                //может пригодиться устанавливать привентивно дропзоны
              }
              if (target.tagName === 'BODY' && isEnoughAroundPlace) {
                //if (drItem.category === 'backpack' && from !== 'around') {
                  // const isLastBackpack = inventory.value.filter(item => item.category === 'backpack').length === 0;
                  // const isBackpackEquipped = !!inventorySlots.value.backpack;
                  // if (isLastBackpack) {
                  //   setInventory('add', [drItem]);
                  //   if (!isBackpackEquipped) {
                  //   setInventorySlots('add', [drItem], 'backpack');
                  //   }
                  // } else {
                  //   if (!isBackpackEquipped) {
                  //     setInventorySlots('add', [inventory.value.filter(item => item.category === 'backpack')[0]], 'backpack')
                  //   }
                  // }
                //}
                setAround('add', [drItem]);
                item.onmouseup = null;
                item.style.pointerEvents = "auto";
                item.remove();
              } else if (target && /^dropzone|^movable/i.test(target.id) && drItem && checkDropCompatibility(drItem.category, target.id)) {
                item.onmouseup = null;
                item.style.pointerEvents = "auto";
                item.remove();
                
                let dropzone = target.id;
                //если перетаскиваем над слотом с картинкой ставим дропзону ее слота
                if (/^movable/i.test(target.id)) {
                  if (/^movable_left|^movable_right/i.test(target.id)) {
                    dropzone = target.id.replace('movable', 'dropzone').replace(/\d+$/, '');
                  } else dropzone = target.id.replace('movable', 'dropzone');
                }
                const isFastSlot = /food|medicine|other/gi.test(dropzone);
                const isBackpackItem = /рюкзак|сумка/gi.test(drItem.name);
                const isLastBackpack = inventory.value.filter(item => /рюкзак|сумка/gi.test(item.name)).length < 2;
                //если кладем в слот экипировки и есть место, то добавляем и в инвентарь
                if (
                  dropzone !== 'dropzone_left' &&
                  dropzone !== 'dropzone_right' &&
                  dropzone.includes('dropzone') &&
                  !isFastSlot &&
                  (isEnoughInventoryPlace || isBackpackItem)
                ) {
                  setInventory('add', [drItem]);
                  if (from === 'around') trigger('pickFromAround', drItem, triggerIndex);
                }
                //кладем предмет в слот или боковые контейнеры
                //отменяем перенос если места в рюкзаке нет
                if (from === 'around' && dropzone !== 'dropzone_left' && !isEnoughInventoryPlace && !isBackpackItem) {
                  setAround('add', [drItem]);
                  setLog(`Перемещение ${drItem?.name} не удалось, рюкзак полон. ${new Date().getHours() + ':' + new Date().getMinutes()}`)
                } else if (dropzone === 'dropzone_left' && isEnoughAroundPlace) {
                  if (isBackpackItem && isLastBackpack) {
                    setInventory('add', [drItem]);
                  } else {
                    setAround('add', [drItem]);
                  }
                } else if (dropzone === 'dropzone_right') {
                  setInventory('add', [drItem]);
                  if (from === 'around') trigger('pickFromAround', drItem, triggerIndex);
                } else if (dropzone === 'dropzone_weapons_first') {
                  setInventorySlots('add', [drItem], 'weapons_first');
                } else if (dropzone === 'dropzone_weapons_second') {
                  setInventorySlots('add', [drItem], 'weapons_second');
                } else if (dropzone === 'dropzone_weapons_special') {
                  setInventorySlots('add', [drItem], 'weapons_special');
                } else if (dropzone === 'dropzone_head') {
                  setInventorySlots('add', [drItem], 'head');
                } else if (dropzone === 'dropzone_vest') {
                  setInventorySlots('add', [drItem], 'vest');
                } else if (dropzone === 'dropzone_clothesUp') {
                  setInventorySlots('add', [drItem], 'clothesUp');
                } else if (dropzone === 'dropzone_clothesDown') {
                  setInventorySlots('add', [drItem], 'clothesDown');
                } else if (dropzone === 'dropzone_shoes') {
                  setInventorySlots('add', [drItem], 'shoes');
                }
                //запрет перетаскивания в быстрые слоты
                // else if (dropzone.includes('dropzone_food')) {
                //   const putIndex = parseInt(dropzone.replace('dropzone_food_', ''));
                //   setInventorySlots('add', [drItem], 'food', putIndex);
                // } else if (dropzone.includes('dropzone_medicine')) {
                //   const putIndex = parseInt(dropzone.replace('dropzone_medicine_', ''));
                //   setInventorySlots('add', [drItem], 'medicine', putIndex);
                // } else if (dropzone.includes('dropzone_other')) {
                //   const putIndex = parseInt(dropzone.replace('dropzone_other_', ''));
                //   setInventorySlots('add', [drItem], 'other', putIndex);
                // }
              } else {
                //возвращаем предмет на место если опустили вне слота
                item.remove();
                if (from === 'around') {
                  setAround('add', [drItem]);
                } else if (from === 'inventory') {
                  setInventory('add', [drItem]);
                } else {
                  setInventorySlots('add', [drItem], from, fromIndex);
                  setInventory('add', [drItem])
                }
              }
              setLog(`Перемещение ${drItem?.name} из ${from} в ${target.id} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
              if (item) {
                item.remove();
              }
              draggedItem.value = null;
              draggedElement.value = null;
              // setInventorySlots('clear', []);
              //setInventorySlots('refresh', []);
              isDragComplete.value = true;
          }
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);

          eventD.preventDefault();
        }
      }, 300);
      document.addEventListener('mouseup', (ev: MouseEvent) => {
        //проверяем отпущена ли кнопка мыши для перетягивания предмета сразу
        if (
          (ev.clientX >= eventD.clientX - 20 &&
          ev.clientX <= eventD.clientX + 20 &&
          ev.clientY >= eventD.clientY - 20 &&
          ev.clientY <= eventD.clientY + 20) ||
          (ev.timeStamp - eventD.timeStamp < 250)
        ) {
          forceStop = true;
        }
      });
    };

    //использование предмета на даблклик
    const handleDblClick = (from: ValidFrom, event: MouseEvent, item: InventoryItem, fromIndex?: number) => {
      clearTimeout(clickTimeout);
      //удаляем использованный предмет
      if (from === 'around') {
        setAround('delete', [item], fromIndex);
      } else if (from === 'inventory') {
        setInventory('delete', [item], fromIndex);
        trigger('dropFromInventory', item, fromIndex);
      } else {
        setInventorySlots('delete', [item], from, fromIndex);
        setInventory('delete', [item]);
        trigger('dropFromInventory', item, fromIndex);
      }
      trigger('useItem', item, fromIndex);
      setLog(`Использование ${item?.name} из ${from} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
      isDragComplete.value = true;
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

    const handleArrowClick = (from: string, item: InventoryItem, event: MouseEvent) => {
      event.stopPropagation();
      isArrowClicked.value = true;
      const itemStackSize = calcSlots(item.size, item.stackable, item.slotable);
      const isEnoughInventoryPlace = itemStackSize + inventorySize.value <= (backpackSize.value || 10);
      const isEnoughAroundPlace = itemStackSize + aroundSize.value <= aroundCapacity.value;
      const isBackpackItem = /рюкзак|сумка/gi.test(item.name);
      const isLastBackpack = inventory.value.filter(item => /рюкзак|сумка/gi.test(item.name)).length < 2;
      // const equipped = isItemEquipped(item);
      if (!item) return;
      //перетаскиваем если слева - то в инвентарь,ь, если справа - то в окружение
      //в зависимости от того хватит ли места по стакам в противоположном списке
      if (from === 'right' && isEnoughAroundPlace) {
        const itemIndex = inventory.value.findIndex(i => i.id === item.id);
        if (isBackpackItem && isLastBackpack) {
          setLog(`Быстрое перемещение ${item?.name} невозможно ${new Date().getHours() + ':' + new Date().getMinutes()}`);
        } else {
          setAround('add', [item]);
          if (isItemEquipped(item)) setInventorySlots('delete', [item], item.category as EquippedItemsKeys);
          setInventory('delete', [item]);
          trigger('dropFromInventory', item, itemIndex);
          setLog(`Быстрое перемещение ${item?.name} из ${from} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
        }
      }
      if ((from === 'left' && isEnoughInventoryPlace) || (from === 'left' && !isEnoughInventoryPlace && isBackpackItem)) {
        const itemIndex = around.value.findIndex(i => i.id === item.id);
        setAround('delete', [item]);
        setInventory('add', [item]);
        trigger('pickFromAround', item, itemIndex);
        setLog(`Быстрое перемещение ${item?.name} из ${from} ${new Date().getHours() + ':' + new Date().getMinutes()}`);
      }
      if (from === 'left' && !isEnoughInventoryPlace || from === 'right' && !isEnoughAroundPlace) {
        setLog(`Быстрое перемещение ${item?.name} невозможно инвентарь полон ${new Date().getHours() + ':' + new Date().getMinutes()}`);
      }
      isDragComplete.value = true;
      clearTimeout(arrowTimeout);
      arrowTimeout = setTimeout(() => {
        isArrowClicked.value = false;
      }, 300)
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
      handleArrowClick,
      handleContextUsage,
      isVertical,
      checkOrientation,
      draggedItem,
      calcSlots,
      backpackSize,
      inventorySize, 
      showLogger,
      logs,
      isActiveLogger,
      isActiveIndicator,
      activateLogger,
      activateIndicator,
      startAutoHideLogger,
      cancelAutoHideLogger,
      returnAutoHideLogger,
      contextMenuVisible,
      contextMenuPosition,
      contextFromProp,
      contextItemProp,
      aroundSize,
      aroundCapacity
    };
  },
};
</script>

<style scoped>
.inventory {
  position: fixed;
  top: 20vh;
  left: 20vw;
  display: flex;
  justify-content: space-between;
  background-color: black;
  width: 60%;
  height: 55%;
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
  width: 46%;
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
  width: 27%;
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
  margin: 0.5rem;
  /* margin: 1rem; */
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
  gap: unset;
  justify-content: space-between;
}
.side-left > .inventory-container {
  padding-right: 0px;
}
.side-right > .inventory-container {
  align-items: end;
  padding-left: 0px;
}
.inventory-container {
  position: relative;
  display: flex;
  padding: 1rem;
  margin: 0;
  width: 100%;
  height: 95%;
  overflow: auto;
  scrollbar-width: 10px;
  scrollbar-color: #c8c8c8;
  box-sizing: border-box;
}

/* scrollbar */
.inventory-container::-webkit-scrollbar {
  width: 5px;
  height: 5px;
	background-color: #c8c8c8;
  border-radius: 2px;
}
.inventory-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.3);
	border-radius: 2px;
	background-color: #a1a1a1;
}
.inventory-container::-webkit-scrollbar-thumb {
  border-radius: 5px;
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
  width: 100%;
  height: 60px;
  /* height: fit-content; */
  margin-bottom: 0.5rem;
  transition: transform .2s;
  box-sizing: border-box;
  /* padding: 0.6rem; */
  /* background-color: rgba(78, 75, 71, 0.911); */
}
.inventory-side-item:hover {
  cursor: grab;
  /* transform: scale(1.1); */
  background-color: rgba(0, 0, 0, 0.713);
  border-radius: 5px;
  /* width: 100%; */
}
.left-arrow {
  display: none;
  transform:rotate(-90deg);
  position: absolute;
  right: 1rem;
}
.right-arrow {
  display: none;
  transform: rotate(90deg);
  position: absolute;
  left: 1rem;
}
.left-arrow:hover, .right-arrow:hover {
  cursor: pointer;
}
.inventory-side-item:hover .left-arrow,
.inventory-side-item:hover .right-arrow {
  display: block;
}
.items-right {
  justify-content: right;
}

.inventory-side-item > img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  object-position: center;
  cursor: grab;
  background-color: black;
}
.inventory-side-item > img.double_image {
  width: 120px;
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
  height: 17%;
  width: 100%;
}
.equipment h4 {
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
  height: 10%;
}
.equipment-accesories {
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
  display: flex;
  justify-content: left;
  padding: 0.5rem;
  align-content: center;
  height: 90%;
  width: 100%;
  align-items: stretch;
}
.grid-two-fraction {
  justify-content: space-around;
}
.grid-one-fraction {
  justify-content: center;
}
.equipment-accesories > .grid {
  justify-content: right;
}

.slot {
  position: relative;
  height: 90%;
  aspect-ratio: 1/1;
  margin: 0 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid rgb(75, 75, 75);
  box-sizing: border-box;
  object-fit: contain;
  object-position: center;
  overflow: hidden;
}
.slot > img {
  cursor: grab;
  object-fit: contain;
  display: block;
}
.slot > img.defaultcursor {
  cursor: no-drop;
}
.slot.slot-x2 {
  width: 120px;
}
.slot.slot-x3 {
  aspect-ratio: 3/1;
  height: 90%;
}
.slot-x3 > img {
  width: auto;
  height: 100%;
}
@media (max-aspect-ratio: 16/9) {
  .grid {
    height: auto;
    max-height: 90%;
  }
  .slot {
    height: auto !important;
    aspect-ratio: 1/1;
    width: 12%;
  }
  .slot.slot-x3 {
    width: 36%;
    aspect-ratio: 3/1;
  }
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
  white-space: normal;
  font-size: 1.1rem;
  z-index: 10;
  -webkit-box-shadow: 9px 2px 12px 5px rgba(0,0,0,0.75); 
  box-shadow: 9px 2px 12px 5px rgba(0,0,0,0.75);
}
.side-left .tooltip, .side-right .tooltip {
  width: 80%;
}
.side-center .tooltip.tooltip-left {
  right: -60%;
}
.tooltip.tooltip-right {
  left: -80%;
}
.tooltip.tooltip-left {
  right: -80%;
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
.logger-btn, .indicator-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 1.5rem;
  width: 1.5rem;
  object-fit: contain;
  cursor: pointer;
  font-size: 1rem;
  background-color: grey;
  border: none;
}
.indicator-btn {
  left: 2rem;
}
.logger-btn-active, .indicator-btn-active {
  background-color: green;
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
  font-size: 1rem;
  font-family: monospace;
  color: rgb(12, 176, 12);
  border-bottom: 1px solid green;
}

img.rotated {
  transform: rotate(90deg);
}
/* max-width: 3840px */

@media(max-width: 2560px) {
  .inventory {
    height: 55%;
  }
  .inventory-box > h3 {
    font-size: 0.9rem;
  }
  .inventory-container {
    padding: 0.9rem;
  }
  .left-arrow {
    right: 0.9rem;
  }
  .right-arrow {
    left: 0.9rem;
  }
  .inventory-side-item {
    height: 57px;
  }
  .inventory-side-item > img {
    width: 57px;
    height: 57px;
  }
  .inventory-side-item > img.double_image {
    width: 114px;
  }
  .inventory-side-item > p {
    padding: 0 0.9rem;
    font-size: 0.9rem;
  }
  .inventory-side-label-left,
  .inventory-side-label-right {
    font-size: 0.9rem;
  }
  .inventory-box h4 {
    font-size: 0.8rem;
  }
  .grid {
    padding: 0.5rem;
  }
  .slot {
    margin: 0 0.5rem;
    border: 2px solid rgb(75, 75, 75);
  }
  .equipment-quantity-label {
    font-size: 0.9rem;
  }
  .tooltip {
    font-size: 0.9rem;
    padding: 0.9rem;
  }
  .tooltip h4 {
    font-size: 0.9rem;
    padding: 0.9rem;
  }
  .logger-btn, .indicator-btn {
    height: 1.3rem;
    width: 1.3rem;
  }
  .indicator-btn {
    left: 1.7rem;
  }
  .logger p {
    font-size: 0.9rem;
  }
}

@media(max-width: 2240px) {
  .inventory {
    height: 55%;
  }
  .inventory-box > h3 {
    font-size: 0.8rem;
  }
  .inventory-container {
    padding: 0.8rem;
  }
  .left-arrow {
    right: 0.8rem;
  }
  .right-arrow {
    left: 0.8rem;
  }
  .inventory-side-item {
    height: 53px;
  }
  .inventory-side-item > img {
    width: 53px;
    height: 53px;
  }
  .inventory-side-item > img.double_image {
    width: 106px;
  }
  .inventory-side-item > p {
    padding: 0 0.8rem;
    font-size: 0.8rem;
  }
  .inventory-side-label-left,
  .inventory-side-label-right {
    font-size: 0.8rem;
  }
  .inventory-box h4 {
    font-size: 0.7rem;
  }
  .grid {
    padding: 0.5;
  }
  .slot {
    margin: 0 0.5rem;
    border: 2px solid rgb(75, 75, 75);
  }
  .equipment-quantity-label {
    font-size: 0.8rem;
  }
  .tooltip {
    font-size: 0.8rem;
    padding: 0.8rem;
  }
  .tooltip h4 {
    font-size: 0.8rem;
    padding: 0.8rem;
  }
  .logger-btn, .indicator-btn {
    height: 1.2rem;
    width: 1.2rem;
  }
  .indicator-btn {
    left: 1.5rem;
  }
  .logger p {
    font-size: 0.8rem;
  }
}

@media(max-width: 1920px) {
  .inventory {
    height: 55%;
  }
  .inventory-box > h3 {
    font-size: 0.8rem;
  }
  .inventory-container {
    padding: 0.7rem;
  }
  .left-arrow {
    right: 0.7rem;
  }
  .right-arrow {
    left: 0.7rem;
  }
  .inventory-side-item {
    height: 50px;
  }
  .inventory-side-item > img {
    width: 50px;
    height: 50px;
  }
  .inventory-side-item > img.double_image {
    width: 100px;
  }
  .inventory-side-item > p {
    padding: 0 0.7rem;
    font-size: 0.7rem;
  }
  .inventory-side-label-left,
  .inventory-side-label-right {
    font-size: 0.7rem;
  }
  .inventory-box h4 {
    font-size: 0.6rem;
  }
  .grid {
    padding: 0.4rem;
  }
  .slot {
    margin: 0 0.4rem;
    border: 1px solid rgb(75, 75, 75);
  }
  .equipment-quantity-label {
    font-size: 0.7rem;
  }
  .tooltip {
    font-size: 0.7rem;
    padding: 0.7rem;
  }
  .tooltip h4 {
    font-size: 0.7rem;
    padding: 0.7rem;
  }
  .logger-btn, .indicator-btn {
    height: 1.1rem;
    width: 1.1rem;
  }
  .indicator-btn {
    left: 1.3rem;
  }
  .logger p {
    font-size: 0.7rem;
  }
}

@media(max-width: 1680px) {
  .inventory {
    height: 55%;
  }
  .inventory-box > h3 {
    font-size: 0.7rem;
  }
  .inventory-container {
    padding: 0.6rem;
  }
  .left-arrow {
    right: 0.6rem;
  }
  .right-arrow {
    left: 0.6rem;
  }
  .inventory-side-item {
    height: 42px;
  }
  .inventory-side-item > img {
    width: 42px;
    height: 42px;
  }
  .inventory-side-item > img.double_image {
    width: 84px;
  }
  .inventory-side-item > p {
    padding: 0 0.6rem;
    font-size: 0.6rem;
  }
  .inventory-side-label-left,
  .inventory-side-label-right {
    font-size: 0.6rem;
  }
  .inventory-box h4 {
    font-size: 0.5rem;
  }
  .grid {
    padding: 0.3rem;
  }
  .slot {
    margin: 0 0.3rem;
    border: 1px solid rgb(75, 75, 75);
  }
  .equipment-quantity-label {
    font-size: 0.6rem;
  }
  .tooltip {
    font-size: 0.6rem;
    padding: 0.6rem;
  }
  .tooltip h4 {
    font-size: 0.6rem;
    padding: 0.6rem;
  }
  .logger-btn, .indicator-btn {
    height: 1rem;
    width: 1rem;
  }
  .indicator-btn {
    left: 1.2rem;
  }
  .logger p {
    font-size: 0.6rem;
  }
}

@media (max-width: 1440px) {
  .inventory {
    height: 55%;
  }
  .inventory-box > h3 {
    font-size: 0.6rem;
  }
  .inventory-container {
    padding: 0.5rem;
  }
  .left-arrow {
    right: 0.5rem;
  }
  .right-arrow {
    left: 0.5rem;
  }
  .inventory-side-item {
    height: 35px;
  }
  .inventory-side-item > img {
    width: 35px;
    height: 35px;
  }
  .inventory-side-item > img.double_image {
    width: 70px;
  }
  .inventory-side-item > p {
    padding: 0 0.5rem;
    font-size: 0.5rem;
  }
  .inventory-side-label-left,
  .inventory-side-label-right {
    font-size: 0.5rem;
  }
  .inventory-box h4 {
    font-size: 0.4rem;
  }
  .grid {
    padding: 0.3rem;
  }
  .slot {
    margin: 0 0.3rem;
    border: 1px solid rgb(75, 75, 75);
  }
  .equipment-quantity-label {
    font-size: 0.5rem;
  }
  .tooltip {
    font-size: 0.5rem;
    padding: 0.5rem;
  }
  .tooltip h4 {
    font-size: 0.5rem;
    padding: 0.5rem;
  }
  .logger-btn, .indicator-btn {
    height: 0.8rem;
    width: 0.8rem;
  }
  .indicator-btn {
    left: 1rem;
  }
  .logger p {
    font-size: 0.5rem;
  }
}

@media (max-width: 1280px) {
  .inventory {
    height: 55%;
  }
  .inventory-box > h3 {
    font-size: 0.5rem;
  }
  .inventory-container {
    padding: 0.4rem;
    margin: 0;
  }
  .left-arrow {
    right: 0.4rem;
  }
  .right-arrow {
    left: 0.4rem;
  }
  .inventory-side-item {
    height: 30px;
  }
  .inventory-side-item > img {
    width: 30px;
    height: 30px;
  }
  .inventory-side-item > img.double_image {
    width: 60px;
  }
  .inventory-side-item > p {
    padding: 0 0.4rem;
    font-size: 0.4rem;
  }
  .inventory-side-label-left,
  .inventory-side-label-right {
    font-size: 0.4rem;
  }
  .inventory-box h4 {
    font-size: 0.3rem;
  }
  .grid {
    padding: 0.2rem;
  }
  .slot {
    margin: 0 0.2rem;
    border: 1px solid rgb(75, 75, 75);
  }
  .equipment-quantity-label {
    font-size: 0.4rem;
  }
  .tooltip {
    font-size: 0.4rem;
    padding: 0.4rem;
  }
  .tooltip h4 {
    font-size: 0.5rem;
    padding: 0.4rem;
  }
  .logger-btn, .indicator-btn {
    height: 0.7rem;
    width: 0.7rem;
  }
  .indicator-btn {
    left: 0.9rem;
  }
  .logger p {
    font-size: 0.4rem;
  }
}
</style>