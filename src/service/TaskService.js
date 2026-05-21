
class TaskService {

    async getTasks() {
        const taskResponse = await fetch('/api/tasks/all')
        .then(response => response.json())
        return taskResponse;
    }

    async getUsers() {
        const userResponse = await fetch('/api/users/all')
        .then(response => response.json())
        return userResponse;
    }

    async addTask(taskData) {
        await fetch('api/tasks/add', {
            method: "POST",
            headers: {
            'Content-Type': 'application/json' 
            },
            body:JSON.stringify({
                title: taskData.title,
                description: taskData.description,
                dueDate: taskData.dueDate,
                status: taskData.status,
                userId: taskData.userId
            })
        
        })
        .then(response => response.json())
    }

    async deleteTaskById(id) {
        await fetch(`api/tasks/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json' 
        }
        })
    }
        

}

export default new TaskService();