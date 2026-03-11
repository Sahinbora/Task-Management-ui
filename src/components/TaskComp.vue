
<template>
    <div>
        <a-button type="primary" @click="showModal" style="float: inline-end;">Add Task</a-button>
        <a-modal v-model:open="open" title="Add Task" @ok="addTask">
            <div>
                <label for="">Title</label>
                <a-input type="text" v-model:value="task.title"/>
            </div>
            <div>
                <label for="">Description</label>
                <a-input type="text" v-model:value="task.description"/>
            </div>
            <div>
                <label for="">Due Date</label>
                <date-picker type="text"  v-model:value="task.dueDate"/>
            </div>
            <div>
                <label for="">Status</label>
                <a-input type="text" v-model:value="task.status"/>
            </div>
            <div>
                <label for="">User</label>
                <a-input type="text" v-model:value="task.userId"/>
            </div>
        </a-modal>
    </div>
  <a-table :columns="columns" :data-source="tasks">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'title'">
          {{ record.title }}
      </template>
      
      <template v-else-if="column.key === 'action'">
        <span>
          
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
import { DatePicker } from 'ant-design-vue';
import { onMounted,ref } from 'vue'

const tasks = ref([]);
const task = ref({
    title: '',
    description: '',
    dueDate: '',
    status:'',
    userId: null
});
const open = ref(false);

const getTasks = async () => {

    tasks.value = await TaskService.getTasks();

}; 

const addTask = async () => {
 
    await TaskService.addTask(task.value);

    task.value = {
      title: '',
      description: '',
      dueDate: '',
      status:'',
      userId: null
    }
    open.value = false;

    await getTasks();

}

const showModal = async () => {
    open.value = true;
}


onMounted(async () => {

await getTasks();
    console.log('gelen sonuc: ' + tasks.value.length);
})
</script>


