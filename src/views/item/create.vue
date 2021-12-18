<template>
  <item-detail :is-edit="false"/>
</template>

<script>
import ItemDetail from './components/ItemDetail';

export default {
  name: 'CreateForm',
  components: { ItemDetail }
};
</script>

