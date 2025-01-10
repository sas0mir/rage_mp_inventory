// import { computed } from 'vue'
import { defineStore } from 'pinia'
import { mockAroundItems, mockInventoryItems, mockEquippedItems } from '@/constants/mockData'

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
    weapons?: InventoryItem[],
    head?: InventoryItem | null,
    vest?: InventoryItem | null,
    clothesUp?: InventoryItem | null,
    clothesDown?: InventoryItem | null,
    shoes?: InventoryItem | null,
    backpack?: InventoryItem | null,
    accesories?: InventoryItem[],
    food?: InventoryItem[],
    medicine?: InventoryItem[],
    other?: InventoryItem[],
}

export const useInventoryItemsStore = defineStore('inventoryItems', () => {
    const aroundItems: InventoryItem[] = mockAroundItems
    const inventoryItems: InventoryItem[] = mockInventoryItems
    const equippedItems: EquippedItems = mockEquippedItems
    function setRealData(data: InventoryItem[]) {
        console.log('REAL-DATA->', data);
        //удаляем мок данные
        aroundItems.splice(0, aroundItems.length)
        inventoryItems.splice(0, inventoryItems.length)
        // stackItems = data.stackItems
        // inventoryItems = data.inventoryItems
        // equippedItems = data.equippedItems
    }
    function setAround(action: string, item: InventoryItem) {
        if (action === 'add') {
            aroundItems.push(item)
        } else {
            const index = aroundItems.findIndex((i) => i.id === item.id)
            aroundItems.splice(index, 1, item)
        }
    }
    function setInventory(action: string, item: InventoryItem) {
        if (action === 'add') {
            inventoryItems.push(item)
        } else {
            const index = inventoryItems.findIndex((i) => i.id === item.id)
            inventoryItems.splice(index, 1, item)
        }
    }
    function setEquippedItems(action: string, position: keyof EquippedItems, item: InventoryItem) {
        if (action === 'add') {
            if( ['weapons', 'accesories', 'food', 'medicine'].includes(position) ) {
                (equippedItems[position] as InventoryItem[]).push(item)
            } else {
                (equippedItems[position] as InventoryItem) = item
            }
        } else {
            if( ['weapons', 'accesories', 'food', 'medicine'].includes(position) ) {
                const index = (equippedItems[position] as InventoryItem[]).findIndex((i) => i.id === item.id);
                (equippedItems[position] as InventoryItem[]).splice(index, 1, item)
            } else {
                (equippedItems[position] as InventoryItem | null) = null;
            }
        }
    }

    return {
        aroundItems,
        inventoryItems,
        equippedItems,
        setRealData,
        setAround,
        setInventory,
        setEquippedItems
    }
})
