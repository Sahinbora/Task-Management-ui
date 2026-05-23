<template>
  <div>
    <a-card :bordered="false" class="header-solid mb-24" title="Tasks Table List">
      <div class="table-action-bar">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="Başlık veya açıklama ara..."
          enter-button
          allow-clear
          @search="handleTaskSearch"
          style="width: 280px"
        />
        <a-button type="primary" @click="showAddModal">Add Task</a-button>
      </div>

      <a-modal v-model:open="open" :title="isEditMode ? 'Edit Task' : 'Add Task'" @ok="handleModalOk" :width="520">
        <div class="modal-form-item">
          <h4>Title</h4>
          <a-input type="text" v-model:value="taskForm.title" placeholder="Enter task title" />
        </div>
        <div class="modal-form-item">
          <h4>Description</h4>
          <a-textarea v-model:value="taskForm.description" placeholder="Enter task description" :rows="3" />
        </div>
        <div class="modal-form-item">
          <h4>Due Date</h4>
          <date-picker v-model:value="taskForm.dueDate" style="width: 100%" />
        </div>
        <div class="modal-form-item">
          <h4>Status</h4>
          <a-select ref="select" v-model:value="taskForm.status" style="width: 100%">
            <a-select-option value="READY">Ready</a-select-option>
            <a-select-option value="PENDING">Pending</a-select-option>
            <a-select-option value="CANCELLED">Cancelled</a-select-option>
            <a-select-option value="IN_PROGRESS">In Progress</a-select-option>
            <a-select-option value="COMPLETED">Completed</a-select-option>
          </a-select>
        </div>
        <div class="modal-form-item">
          <h4>Assign User</h4>
          <a-select
            v-model:value="taskForm.userId"
            show-search
            allow-clear
            :options="users"
            :filter-option="false"
            @search="handleUserSearch"
            :field-names="{ label: 'name', value: 'id' }"
            placeholder="Search for a user..."
            style="width: 100%"
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
          <template v-else-if="column.key === 'dueDate'">
            {{ record.dueDate ? new Date(record.dueDate).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
          </template>
          <template v-else-if="column.key === 'action'">
            <span style="display: inline-flex; gap: 8px;">
              <a-button type="text" shape="circle" @click="showEditModal(record)">
                <template #icon><edit-outlined /></template>
              </a-button>
              <a-popconfirm title="Are you sure to delete this task?" ok-text="Yes" cancel-text="No" @confirm="deleteTaskById(record.id)">
                <a-button type="text" danger shape="circle">
                  <template #icon><delete-outlined /></template>
                </a-button>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { DatePicker, message } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import TaskService from '@/service/TaskService';
import dayjs from 'dayjs';

const tasks = ref([]);
const users = ref([]);
const tableLoading = ref(false);
const open = ref(false);
const isEditMode = ref(false);
const searchQuery = ref('');

const taskForm = ref({
  id: null,
  title: '',
  description: '',
  dueDate: null,
  status: 'READY',
  userId: null
});

let userSearchTimeout = null;

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
    title: 'Due Date',
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

const getTasks = async () => {
  tableLoading.value = true;
  try {
    tasks.value = await TaskService.getTasks();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    message.error('Tasks could not be loaded');
  } finally {
    tableLoading.value = false;
  }
};

const getUsers = async () => {
  try {
    const rawUsers = await TaskService.getUsers();
    users.value = rawUsers.map(user => ({
      ...user,
      name: user.email ? `${user.name} (${user.email})` : user.name
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const handleTaskSearch = async (val) => {
  if (!val || val.trim() === '') {
    await getTasks();
    return;
  }

  tableLoading.value = true;
  try {
    // Call backend API for title and description search
    const titleRes = await fetch(`/api/tasks/searched?title=${val}`).then(res => res.json());
    const descRes = await fetch(`/api/tasks/search?description=${val}`).then(res => res.json());

    // Combine results and de-duplicate by ID
    const combined = [...titleRes, ...descRes];
    const uniqueTasks = [];
    const seenIds = new Set();
    for (const t of combined) {
      if (!seenIds.has(t.id)) {
        seenIds.add(t.id);
        uniqueTasks.push(t);
      }
    }
    tasks.value = uniqueTasks;
  } catch (error) {
    console.error('Search error:', error);
    message.error('Search failed');
  } finally {
    tableLoading.value = false;
  }
};

const handleUserSearch = (val) => {
  if (!val || val.trim() === '') {
    getUsers();
    return;
  }

  clearTimeout(userSearchTimeout);
  userSearchTimeout = setTimeout(() => {
    fetch(`/api/users/search?name=${val}`)
      .then(res => res.json())
      .then(data => {
        users.value = data.slice(0, 5).map(user => ({
          ...user,
          name: user.email ? `${user.name} (${user.email})` : user.name
        }));
      })
      .catch(err => console.error('User search error:', err));
  }, 300);
};

const handleModalOk = async () => {
  if (isEditMode.value) {
    await updateTask();
  } else {
    await addTask();
  }
};

const addTask = async () => {
  if (!taskForm.value.title || taskForm.value.title.trim() === '') {
    message.warning('Please enter a task title');
    return;
  }

  try {
    await TaskService.addTask(taskForm.value);
    message.success('Added Task Successfully');
    
    // Reset form
    taskForm.value = {
      id: null,
      title: '',
      description: '',
      dueDate: null,
      status: 'READY',
      userId: null
    };

    open.value = false;
    await getTasks();
  } catch (error) {
    console.error('Error adding task:', error);
    message.error('Something went wrong while adding task');
  }
};

const updateTask = async () => {
  if (!taskForm.value.title || taskForm.value.title.trim() === '') {
    message.warning('Please enter a task title');
    return;
  }

  try {
    await TaskService.updateTask(taskForm.value);
    message.success('Task Updated Successfully');
    
    // Reset form
    taskForm.value = {
      id: null,
      title: '',
      description: '',
      dueDate: null,
      status: 'READY',
      userId: null
    };

    open.value = false;
    await getTasks();
  } catch (error) {
    console.error('Error updating task:', error);
    message.error('Something went wrong while updating task');
  }
};

const deleteTaskById = async (id) => {
  try {
    await TaskService.deleteTaskById(id);
    message.success('Task Deleted Successfully');
    await getTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
    message.error('Something went wrong while deleting task');
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

const showAddModal = () => {
  isEditMode.value = false;
  taskForm.value = {
    id: null,
    title: '',
    description: '',
    dueDate: null,
    status: 'READY',
    userId: null
  };
  open.value = true;
};

const showEditModal = (record) => {
  isEditMode.value = true;
  taskForm.value = {
    id: record.id,
    title: record.title,
    description: record.description,
    dueDate: record.dueDate ? dayjs(record.dueDate) : null,
    status: record.status,
    userId: record.userId
  };
  open.value = true;
};

onMounted(async () => {
  await getTasks();
  await getUsers();
});
</script>

<style scoped>
.table-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.mb-24 {
  margin-bottom: 24px;
}

.modal-form-item {
  margin-bottom: 16px;
}

.modal-form-item h4 {
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #262626;
}

.header-solid {
  background: #ffffff !important;
  border-radius: 12px !important;
  box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05) !important;
  padding: 16px;
  text-align: left;
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
