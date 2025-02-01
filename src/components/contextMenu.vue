<template>
    <div v-if="visible" :style="menuStyles" class="context-menu">
        <button v-if="isUsable" @click="$emit('contextEvent', 'useItem', from, item)">Использовать</button>
        <button :disabled="isBackpack || $props.from === 'around'" @click="$emit('contextEvent', 'dropItem', from, item)">Выбросить</button>
        <button v-if="isWearable" @click="$emit('contextEvent', 'equip', from, item)">Надеть</button>
        <button v-if="isArmor" :disabled="isBackpack" @click="$emit('contextEvent', 'unEquip', from, item)">Освободить слот</button>
        <button v-if="$props.from === 'around'" @click="$emit('contextEvent', 'moveToInventory', from, item)">В инвентарь</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, type PropType } from "vue";
import { type InventoryItem } from "../stores/inventory_items";

export default defineComponent({
    name: "ContextMenu",
    emits: ['contextEvent'],
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        position: {
            type: Object as () => { top: string; left: string },
            required: true,
        },
        from: { type: String, required: true },
        item: { type: Object as PropType<InventoryItem>, required: true }
    },
    setup(props) {

        const isArmor = computed(() => {
            const isProperFrom = props.from !== 'inventory' && props.from !== 'around';
            return isProperFrom && ['head', 'vest', 'clothesUp', 'clothesDown', 'shoes', 'backpack'].indexOf(props.item.category) >= 0;
        });
        const isWearable = computed(() => {
            const isProperFrom = props.from === 'inventory' || props.from === 'around';
            return isProperFrom &&
                ['weapons_first', 'weapons_second', 'weapons_special', 'head', 'vest', 'clothesUp', 'clothesDown', 'shoes', 'backpack'].indexOf(props.item.category) >= 0;
        })
        const isBackpack = computed(() => {
            return props.item.category === 'backpack';
        })
        const isUsable = computed(() => {
            return ['food', 'medicine', 'other', 'ammo'].indexOf(props.item.category) >= 0;
        })

        // Вычисляемый стиль для позиции меню
        const menuStyles = computed(() => ({
        top: props.position.top,
        left: props.position.left,
        }));

        return {
            menuStyles,
            isArmor,
            isWearable,
            isBackpack,
            isUsable
        };
    },
});
</script>

<style scoped>
.context-menu {
    position: absolute;
    z-index: 1000;
    background: rgba(116, 130, 121, 0.791);
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.context-menu button {
    background: #f0f0f0;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-family: "Roboto", serif;
    text-transform: uppercase;
}

.context-menu button:hover {
    background: #ddd;
}

.context-menu button:disabled {
    cursor: not-allowed;
    color: rgb(209, 92, 92);
}
</style>