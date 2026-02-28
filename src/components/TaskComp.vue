
<template>
  <a-table :columns="columns" :data-source="tasks">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'title'">
        <span>
        
          Title
        </span>
      </template>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'title'">
        <a>
          {{ record.name }}
        </a>
      </template>
      
      <template v-else-if="column.key === 'action'">
        <span>
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <down-outlined />
          </a>
        </span>
      </template>
    </template>
  </a-table>
</template>

<script setup>
    const columns = [
  
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Date',
    key: 'dueDate',
    dataIndex: 'dueDate',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: 'Action',
    key: 'action',
  },
];


import TaskService from '@/service/TaskService';
import { onMounted,ref } from 'vue'

const tasks = ref([]);

const getTasks = async () => {

    tasks.value = await TaskService.getTasks()

}; 


onMounted(async () => {

await getTasks();
    console.log('gelen sonuc: ' + tasks.value.length);
})
</script>


