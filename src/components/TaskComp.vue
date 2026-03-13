
<template>
    <div>
        <a-button type="primary" @click="showModal" style="float: inline-end;">Add Task</a-button>
        <a-modal v-model:open="open" title="Add Task" @ok="addTask">
            <div>
                <h4>Title</h4>
                <a-input type="text" v-model:value="task.title"/>
            </div>
            <div>
                <h4>Description</h4>
                <a-input type="text" v-model:value="task.description"/>
            </div>
            <div>
                <h4>Due Date</h4>
                <date-picker type="text"  v-model:value="task.dueDate"/>
            </div>
                <h4>Status</h4>
                <a-select
                    ref="select"
                    v-model:value="task.status"
                    style="width: 200px"
                    @focus="focus"
                    @change="handleChange"
                > 
                <a-select-option value="READY">Ready</a-select-option>
                <a-select-option value="PENDING">Pending</a-select-option>
                <a-select-option value="CANCELLED">Cancelled</a-select-option>
                <a-select-option value="IN_PROGRESS">in progress</a-select-option>
                <a-select-option value="COMPLETED">Completed</a-select-option>
                </a-select>
            <div>
                <h4>User</h4>
                <a-select
                  v-model:value="task.userId"
                  show-search
                  allow-clear
                  :options="options"
                  :filter-option="filterOption"
                  style="width: 200px"
                >
                </a-select>
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
import { onMounted, ref} from 'vue'

const tasks = ref([]);
const task = ref({
    title: '',
    description: '',
    dueDate: '',
    status:'',
    userId: null
});
const open = ref(false);

const filterOption = (input, option) => {
  return option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0;
}

const options = ref([
  {
    label: 'Sahin',
    value: '1'
  },
  {
    label: 'SahinAdmin',
    value: '2'
    
  }
  
]);


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

const focus = () => {
  console.log('focus');
}

const handleChange = value => {
  console.log(`selected ${value}`);
}



onMounted(async () => {

await getTasks();
    console.log('gelen sonuc: ' + tasks.value.length);
})
</script>


