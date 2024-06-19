import {
  createTask,
  useQuery,
  getTasks,
  updateTask
} from "wasp/client/operations";
import { ChangeEvent, FormEvent } from "react";
import { Task } from "wasp/entities";
import { AuthUser } from "wasp/auth";
import { logout } from "wasp/client/auth";

export const MainPage = ({ user }: { user: AuthUser }) => {
  const { data: tasks, isLoading, error } = useQuery(getTasks);

  return (
    <div>
      <NewTaskForm />
      {tasks && <TasksList tasks={tasks} />}
      <button onClick={logout}>Logout</button>

      {isLoading && "Loading..."}
      {error && "Error: " + error}
    </div>
  );
};

const TaskView = ({ task }: { task: Task }) => {
  const handleIsDoneChange = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const checked = event.target.checked;
      await updateTask({
        id: task.id,
        isDone: checked
      });
    } catch (err: any) {
      window.alert("Error: " + err.message);
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        id={String(task.id)}
        checked={task.isDone}
        onChange={handleIsDoneChange}
      />
      {task.description}
    </div>
  );
};

const TasksList = ({ tasks }: { tasks: Task[] }) => {
  if (!tasks?.length) return <div>No tasks</div>;

  return (
    <div>
      {tasks.map((task, idx) => (
        <TaskView task={task} key={idx} />
      ))}
    </div>
  );
};

const NewTaskForm = () => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const target = event.target as HTMLFormElement;
      const description = target.description.value;
      target.reset();
      await createTask({ description });
    } catch (err: any) {
      window.alert("Error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="description" type="text" defaultValue="" />
      <input type="submit" value="Create task" />
    </form>
  );
};
