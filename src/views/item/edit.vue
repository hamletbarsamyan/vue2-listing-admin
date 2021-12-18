<template>
  <item-detail :is-edit="true"/>
</template>

<script>
import ItemDetail from './components/ItemDetail';

export default {
  name: 'EditForm',
  components: { ItemDetail }
};
</script>

