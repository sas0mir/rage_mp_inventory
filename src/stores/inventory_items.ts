// import { computed } from 'vue'
import { defineStore } from 'pinia'
import { mockAroundItems, mockEquippedItems, mockInventoryItems } from '@/constants/mockData'

export interface InventoryItem {
    itemId: string //категория
    name: string
    idcounter?: number
    icon: string
    health: number //прочность 1-100
    itsize: number //размер стака 1
    needsize?: number //минимально необходимый размер
    slotable: number //сколько слотов занимает
    stackable: number //сколько помещается в один стак
    weight?: number
    dtext1?: string
    dtext2?: string
    dtext3?: string
    dtext4?: string
}

export interface EquippedItems {
    weapons?: InventoryItem[],
    head?: InventoryItem | null,
    vest?: InventoryItem | null,
    backpack?: InventoryItem | null,
    clothesUp?: InventoryItem | null,
    clothesDown?: InventoryItem | null,
    shoes?: InventoryItem | null,
    accesories?: InventoryItem[],
    food?: InventoryItem[],
    medicine?: InventoryItem[],
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
    function setAroundItems(action: string, item: InventoryItem) {
        if (action === 'add') {
            aroundItems.push(item)
        } else {
            const index = aroundItems.findIndex((i) => i.itemId === item.itemId)
            aroundItems.splice(index, 1, item)
        }
    }
    function setInventory(action: string, item: InventoryItem) {
        if (action === 'add') {
            inventoryItems.push(item)
        } else {
            const index = inventoryItems.findIndex((i) => i.itemId === item.itemId)
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
                const index = (equippedItems[position] as InventoryItem[]).findIndex((i) => i.itemId === item.itemId);
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
        setAroundItems,
        setInventory,
        setEquippedItems
    }
})
