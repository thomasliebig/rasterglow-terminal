<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RasterGlowEngine, type RasterGlowSettings } from './engine'
import './style.css'

const props = withDefaults(defineProps<{ cols?: number; rows?: number; settings?: Partial<RasterGlowSettings>; autofocus?: boolean }>(), { cols: 100, rows: 30, autofocus: true })
const emit = defineEmits<{ data: [data: string]; resize: [size: { cols: number; rows: number }] }>()
const root = ref<HTMLElement>(); let engine: RasterGlowEngine | undefined
function write(data: string) { engine?.write(data) }
function clear() { engine?.clear() }
function focus() { engine?.focus() }
function setSettings(settings: Partial<RasterGlowSettings>) { engine?.setSettings(settings) }
defineExpose({ write, clear, focus, setSettings })
onMounted(() => { engine = new RasterGlowEngine(root.value!, { cols: props.cols, rows: props.rows, settings: props.settings, onData: data => emit('data', data), onResize: size => emit('resize', size) }); if (props.autofocus) engine.focus() })
onBeforeUnmount(() => engine?.dispose())
</script>
<template><section ref="root" class="rasterglow" tabindex="0"><div class="rasterglow__glass"><canvas class="rasterglow__canvas" /></div><img class="rasterglow__bezel" src="./assets/crt-monitor-frame.png" alt="" draggable="false"><span class="rasterglow__status" /></section></template>
