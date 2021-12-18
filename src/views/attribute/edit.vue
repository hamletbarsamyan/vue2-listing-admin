<template>
  <attribute-detail :is-edit="true"/>
</template>

<script>
import AttributeDetail from './components/AttributeDetail';

export default {
  name: 'EditForm',
  components: { AttributeDetail }
};
</script>

