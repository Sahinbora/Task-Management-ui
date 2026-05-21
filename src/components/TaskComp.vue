
<template>
    <a-layout class="layout-dashboard" id="layout-dashboard">
        <a-layout-sider :trigger="null" collapsible width="250" class="sidebar-fixed">
            <div class="brand">
                <img src="https://demos.creative-tim.com/muse-vue-ant-design-dashboard/images/logo-ct-black.png" 
                alt="Muse Logo" />
                <span>Task Management Workspace</span>
            </div>
        <hr />
            <a-menu mode="inline" :selected-keys="[activePage]"
            @click="handleMenuClick"
            >
                <a-menu-item key="dashboard">
                <template #icon>📊</template>
                <span>Dashboard</span>
                </a-menu-item>
                <a-menu-item key="tasks">
                <template #icon>📝</template>
                <span>Tasks</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>

    <a-layout>
        <a-layout-header class="navbar-header">
            <div class="header-title">
                <h5>{{ activePage === 'dashboard' ? 'Dashboard Overview' : 'Tasks Management' }}</h5>
            </div>
        </a-layout-header>

        <a-layout-content class="content-body">

            <div v-if="activePage === 'dashboard'">
                <a-row :gutter="[24, 24]" style="margin-bottom: 24px;">
                    <a-col :xs="24" :sm="12" :md="6" v-for="(card, index) in statCards" :key="index">
                    <a-card :bordered="false" class="widget-card">
                        <div class="widget-content">
                        <p>{{ card.title }}</p>
                        <h3>{{ card.value }}</h3>
                        </div>
                    </a-card>
                    </a-col>
                </a-row>

                <a-card :bordered="false" class="header-solid">
                    <h4>Welcome to your Workspace!</h4>
                    <p style="color: #8c8c8c;
                    ">Yukarıdaki kartlardan görevlerinizin genel durumunu izleyebilirsiniz. 
                    Görevleri yönetmek, eklemek veya silmek için sol menüden <strong>Task List</strong>
                     sayfasına geçiş yapın.</p>
                </a-card>
            </div>
    
            <div v-else-if="activePage === 'tasks'">
                <a-card :bordered="false" class="header-solid mb-24" title="Tasks Table List">

                    <div class="table-action-bar">
                        <a-select
                            v-model:value="task"
                            show-search
                            allow-clear
                            :options="tasks"
                            :field-names="{ label: 'title', value: 'id' }"
                            placeholder="Başlık veya açıklama ara..."
                            :filter-option="false"
                            @search="handleSearched"
                            style="float: inline-start; width: 200px"
                        >
                        <template #suffixIcon>
                            <search-outlined style="color: rgba(0, 0, 0, 0.45)" />
                        </template>
                        </a-select>
                    </div>
                    <a-button type="primary" @click="showModal" style="float: inline-end;">Add Task</a-button>
                    <a-modal v-model:open="open" title="Add Task" @ok="addTask" :width="520">
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
                                :options="users"
                                :filter-option="false"
                                @search="handleSearch"
                                :field-names="{ label: 'name', value: 'id' }"
                                style="width: 200px"
                            >
                            </a-select>
                        </div>
                    </a-modal>
                    <a-table 
                    :columns="columns" 
                    :data-source="tasks" 
                    :loading="tableLoading"
                    row-key="id"
                    class="muse-table"
                    :pagination="{ pageSize: 8 }"
                    >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'title'">
                                <span style="font-weight: 600; color: #262626;">{{ record.title }}</span>
                            </template>
                            <template v-else-if="column.key === 'status'">
                                <a-tag :color="getStatusColor(record.status)">
                                    {{ record.status }}
                                </a-tag>
                            </template>
                            <template v-else-if="column.key === 'date'">
                                {{ record.date ? new Date(record.date)
                                .toLocaleDateString('tr-TR', 
                                { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                            </template>
                        
                            <template v-else-if="column.key === 'action'">
                                <span>   
                                <a-popconfirm title="Are you sure?" ok-text="Yes" cancel-text="No"
                                 @confirm="deleteTaskById(record.id)">
                                    <a-button type="text" danger shape="circle">
                                        <template #icon><delete-outlined /></template>
                                    </a-button>
                                </a-popconfirm>
                                </span>
                            </template>
                            <template v-else>
                                {{ record[column.dataIndex] }}
                            </template>
                        </template>
                    </a-table>
                </a-card>
            </div>               
        </a-layout-content>
    </a-layout>
    </a-layout>
  
</template>

<script setup>

    import TaskService from '@/service/TaskService';
    import { DatePicker, message } from 'ant-design-vue';
    import { DeleteOutlined } from '@ant-design/icons-vue';
    import { onMounted, ref} from 'vue'
    import { computed } from 'vue';

    const statCards = computed(() => [
        { title: 'Total Tasks', value: totalTasks.value },
        { title: 'In Progress', value: inProgressTasks.value },
        { title: 'Completed', value: completedTasks.value },
        { title: 'Pending', value: pendingTasks.value },
    ]);

    const totalTasks = computed(() => {
        return tasks.value ? tasks.value.length : 0;
    });

    const inProgressTasks = computed(() => {
        if (!tasks.value) return 0;
        return tasks.value.filter(item => item.status === 'IN_PROGRESS').length;
    });

    const completedTasks = computed(() => {
        if (!tasks.value) return 0;
        return tasks.value.filter(item => item.status === 'COMPLETED').length;
    });

    const pendingTasks = computed(() => {
        if (!tasks.value) return 0;
        return tasks.value.filter(item => item.status === 'READY' || item.status === 'PENDING').length;
    });

    const activePage = ref('dashboard');

    const handleMenuClick = (e) => {
        activePage.value = e.key;
    };

    let searchTimeout = null;
    const tableLoading = ref(false);

    const columns = [
  
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
        },
        {
            title: 'Date',
            key: 'dueDate',
            dataIndex: 'dueDate',
            width: '20%',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            width: '15%',
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
        }
    ];


    const tasks = ref([]);
    const users = ref([]);
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

    const getUsers = async () => {

        users.value = await TaskService.getUsers();
    };

    const addTask = async () => {

        try {
            await TaskService.addTask(task.value);
            message.success('Added Task Successfully');

            task.value = {
                title: '',
                description: '',
                dueDate: '',
                status:'',
                userId: null
            }
      
            open.value = false;

            await getTasks();
        } catch (error) {
            console.error("somethings wrong:", error);
            message.error('Something goes wrong');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            READY: 'blue',
            PENDING: 'orange',
            IN_PROGRESS: 'purple',
            COMPLETED: 'success',
            CANCELLED: 'error'
        };
        return colors[status] || 'default';
    };


    const deleteTaskById = async (id) => {

        try {
            await TaskService.deleteTaskById(id);
            message.success('Task Deleted Successfully');
            await getTasks();
        } catch (error) {
            console.error("Somethings wrong:", error);
            message.error('Something goes wrong');
        }
    
    };

    const showModal = async () => {

        open.value = true;
    };


    const handleSearch = (val) => {

        console.log("Aranan Değer:", val)
        fetch(`/api/users/search?name=${val}`)
        .then(res => res.json())
        .then(data => {
            users.value = data.slice(0, 5);
        })
        clearTimeout(searchTimeout);
  
        // Kullanıcı 300ms boyunca yeni bir harfe basmazsa API'ye istek at
        searchTimeout = setTimeout(() => {
            tableLoading.value = true;
            
            // Burada API arama isteğini tetikliyorsun
            // axios.get(`/api/tasks?search=${searchValue}`).then(...)
            
            console.log("API'ye giden arama sorgusu:", val);
        }, 300);
    };

    const handleSearched = (val) => {

       if (!val) {
        tasks.value = [];
        return;
    }

    
    let titleGroup = { label: 'Başlıkta Bulunanlar', options: [] };
    let descGroup = { label: 'Açıklamada Bulunanlar', options: [] };

    
    fetch(`/api/tasks/searched?title=${val}`)
        .then(res => res.json())
        .then(data1 => {
            titleGroup.options = data1; 
            
            
            return fetch(`/api/tasks/search?description=${val}`);
        })
        .then(res => res.json())
        .then(data2 => {
            descGroup.options = data2; 
            
            
            tasks.value = [titleGroup, descGroup];
        })
        .catch(err => console.error("Hata:", err));
    };



    onMounted(async () => {

        await getTasks();
        console.log('gelen sonuc: ' + tasks.value.length);

        await getUsers();
        console.log('gelen sonuc: ' + users.value.length);
    });

    
</script>

<style scoped>

.layout-dashboard {
  background-color: #f8f9fa !important;
  min-height: 100vh;
}


.sidebar-fixed {
  background: #ffffff !important;
  border-right: 1px solid #e2e8f0;
}
.brand {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
}
.brand img {
  width: 30px;
}
.brand span {
  font-weight: 700;
  color: #141414;
  font-size: 16px;
}


.navbar-header {
  background: transparent !important;
  padding: 16px 24px !important;
  height: auto !important;
}
.header-title h5 {
  font-weight: 700;
  color: #141414;
  margin: 0;
  font-size: 18px;
}

.content-body {
  padding: 0 24px 24px 24px;
}


.widget-card {
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05) !important;
}
.widget-content p {
  color: #8c8c8c;
  font-size: 12px;
  margin-bottom: 2px;
  font-weight: 600;
  text-transform: uppercase;
}
.widget-content h3 {
  font-weight: 700;
  color: #141414;
  margin: 0;
  font-size: 24px;
}


.header-solid {
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05) !important;
  padding: 16px;
}


.table-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}


.ant-btn-gradient {
  background: linear-gradient(135deg, #141414 0%, #434343 100%) !important;
  border: none !important;
  color: white !important;
  border-radius: 8px !important;
  font-weight: 600;
}


:deep(.ant-table) {
  background: #ffffff !important;
}
:deep(.ant-table-thead > tr > th) {
  background: transparent !important;
  color: #8c8c8c !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  border-bottom: 1px solid #f0f0f0 !important;
}
:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f0f0f0 !important;
}
</style>

