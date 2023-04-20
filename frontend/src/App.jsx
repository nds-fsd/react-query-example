import {useForm} from "react-hook-form";
import {api} from './utils/api';
import {QueryClientProvider, QueryClient, useQuery, useQueryClient, useMutation} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

const TodoItem = ({todo}) => {

  const queryClient = useQueryClient();

  const deleteTodo = () => {
    api.delete(`/task/${todo._id}`)
    .then(res => console.log(res.data) )
    .catch(e => console.log(e))
    .finally(() => queryClient?.invalidateQueries('todos'));
  }
  return (<li onClick={deleteTodo} key={todo._id}>{todo.description}</li>)
}

const Todos = () => {
  const queryClient = useQueryClient();

  const {register, handleSubmit, formState: {errors, isSubmitting, isValid}, setValue} = useForm();

  const {data, isLoading} = useQuery('todos', 
  async () => {
    const res = await api.get('/task');
    return res.data;
  })

  const addNewTodo = (todoData) => {
    api.post(`/task`, todoData)
  }
  const mutation = useMutation(addNewTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('todos');
      setValue('description', undefined);
    },
  })


  const onSubmit = (todoData) => {
    mutation.mutate(todoData);
  }

  
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center'}}>
      <h1>My Todo App</h1>
      {isLoading && (<div>Cargando...</div>)}
      {!isLoading &&  (<ul>
        {data.map(todo => (
          <TodoItem todo={todo}/>
        ))}
      </ul>)}
      
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="Do the laundry" {...register('description', {required: { value: true, message: 'Describe the task'}})}/>
        <button type="submit" disabled={!isValid || mutation.isSubmitting}>{mutation.isSubmitting ? 'enviando...' : 'Add Todo'}</button>
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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  )
}

export default App
