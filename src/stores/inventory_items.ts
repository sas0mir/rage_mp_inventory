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
    category?: string
}

export interface EquippedItems {
    weapons_first?: InventoryItem | null,
    weapons_second?: InventoryItem | null,
    weapons_special?: InventoryItem | null,
    head?: InventoryItem | null,
    vest?: InventoryItem | null,
    clothesUp?: InventoryItem | null,
    clothesDown?: InventoryItem | null,
    shoes?: InventoryItem | null,
    accesories?: InventoryItem[],
    food?: InventoryItem[],
    medicine?: InventoryItem[],
    other?: InventoryItem[],
}

export const useInventoryItemsStore = defineStore('inventoryItems', () => {
    const aroundItems = ref<InventoryItem[]>([]);
    const inventoryItems = ref<InventoryItem[]>([]);
    const equippedItems = ref<EquippedItems>({});
    function setAround(action: string, items: InventoryItem[]) {
        console.log('STORE-SET-AROUND->', action, items);
        if (action === 'init' && items) {
            aroundItems.value = items;
        }
        // if (action === 'add') {
        //     aroundItems.push(item)
        // } else {
        //     const index = aroundItems.findIndex((i) => i.id === item.id)
        //     aroundItems.splice(index, 1, item)
        // }
    }
    function setInventory(action: string, items: InventoryItem[]) {
        console.log('STORE-SET-INVENTORY->', action, items);
        if (action === 'init' && items) {
            inventoryItems.value = items;
        }
        // if (action === 'add') {
        //     inventoryItems.push(item)
        // } else {
        //     const index = inventoryItems.findIndex((i) => i.id === item.id)
        //     inventoryItems.splice(index, 1, item)
        // }
    }
    function setEquippedItems(action: string, items: InventoryItem[], category?: string, index?: number) {
        console.log('STORE-SET-EQUIPPED->', action, items, category, index);
        //init, clear, add, delete
        if (action === 'init') {
            const inventory = items.length ? items : inventoryItems.value;
            if (inventory) {
                inventory.map(item => {
                    //разделяем поле category предмета на категорию и саб-категорию чтобы расставить в слоты (category: 'clothes_vest')
                    const itemCategory = item.category ? item.category.split('_')[0] : '';
                    const itemSubCategory = item.category ? item.category.split('_')[1] : '';
                    if (itemCategory === 'weapons') {
                        if (itemSubCategory === 'first' && !equippedItems.value.weapons_first) {
                            equippedItems.value.weapons_first = item;
                        }
                        if (itemSubCategory === 'second' && !equippedItems.value.weapons_second) {
                            equippedItems.value.weapons_second = item;
                        }
                        if (itemSubCategory === 'special' && !equippedItems.value.weapons_special) {
                            equippedItems.value.weapons_special = item;
                        }
                    }
                    console.log('SETTT->',itemCategory, itemSubCategory, equippedItems.value);
                    // weapons?: InventoryItem[],
                    // head?: InventoryItem | null,
                    // vest?: InventoryItem | null,
                    // clothesUp?: InventoryItem | null,
                    // clothesDown?: InventoryItem | null,
                    // shoes?: InventoryItem | null,
                    // accesories?: InventoryItem[],
                    // food?: InventoryItem[],
                    // medicine?: InventoryItem[],
                    // other?: InventoryItem[],
                })
            }
        }
        // if (action === 'add') {
        //     if( ['weapons', 'accesories', 'food', 'medicine'].includes(position) ) {
        //         (equippedItems[position] as InventoryItem[]).push(item)
        //     } else {
        //         (equippedItems[position] as InventoryItem) = item
        //     }
        // } else {
        //     if( ['weapons', 'accesories', 'food', 'medicine'].includes(position) ) {
        //         const index = (equippedItems[position] as InventoryItem[]).findIndex((i) => i.id === item.id);
        //         (equippedItems[position] as InventoryItem[]).splice(index, 1, item)
        //     } else {
        //         (equippedItems[position] as InventoryItem | null) = null;
        //     }
        // }
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
