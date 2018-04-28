<template>
  <div>
    <div class="app-body-header">
      <div class="title"><slot name="header-title"></slot></div>
      <div class="actions"><slot name="header-actions"></slot></div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "v-app"
  }
</script>
