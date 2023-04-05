<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <select
      :value="value"
      v-bind="$attrs"
      @change="updateValue"
      v-on="$listeners"
    >
      <option
        v-for="option in options"
        :key="option.id"
        :value="option"
        :selected="option === value"
        >{{ option }}</option
      >
    </select>
  </div>
</template>
<script>
import { formFieldMixin } from '../mixins/formFieldMixin' // import mixin
export default {
  mixins: [formFieldMixin], // register mixin
  props: {
    options: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped></style>
