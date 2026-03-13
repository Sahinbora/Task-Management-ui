<template>
    <a-modal v-model:open="open" title="Add Task To User" @ok="addUserTask">
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
   <a-table :columns="columns" :data-source="users">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
          {{ record.name }}
      </template>
      
      <template v-else-if="column.key === 'action'">
        <span>
          <a-button type="primary" @click="showModal" style="float: center;">+</a-button>
        </span>
      </template>
      
    </template>

  </a-table>
</template>

<script setup>

import AdminService from '@/service/AdminService';
import { DatePicker } from 'ant-design-vue';
import { ref , onMounted } from 'vue';

const users = ref([]);
const open = ref(false);
const task = ref({
    title: '',
    description: '',
    dueDate: '',
    status:'',
    userId: null
});

const columns = [
  
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Action',
    key: 'action',
  },
];

const getUsers = async () => {
    users.value = await AdminService.getUsers();
}

const addUserTask = async () => {
 
    await AdminService.addUserTask(task.value);

    task.value = {
      title: '',
      description: '',
      dueDate: '',
      status:'',
      userId: null
    }
    open.value = false;

}

const showModal = async () => {
    open.value = true;
}


onMounted(async () => {
    await getUsers();
    console.log('gelen sonuc: ' + users.value.length)
})

</script>