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
    accesories: InventoryItem[],
    food: InventoryItem[],
    medicine: InventoryItem[],
    other: InventoryItem[],
}

export type EquippedItemsKeys = keyof EquippedItems;

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
        accesories: [],
        food: [],
        medicine: [],
        other: [],
    });

    function setAround(action: string, items: InventoryItem[], idx?: number) {
        console.log('STORE-SET-AROUND->', action, items, idx);
        if (action === 'init' && items) {
            aroundItems.value = items;
        } else if (action === 'delete' && items[0]) {
            const delIndex = aroundItems.value.findIndex(el => el.id === items[0].id);
            if (delIndex > -1) aroundItems.value.splice(delIndex, 1);
        } else if (action === 'clear') {
            aroundItems.value = [];
        } else if (action === 'add') {
            aroundItems.value.push(items[0]);
        }
    }
    function setInventory(action: string, items: InventoryItem[], idx?: number) {
        console.log('STORE-SET-INVENTORY->', action, items, idx);
        if (action === 'init' && items) {
            inventoryItems.value = items;
        } else if (action === 'delete' && items[0]) {
            const delIndex = inventoryItems.value.findIndex(el => el.id === items[0].id);
            if (delIndex > -1) inventoryItems.value.splice(delIndex, 1);
        } else if (action === 'clear') {
            inventoryItems.value = [];
        } else if (action === 'add') {
            inventoryItems.value.push(items[0]);
        }
    }
    function setEquippedItems(action: string, items: InventoryItem[], category?: EquippedItemsKeys, index?: number) {
        console.log('STORE-SET-EQUIPPED->', action, items, category, index);
        //init, clear, add, delete
        if (action === 'init') {
            const inventory = items.length ? items : inventoryItems.value;
            console.log('STORE-EQUIP-INIT->', inventory);
            if (inventory) {
                inventory.map(item => {
                    if (
                        item.category === 'food' ||
                        item.category === 'medicine' ||
                        item.category === 'accesories' ||
                        item.category === 'other'
                    ) {
                        if (equippedItems.value[item.category].length < 7) {
                            equippedItems.value[item.category].push(item)
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
                    }
                })
            }
        } else if (action === 'delete' && items[0] && category) {
            console.log('STORE-EQUIP-DEL->', category);
            //сначала удаляем предмет из экипировки (быстрых слотов)
            if (
                category === 'food' ||
                category === 'medicine' ||
                category === 'accesories' ||
                category === 'other'
            ) {
                const delIndex = index ? index : equippedItems.value[category].findIndex(el => el.id === items[0].id)
                equippedItems.value[category].splice(delIndex, 1);
            } else {
                equippedItems.value[category] = null;
            }
            //затем из инвентаря
            const delIndex = inventoryItems.value.findIndex(el => el.id === items[0].id);
            if (delIndex > -1) inventoryItems.value.splice(delIndex, 1);
        } else if (action === 'clear') {
            console.log('STORE-EQUIP-CLEAR->');
            equippedItems.value = {
                weapons_first: null,
                weapons_second: null,
                weapons_special: null,
                head: null,
                vest: null,
                clothesUp: null,
                clothesDown: null,
                shoes: null,
                accesories: [],
                food: [],
                medicine: [],
                other: [],
            }
            if (inventoryItems.value.length) inventoryItems.value = []
        } else if (action === 'add') {
            if (
                category === 'food' ||
                category === 'medicine' ||
                category === 'accesories' ||
                category === 'other'
            ) {
                if (index !== undefined) {
                    equippedItems.value[category].splice(index, 0, items[0]);
                } else equippedItems.value[category].push(items[0]);
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
