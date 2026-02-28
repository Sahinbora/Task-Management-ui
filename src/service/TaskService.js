import axios from "axios";


const TASK_API_BASE_URL = 'http://localhost:8080/tasks/all';

    
class TaskService {

    async getTasks() {
        const taskResponse = await axios.get(TASK_API_BASE_URL)
        return taskResponse;
        
    }
        

}

export default new TaskService();