<script setup lang='ts'>
const { count, inc, dec } = useCount()
</script>

<template>
    <div className="absolute right-4 top-40 flex w-16 flex-col gap-1 overflow-hidden rounded-md bg-background md:top-60">
          <span
            className="flex items-center justify-center bg-purpleDark p-1 font-bold text-text"
          >
            2x
          </span>
    </div>
</template>
