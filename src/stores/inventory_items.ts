// import { computed } from 'vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface InventoryItem {
    id: number
    name: string
    description: string
    icon: string
    health: number //прочность 1-100
    size: number //размер стака 1
    description_full?: string
    slotable: number //сколько слотов занимает
    stackable: number //сколько помещается в один стак
    category: string
}

export interface EquippedItems {
    weapons_first: InventoryItem | null,
    weapons_second: InventoryItem | null,
    weapons_special: InventoryItem | null,
    head: InventoryItem | null,
    vest: InventoryItem | null,
    clothesUp: InventoryItem | null,
    clothesDown: InventoryItem | null,
    shoes: InventoryItem | null,
    backpack: InventoryItem | null,
    food: ({ item: InventoryItem; quantity: number } | null)[],
    medicine: ({ item: InventoryItem; quantity: number } | null)[],
    other: ({ item: InventoryItem; quantity: number } | null)[],
}

export type EquippedItemsKeys = keyof EquippedItems;

export const customOrder = [
    'weapons_first',
    'weapons_second',
    'weapons_special',
    'head',
    'vest',
    'clothesUp',
    'clothesDown',
    'shoes',
    'backpack',
    'ammo',
    'food',
    'medicine',
    'other',
];

//сортировка боковых списков по category
const sortItemsLists = (a: InventoryItem, b: InventoryItem) => {
    if (a === null || b === null) return 0;
    return customOrder.indexOf(a.category) - customOrder.indexOf(b.category);
}

export const useInventoryItemsStore = defineStore('inventoryItems', () => {
    const aroundItems = ref<InventoryItem[]>([]);
    const inventoryItems = ref<InventoryItem[]>([]);
    const equippedItems = ref<EquippedItems>({
        weapons_first: null,
        weapons_second: null,
        weapons_special: null,
        head: null,
        vest: null,
        clothesUp: null,
        clothesDown: null,
        shoes: null,
        backpack: null,
        food: [null, null, null, null, null, null, null],
        medicine: [null, null, null, null, null, null, null],
        other: [null, null, null, null, null, null],
    });

    //init, clear, add, delete для каждой зоны (Окружение/Экипировка/Инвентарь)
    function setAround(action: string, items: InventoryItem[], _idx?: number) {
        console.log(_idx);
        if (action === 'init' && items) {
            aroundItems.value = items.sort(sortItemsLists);
        } else if (action === 'delete' && items[0]) {
            const delIndex = aroundItems.value.findIndex(el => el && el.id === items[0]?.id);
            if (delIndex > -1) aroundItems.value.splice(delIndex, 1);
        } else if (action === 'clear') {
            aroundItems.value = [];
        } else if (action === 'add') {
            aroundItems.value.push(items[0]);
            aroundItems.value.sort(sortItemsLists);
        }
    }
    function setInventory(action: string, items: InventoryItem[], _idx?: number) {
        console.log(_idx);
        if (action === 'init' && items) {
            inventoryItems.value = items.sort(sortItemsLists);
        } else if (action === 'delete' && items[0]) {
            const delIndex = inventoryItems.value.findIndex(el => el && el.id === items[0]?.id);
            if (delIndex > -1) inventoryItems.value.splice(delIndex, 1);
        } else if (action === 'clear') {
            inventoryItems.value = [];
        } else if (action === 'add') {
            inventoryItems.value.push(items[0]);
            inventoryItems.value.sort(sortItemsLists);
        }
    }
    function setEquippedItems(action: string, items: InventoryItem[], category?: EquippedItemsKeys, index?: number) {
        if (action === 'init') {
            const inventory = items.length ? items : inventoryItems.value;
            if (inventory) {
                inventory.map(item => {
                    if (
                        item.category === 'food' ||
                        item.category === 'medicine' ||
                        item.category === 'other'
                    ) {
                        if (equippedItems.value[item.category].length) {
                            const pushIndex = equippedItems.value[item.category].findIndex((el) => el?.item.name === item.name);
                            const nullIndex = equippedItems.value[item.category].findIndex((el) => el === null);
                            if (
                                pushIndex >= 0 &&
                                equippedItems.value[item.category][pushIndex] !== null &&
                                equippedItems.value[item.category][pushIndex]?.quantity
                            ) {
                                equippedItems.value[item.category][pushIndex]!.quantity ++
                            } else if (nullIndex >= 0) {
                                equippedItems.value[item.category][nullIndex] = ({item, quantity: 1})
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
                        equippedItems.value[item.category] = item;
                    } else if (item.category === 'backpack') {
                        //вешаем самый большой по size рюкзак
                        if (equippedItems.value.backpack !== null && item.size > equippedItems.value.backpack.size) {
                            equippedItems.value.backpack = item;
                        } else if (equippedItems.value.backpack === null) {
                            equippedItems.value.backpack = item;
                        }
                    }
                })
            }
        } else if (action === 'refresh') {
            const inventory = inventoryItems.value;
            if (inventory) {
                equippedItems.value.food = [null, null, null, null, null, null, null];
                equippedItems.value.medicine = [null, null, null, null, null, null, null];
                equippedItems.value.other = [null, null, null, null, null, null];
                inventory.map(item => {
                    if (
                        item.category === 'food' ||
                        item.category === 'medicine' ||
                        item.category === 'other'
                    ) {
                        if (equippedItems.value[item.category].length) {
                            const pushIndex = equippedItems.value[item.category].findIndex((el) => el?.item.name === item.name);
                            const nullIndex = equippedItems.value[item.category].findIndex((el) => el === null);
                            if (
                                pushIndex >= 0 &&
                                equippedItems.value[item.category][pushIndex] !== null &&
                                equippedItems.value[item.category][pushIndex]?.quantity
                            ) {
                                equippedItems.value[item.category][pushIndex]!.quantity ++
                            } else if (nullIndex >= 0) {
                                equippedItems.value[item.category][nullIndex] = ({item, quantity: 1})
                            }
                        }
                    }
                })
            }
        } else if (action === 'delete' && items[0] && category) {
            //сначала удаляем предмет из экипировки (быстрых слотов)
            if (
                category === 'food' ||
                category === 'medicine' ||
                category === 'other'
            ) {
                const delIndex = index !== undefined && index >= 0 ?
                    index :
                    equippedItems.value[category].findIndex(el => el !== null && el.item && el.item.id === items[0]?.id);
                if (
                    equippedItems.value[category][delIndex] !== null &&
                    equippedItems.value[category][delIndex].quantity > 1) 
                {
                    equippedItems.value[category].splice(delIndex, 1, {item: items[0], quantity: equippedItems.value[category][delIndex].quantity - 1});
                } else {
                    equippedItems.value[category].splice(delIndex, 1, null);
                }
            } else {
                equippedItems.value[category] = null;
            }
            //затем из инвентаря
            // const delIndex = inventoryItems.value.findIndex(el => el && el.name === items[0]?.name);
            // if (delIndex > -1) inventoryItems.value.splice(delIndex, 1);
        } else if (action === 'clear') {
            equippedItems.value = {
                weapons_first: null,
                weapons_second: null,
                weapons_special: null,
                head: null,
                vest: null,
                clothesUp: null,
                clothesDown: null,
                shoes: null,
                backpack: null,
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
                if (index !== undefined && equippedItems.value[category][index] === null) {
                    equippedItems.value[category].splice(index, 1, {item: items[0], quantity: 1});
                } else if (index !== undefined && equippedItems.value[category][index]?.quantity) {
                    //если слот занят
                    if (equippedItems.value[category][index].item.name === items[0].name) {
                        equippedItems.value[category][index].quantity ++;
                    } else {
                        equippedItems.value[category][index] = {item: items[0], quantity: 1}
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
                category === 'shoes' ||
                category === 'backpack'
            ) {
                equippedItems.value[category] = items[0]
            }
        }
    }

    return {
        aroundItems,
        inventoryItems,
        equippedItems,
        setAround,
        setInventory,
        setEquippedItems
    }
})
