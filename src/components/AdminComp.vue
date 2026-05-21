<template>
    <a-modal v-model:open="open" title="Add Task To User" @ok="addUserTask">
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
        <div>
            <h4>Status</h4>
            <a-select
                ref="select"
                v-model:value="task.status"
                style="width: 200px"
            > 
                <a-select-option value="READY">Ready</a-select-option>
                <a-select-option value="PENDING">Pending</a-select-option>
                <a-select-option value="CANCELLED">Cancelled</a-select-option>
                <a-select-option value="IN_PROGRESS">in progress</a-select-option>
                <a-select-option value="COMPLETED">Completed</a-select-option>
            </a-select>
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
        }
    ];

    const getUsers = async () => {

        users.value = await AdminService.getUsers();
    };

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
    };

    const showModal = async () => {

        open.value = true;
    };

    onMounted(async () => {

        await getUsers();
        console.log('gelen sonuc: ' + users.value.length)
    });
</script>