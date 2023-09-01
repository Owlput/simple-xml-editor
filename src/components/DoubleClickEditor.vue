<script setup>
import { ref } from 'vue';
const props = defineProps({
    valueUpdate:Function,
    content:String,
})
const content = ref(props.content);
const editable = ref(false)
function confirmModify(){
    props.valueUpdate(content.value);
    editable.value = false;
}
</script>
<template>
    <input v-if="editable" v-model="content" @keyup.enter="confirmModify"/>
    <p v-else @dblclick="()=>{editable = true}">{{ content }}</p>
</template>