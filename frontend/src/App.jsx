import { useEffect, useState } from "react"
import {useForm} from "react-hook-form";
import {api} from './utils/api';
import {QueryClientProvider, QueryClient} from 'react-query';

const TodoItem = ({todo, setRefresh}) => {

  const deleteTodo = () => {
    api.delete(`/task/${todo._id}`)
    .then(res => console.log(res.data) )
    .catch()
    .finally(() => setRefresh(true));
  }
  return (<li onClick={deleteTodo} key={todo._id}>{todo.description}</li>)
}

const Todos = () => {

  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const {register, handleSubmit, formState: {errors, isSubmitting, isValid}, setValue} = useForm();

  useEffect(() => {

    if(refresh){
      setIsLoading(true);
      api.get(`/task`)
      .then(res => setTodos([...res.data]))
      .catch(e => console.log(e))
      .finally(() => {
        setIsLoading(false);
        setRefresh(false)}
        );
    }
    

  }, [refresh]);


  const addNewTodo = (todoData) => {
    api.post(`/task`, todoData)
    .then(res => {
      setValue('description', undefined);
    } )
    .catch(e => console.log(e))
    .finally(() => setRefresh(true));
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center'}}>
      <h1>My Todo App</h1>
      {isLoading && (<div>Cargando...</div>)}
      {!isLoading &&  (<ul>
        {todos.map(todo => (
          <TodoItem todo={todo} setRefresh={setRefresh}/>
        ))}
      </ul>)}
      
      
      <form onSubmit={handleSubmit(addNewTodo)}>
        <input placeholder="Do the laundry" {...register('description', {required: { value: true, message: 'Describe the task'}})}/>
        <button type="submit" disabled={!isValid || isSubmitting}>Add Todo</button>
        {errors.description && <div style={{color: 'red', fontSize: 12}}>{errors.description.message}</div>}
      </form>
     
    </div>
  )


}



const queryClient = new QueryClient()


function App() {

    return (
      <QueryClientProvider client={queryClient}>
        <Todos/>
      </QueryClientProvider>
  )
}

export default App
