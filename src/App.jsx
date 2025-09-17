import './App.css'
import TagInput from './TagInput'
import Form from './Form'
import ControlledForm from './ControlledForm'
import TicTacToe from './TicTacToe'
import Chess from './Chess'


const App = () => {
  return (
    <div className="content">
      <h1>Hello, World</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <div className='games'>
        <Form />
        <ControlledForm />
        {/* <TagInput />
        <TicTacToe /> */}
        <Chess />
      </div>
    </div>
  )
}

export default App
